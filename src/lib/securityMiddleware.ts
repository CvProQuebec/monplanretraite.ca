import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import { securityLogger, SecurityEventType, SecuritySeverity } from './securityLogger';

// Configuration du rate limiting
export const createRateLimiter = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
  keyGenerator?: (req: any) => string;
}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes par défaut
    max: options.max || 100, // 100 requêtes par défaut
    message: options.message || 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: options.keyGenerator || ((req) => {
      // Utiliser l'IP ou l'ID utilisateur si disponible
      return req.headers['x-forwarded-for'] || req.ip || 'unknown';
    }),
    handler: (req, res) => {
      // Logger l'événement de rate limiting
      securityLogger.log(
        SecurityEventType.RATE_LIMIT_EXCEEDED,
        SecuritySeverity.MEDIUM,
        `Rate limit exceeded for IP: ${req.ip || 'unknown'}`,
        {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          endpoint: req.path,
          method: req.method
        },
        {
          windowMs: options.windowMs,
          max: options.max,
          currentCount: req.rateLimit?.current || 0
        }
      );

      res.status(429).json({
        error: 'Rate limit exceeded',
        message: options.message || 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
        retryAfter: Math.ceil(options.windowMs || 15 * 60 * 1000 / 1000)
      });
    }
  });
};

// Rate limiters spécifiques
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requêtes par minute
  message: 'Trop de requêtes API. Veuillez ralentir.'
});

export const formSubmissionRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // 10 soumissions par heure
  message: 'Trop de soumissions de formulaire. Veuillez réessayer plus tard.'
});

// Configuration CSRF
export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  value: (req) => {
    return req.headers['x-csrf-token'] || req.body._csrf;
  }
});

// Middleware pour gérer les erreurs CSRF
export const handleCSRFError = (err: any, req: any, res: any, next: any) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // Logger la tentative d'attaque CSRF
    securityLogger.log(
      SecurityEventType.CSRF_ATTEMPT,
      SecuritySeverity.HIGH,
      'CSRF token validation failed',
      {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        endpoint: req.path,
        method: req.method,
        providedToken: req.headers['x-csrf-token'] || req.body._csrf
      },
      {
        expectedToken: req.csrfToken(),
        referrer: req.headers.referer
      }
    );

    return res.status(403).json({
      error: 'CSRF token validation failed',
      message: 'Token de sécurité invalide. Veuillez rafraîchir la page et réessayer.',
      code: 'CSRF_ERROR'
    });
  }
  next(err);
};

// Middleware pour ajouter le token CSRF aux réponses
export const addCSRFToken = (req: any, res: any, next: any) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

// Middleware de sécurité général
export const securityHeaders = (req: any, res: any, next: any) => {
  // Headers de sécurité supplémentaires
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Supprimer les headers qui peuvent révéler des informations
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  next();
};

// Middleware pour valider les tokens de session
export const validateSessionToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    // Logger la tentative d'accès non autorisé
    securityLogger.log(
      SecurityEventType.UNAUTHORIZED_ACCESS,
      SecuritySeverity.MEDIUM,
      'No authentication token provided',
      {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        endpoint: req.path,
        method: req.method
      },
      {
        requiredAuth: true,
        providedHeaders: Object.keys(req.headers)
      }
    );

    return res.status(401).json({
      error: 'No token provided',
      message: 'Token d\'authentification requis.'
    });
  }
  
  // Ici vous pouvez ajouter la validation JWT
  // Pour l'instant, on passe au middleware suivant
  next();
};

