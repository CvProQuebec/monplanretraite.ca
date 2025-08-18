import DOMPurify from 'dompurify';

// Configuration DOMPurify renforcée
const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'b', 'i', 'em', 'strong', 'br', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'span', 'a', 'table', 'tr', 'td', 'th', 'thead', 'tbody',
    'blockquote', 'code', 'pre', 'hr', 'small', 'sub', 'sup'
  ],
  ALLOWED_ATTR: [
    'style', 'class', 'id', 'href', 'target', 'rel', 'title', 'alt',
    'width', 'height', 'align', 'valign', 'colspan', 'rowspan'
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_TAGS: [
    'script', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'option',
    'button', 'iframe', 'frame', 'frameset', 'noframes', 'noscript', 'applet',
    'base', 'basefont', 'bgsound', 'link', 'meta', 'title', 'style', 'xml',
    'xmp', 'listing', 'plaintext', 'listing'
  ],
  FORBID_ATTR: [
    'onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onfocus', 'onblur',
    'onchange', 'onsubmit', 'onreset', 'onselect', 'onunload', 'onabort', 'onbeforeunload',
    'onerror', 'onhashchange', 'onmessage', 'onoffline', 'ononline', 'onpagehide',
    'onpageshow', 'onpopstate', 'onresize', 'onstorage', 'oncontextmenu', 'onkeydown',
    'onkeypress', 'onkeyup', 'onmousedown', 'onmousemove', 'onmouseup', 'onwheel',
    'oncopy', 'oncut', 'onpaste', 'onselectstart', 'onbeforecopy', 'onbeforecut',
    'onbeforepaste', 'onhelp', 'onsearch', 'onwebkitanimationend', 'onwebkitanimationiteration',
    'onwebkitanimationstart', 'onwebkittransitionend', 'onabort', 'onbeforeunload',
    'onerror', 'onhashchange', 'onmessage', 'onoffline', 'ononline', 'onpagehide',
    'onpageshow', 'onpopstate', 'onresize', 'onstorage', 'oncontextmenu'
  ]
};

// Fonction de nettoyage HTML sécurisée
export const sanitizeHtml = (html: string, customConfig?: Partial<typeof PURIFY_CONFIG>): string => {
  const config = { ...PURIFY_CONFIG, ...customConfig };
  
  // Nettoyage en deux étapes pour plus de sécurité
  let sanitized = DOMPurify.sanitize(html, config);
  
  // Vérification supplémentaire pour les patterns suspects
  const suspiciousPatterns = [
    /javascript:/i,
    /vbscript:/i,
    /data:/i,
    /on\w+\s*=/i,
    /<script/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];
  
  const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(sanitized));
  
  if (hasSuspiciousContent) {
    console.warn('🚨 Contenu suspect détecté dans HTML:', {
      original: html.substring(0, 100),
      sanitized: sanitized.substring(0, 100),
      timestamp: new Date().toISOString()
    });
    
    // Nettoyage plus agressif
    sanitized = DOMPurify.sanitize(sanitized, {
      ...config,
      ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'br', 'div'],
      ALLOWED_ATTR: ['style']
    });
  }
  
  return sanitized;
};

// Fonction de validation d'URL sécurisée
export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    const allowedDomains = [
      'trusted-domain.com',
      'api.airtable.com',
      'signrequest.com',
      'netlify.app'
    ];
    
    // Vérifier le protocole
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return false;
    }
    
    // Vérifier le domaine pour les URLs externes
    if (urlObj.protocol.startsWith('http')) {
      const domain = urlObj.hostname.toLowerCase();
      const isAllowed = allowedDomains.some(allowed => 
        domain === allowed || domain.endsWith('.' + allowed)
      );
      
      if (!isAllowed) {
        console.warn('🚨 Domaine non autorisé:', domain);
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
};

// Fonction de nettoyage des données utilisateur
export const sanitizeUserInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Supprimer les caractères de contrôle
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Limiter la longueur
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }
  
  // Supprimer les espaces multiples
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  return sanitized;
};

// Fonction de validation d'email renforcée
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return false;
  }
  
  // Vérifications supplémentaires
  const [localPart, domain] = email.split('@');
  
  // Longueur des parties
  if (localPart.length > 64 || domain.length > 253) {
    return false;
  }
  
  // Caractères interdits
  const forbiddenChars = /[<>()[\]\\,;:\s"]/;
  if (forbiddenChars.test(localPart)) {
    return false;
  }
  
  return true;
};

// Fonction de validation de téléphone canadien
export const validatePhone = (phone: string): boolean => {
  // Format canadien: +1XXXXXXXXXX ou (XXX) XXX-XXXX
  const phoneRegex = /^(\+1[0-9]{10}|\([0-9]{3}\) [0-9]{3}-[0-9]{4})$/;
  return phoneRegex.test(phone);
};

// Fonction de génération de token CSRF
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Fonction de validation de token CSRF
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  if (!token || !storedToken) {
    return false;
  }
  
  // Comparaison en temps constant pour éviter les attaques par timing
  if (token.length !== storedToken.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  
  return result === 0;
};

// Fonction de hachage sécurisé pour les mots de passe
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Utiliser PBKDF2 avec 100,000 itérations
  const key = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );
  
  const hashArray = new Uint8Array(derivedBits);
  const saltHex = Array.from(salt, byte => byte.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('');
  
  return `${saltHex}:${hashHex}`;
};

// Fonction de vérification de mot de passe
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    const [saltHex, hashHex] = hash.split(':');
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    const key = await crypto.subtle.importKey(
      'raw',
      data,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      256
    );
    
    const computedHash = Array.from(new Uint8Array(derivedBits), byte => byte.toString(16).padStart(2, '0')).join('');
    
    return computedHash === hashHex;
  } catch {
    return false;
  }
};

// Fonction de détection d'injection SQL basique
export const detectSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
    /(\b(and|or)\b\s+\d+\s*=\s*\d+)/i,
    /(\b(and|or)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/i,
    /(--|\/\*|\*\/)/,
    /(\b(xp_|sp_)\w+)/i,
    /(\b(cast|convert)\s*\()/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

// Fonction de détection d'injection XSS
export const detectXSS = (input: string): boolean => {
  const xssPatterns = [
    /<script[^>]*>/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /<iframe[^>]*>/i,
    /<object[^>]*>/i,
    /<embed[^>]*>/i,
    /<form[^>]*>/i,
    /<input[^>]*>/i,
    /<textarea[^>]*>/i,
    /<select[^>]*>/i,
    /<button[^>]*>/i,
    /<link[^>]*>/i,
    /<meta[^>]*>/i,
    /<base[^>]*>/i,
    /<bgsound[^>]*>/i,
    /<xmp[^>]*>/i,
    /<plaintext[^>]*>/i,
    /<listing[^>]*>/i
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

// Fonction de nettoyage complet des données
export const sanitizeData = (data: any): any => {
  if (typeof data === 'string') {
    // Détecter les injections
    if (detectSQLInjection(data) || detectXSS(data)) {
      console.warn('🚨 Injection détectée dans les données:', data.substring(0, 100));
      return '';
    }
    
    return sanitizeUserInput(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeData(value);
    }
    return sanitized;
  }
  
  return data;
};

// Configuration d'export
export const SECURITY_CONFIG = {
  PURIFY_CONFIG,
  MAX_INPUT_LENGTH: 10000,
  MAX_EMAIL_LENGTH: 254,
  MAX_PHONE_LENGTH: 20,
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIREMENTS: {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  }
};