// Middleware pour logger les tentatives d'attaque
export const securityLogger = (req: any, res: any, next: any) => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /exec\s*\(/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /vbscript:/i,
    /data:/i
  ];
  
  const userAgent = req.headers['user-agent'] || '';
  const body = JSON.stringify(req.body || {});
  const url = req.url;
  const query = JSON.stringify(req.query || {});
  
  // Vérifier les patterns suspects
  const suspiciousPatternsFound = suspiciousPatterns.filter(pattern => 
    pattern.test(userAgent) || pattern.test(body) || pattern.test(url) || pattern.test(query)
  );
  
  if (suspiciousPatternsFound.length > 0) {
    // Déterminer le type d'attaque
    let attackType = SecurityEventType.INVALID_INPUT;
    let severity = SecuritySeverity.MEDIUM;
    
    if (suspiciousPatternsFound.some(p => /<script|javascript:|on\w+\s*=|<iframe|<object|<embed/i.test(p.source))) {
      attackType = SecurityEventType.XSS_ATTEMPT;
      severity = SecuritySeverity.CRITICAL;
    } else if (suspiciousPatternsFound.some(p => /union\s+select|drop\s+table|exec\s*\(/i.test(p.source))) {
      attackType = SecurityEventType.SQL_INJECTION_ATTEMPT;
      severity = SecuritySeverity.CRITICAL;
    }
    
    // Logger la tentative d'attaque
    securityLogger.log(
      attackType,
      severity,
      `Suspicious activity detected: ${suspiciousPatternsFound.length} patterns found`,
      {
        ip: req.ip,
        userAgent,
        url,
        method: req.method,
        patterns: suspiciousPatternsFound.map(p => p.source),
        body: body.substring(0, 500), // Limiter la taille
        query: query.substring(0, 500)
      },
      {
        endpoint: req.path,
        referrer: req.headers.referer,
        timestamp: new Date().toISOString()
      }
    );
  }
  
  next();
};

// Middleware pour logger les échecs de validation
export const validationLogger = (req: any, res: any, next: any) => {
  const originalJson = res.json;
  
  res.json = function(data: any) {
    // Intercepter les réponses d'erreur de validation
    if (data && data.error === 'Validation failed' && data.details) {
      securityLogger.log(
        SecurityEventType.VALIDATION_FAILED,
        SecuritySeverity.LOW,
        `Input validation failed for endpoint: ${req.path}`,
        {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          endpoint: req.path,
          method: req.method,
          validationErrors: data.details
        },
        {
          body: JSON.stringify(req.body || {}).substring(0, 500),
          query: JSON.stringify(req.query || {}).substring(0, 500)
        }
      );
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Middleware pour logger les succès d'authentification
export const authSuccessLogger = (req: any, res: any, next: any) => {
  const originalJson = res.json;
  
  res.json = function(data: any) {
    // Intercepter les succès d'authentification
    if (data && data.success && req.path.includes('auth')) {
      securityLogger.log(
        SecurityEventType.LOGIN_SUCCESS,
        SecuritySeverity.LOW,
        `Successful authentication for user`,
        {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          endpoint: req.path,
          method: req.method
        },
        {
          userId: data.userId || 'unknown',
          timestamp: new Date().toISOString()
        }
      );
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Middleware pour logger les échecs d'authentification
export const authFailureLogger = (req: any, res: any, next: any) => {
  const originalJson = res.json;
  
  res.json = function(data: any) {
    // Intercepter les échecs d'authentification
    if (data && (data.error === 'Invalid credentials' || data.error === 'Authentication failed')) {
      securityLogger.log(
        SecurityEventType.LOGIN_FAILED,
        SecuritySeverity.MEDIUM,
        `Failed authentication attempt`,
        {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          endpoint: req.path,
          method: req.method
        },
        {
          providedCredentials: req.body ? Object.keys(req.body) : [],
          timestamp: new Date().toISOString()
        }
      );
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Configuration pour Netlify Functions
export const netlifySecurityConfig = {
  rateLimiters: {
    auth: authRateLimiter,
    api: apiRateLimiter,
    forms: formSubmissionRateLimiter
  },
  csrf: csrfProtection,
  headers: securityHeaders,
  logger: securityLogger,
  validationLogger,
  authSuccessLogger,
  authFailureLogger
};
