// src/lib/securityLogger.ts
import { sanitizeData } from '../utils/securityUtils';

// Types d'événements de sécurité
export enum SecurityEventType {
  // Authentification
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change',
  
  // Tentatives d'attaque
  BRUTE_FORCE_ATTEMPT = 'brute_force_attempt',
  SQL_INJECTION_ATTEMPT = 'sql_injection_attempt',
  XSS_ATTEMPT = 'xss_attempt',
  CSRF_ATTEMPT = 'csrf_attempt',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  API_ABUSE = 'api_abuse',
  
  // Validation
  VALIDATION_FAILED = 'validation_failed',
  INVALID_INPUT = 'invalid_input',
  
  // Système
  CONFIGURATION_ERROR = 'configuration_error',
  ENVIRONMENT_ERROR = 'environment_error',
  
  // Accès
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  
  // Données
  DATA_BREACH_ATTEMPT = 'data_breach_attempt',
  SENSITIVE_DATA_ACCESS = 'sensitive_data_access',
  
  // Calculs et Propriété Intellectuelle
  CALCULATION_REQUEST = 'calculation_request',
  CALCULATION_SUCCESS = 'calculation_success',
  CALCULATION_ERROR = 'calculation_error',
  INTELLECTUAL_PROPERTY_VIOLATION = 'intellectual_property_violation',
  BULK_DATA_EXTRACTION = 'bulk_data_extraction',
  AUTOMATED_ACCESS = 'automated_access',
  REVERSE_ENGINEERING_ATTEMPT = 'reverse_engineering_attempt',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity'
}

// Niveaux de gravité
export enum SecuritySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Interface pour les événements de sécurité
export interface SecurityEvent {
  id: string;
  timestamp: number;
  type: SecurityEventType;
  severity: SecuritySeverity;
  source: string; // IP, User ID, etc.
  userAgent?: string;
  ipAddress?: string;
  userId?: string;
  sessionId?: string;
  details: {
    message: string;
    data?: any;
    context?: any;
  };
  metadata: {
    requestId?: string;
    endpoint?: string;
    method?: string;
    userAgent?: string;
    referrer?: string;
    country?: string;
    city?: string;
  };
  resolved: boolean;
  resolvedAt?: number;
  resolvedBy?: string;
  notes?: string;
}

// Interface pour les alertes
export interface SecurityAlert {
  id: string;
  eventId: string;
  timestamp: number;
  type: 'email' | 'slack' | 'webhook' | 'sms';
  recipient: string;
  message: string;
  sent: boolean;
  sentAt?: number;
  error?: string;
}

// Configuration du logger
export interface SecurityLoggerConfig {
  enabled: boolean;
  logLevel: SecuritySeverity;
  maxLogs: number;
  retentionDays: number;
  alertThresholds: {
    [key in SecurityEventType]?: {
      count: number;
      timeWindow: number; // en minutes
      severity: SecuritySeverity;
    };
  };
  alertChannels: {
    email?: {
      enabled: boolean;
      recipients: string[];
      smtp: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
          user: string;
          pass: string;
        };
      };
    };
    slack?: {
      enabled: boolean;
      webhookUrl: string;
      channel: string;
    };
    webhook?: {
      enabled: boolean;
      url: string;
      headers?: Record<string, string>;
    };
  };
}

// Classe principale du logger de sécurité
export class SecurityLogger {
  private static instance: SecurityLogger;
  private events: SecurityEvent[] = [];
  private alerts: SecurityAlert[] = [];
  private config: SecurityLoggerConfig;
  private alertCounters: Map<string, { count: number; firstSeen: number }> = new Map();

  private constructor(config: SecurityLoggerConfig) {
    this.config = config;
    this.loadFromStorage();
    this.startCleanupInterval();
  }

  public static getInstance(config?: SecurityLoggerConfig): SecurityLogger {
    if (!SecurityLogger.instance) {
      if (!config) {
        throw new Error('Configuration requise pour initialiser SecurityLogger');
      }
      SecurityLogger.instance = new SecurityLogger(config);
    }
    return SecurityLogger.instance;
  }

  // Logger un événement de sécurité
  public log(
    type: SecurityEventType,
    severity: SecuritySeverity,
    message: string,
    data?: any,
    context?: any
  ): void {
    if (!this.config.enabled) return;

    const event: SecurityEvent = {
      id: this.generateId(),
      timestamp: Date.now(),
      type,
      severity,
      source: this.getSource(),
      userAgent: navigator.userAgent,
      ipAddress: this.getClientIP(),
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      details: {
        message: sanitizeData(message),
        data: data ? sanitizeData(data) : undefined,
        context: context ? sanitizeData(context) : undefined
      },
      metadata: {
        requestId: this.getRequestId(),
        endpoint: window.location.pathname,
        method: 'GET', // À adapter selon le contexte
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        country: this.getGeoLocation()?.country,
        city: this.getGeoLocation()?.city
      },
      resolved: false
    };

    this.events.push(event);
    this.saveToStorage();
    this.checkAlertThresholds(event);
    this.cleanupOldEvents();

    // Log en console pour le développement
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔒 Security Event: ${type}`);
      console.log('Severity:', severity);
      console.log('Message:', message);
      console.log('Data:', data);
      console.log('Context:', context);
      console.groupEnd();
    }
  }

  // Obtenir tous les événements
  public getEvents(
    filters?: {
      type?: SecurityEventType;
      severity?: SecuritySeverity;
      resolved?: boolean;
      startDate?: number;
      endDate?: number;
    }
  ): SecurityEvent[] {
    let filteredEvents = [...this.events];

    if (filters?.type) {
      filteredEvents = filteredEvents.filter(e => e.type === filters.type);
    }

    if (filters?.severity) {
      filteredEvents = filteredEvents.filter(e => e.severity === filters.severity);
    }

    if (filters?.resolved !== undefined) {
      filteredEvents = filteredEvents.filter(e => e.resolved === filters.resolved);
    }

    if (filters?.startDate) {
      filteredEvents = filteredEvents.filter(e => e.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      filteredEvents = filteredEvents.filter(e => e.timestamp <= filters.endDate!);
    }

    return filteredEvents.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Obtenir les statistiques
  public getStats(): {
    total: number;
    byType: Record<SecurityEventType, number>;
    bySeverity: Record<SecuritySeverity, number>;
    unresolved: number;
    last24h: number;
    last7d: number;
    last30d: number;
  } {
    const now = Date.now();
    const day24h = now - 24 * 60 * 60 * 1000;
    const day7d = now - 7 * 24 * 60 * 60 * 1000;
    const day30d = now - 30 * 24 * 60 * 60 * 1000;

    const byType: Record<SecurityEventType, number> = {} as any;
    const bySeverity: Record<SecuritySeverity, number> = {} as any;

    this.events.forEach(event => {
      byType[event.type] = (byType[event.type] || 0) + 1;
      bySeverity[event.severity] = (bySeverity[event.severity] || 0) + 1;
    });

    return {
      total: this.events.length,
      byType,
      bySeverity,
      unresolved: this.events.filter(e => !e.resolved).length,
      last24h: this.events.filter(e => e.timestamp >= day24h).length,
      last7d: this.events.filter(e => e.timestamp >= day7d).length,
      last30d: this.events.filter(e => e.timestamp >= day30d).length
    };
  }

  // Marquer un événement comme résolu
  public resolveEvent(eventId: string, notes?: string): void {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.resolved = true;
      event.resolvedAt = Date.now();
      event.resolvedBy = this.getCurrentUserId();
      event.notes = notes;
      this.saveToStorage();
    }
  }

  // Envoyer une alerte
  private async sendAlert(event: SecurityEvent): Promise<void> {
    const alert: SecurityAlert = {
      id: this.generateId(),
      eventId: event.id,
      timestamp: Date.now(),
      type: 'email', // Par défaut
      recipient: this.config.alertChannels.email?.recipients[0] || '',
      message: this.formatAlertMessage(event),
      sent: false
    };

    try {
      if (this.config.alertChannels.email?.enabled) {
        await this.sendEmailAlert(alert, event);
      }

      if (this.config.alertChannels.slack?.enabled) {
        await this.sendSlackAlert(alert, event);
      }

      if (this.config.alertChannels.webhook?.enabled) {
        await this.sendWebhookAlert(alert, event);
      }

      alert.sent = true;
      alert.sentAt = Date.now();
    } catch (error) {
      alert.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to send security alert:', error);
    }

    this.alerts.push(alert);
    this.saveToStorage();
  }

  // Vérifier les seuils d'alerte
  private checkAlertThresholds(event: SecurityEvent): void {
    const threshold = this.config.alertThresholds[event.type];
    if (!threshold) return;

    const key = `${event.type}_${event.source}`;
    const counter = this.alertCounters.get(key) || { count: 0, firstSeen: event.timestamp };
    
    counter.count++;
    
    // Vérifier si le seuil est dépassé dans la fenêtre de temps
    const timeWindow = threshold.timeWindow * 60 * 1000; // Convertir en millisecondes
    const isInWindow = (event.timestamp - counter.firstSeen) <= timeWindow;
    
    if (isInWindow && counter.count >= threshold.count) {
      this.sendAlert(event);
      // Réinitialiser le compteur
      this.alertCounters.delete(key);
    } else if (!isInWindow) {
      // Réinitialiser si hors de la fenêtre
      counter.count = 1;
      counter.firstSeen = event.timestamp;
    }
    
    this.alertCounters.set(key, counter);
  }

  // Méthodes utilitaires privées
  private generateId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSource(): string {
    return this.getClientIP() || 'unknown';
  }

  private getClientIP(): string {
    // En production, cela viendrait du serveur
    return '127.0.0.1';
  }

  private getCurrentUserId(): string | undefined {
    // À adapter selon votre système d'authentification
    return localStorage.getItem('userId') || undefined;
  }

  private getSessionId(): string | undefined {
    return sessionStorage.getItem('sessionId') || undefined;
  }

  private getRequestId(): string | undefined {
    return sessionStorage.getItem('requestId') || undefined;
  }

  private getGeoLocation(): { country?: string; city?: string } | null {
    // À implémenter avec un service de géolocalisation
    return null;
  }

  private formatAlertMessage(event: SecurityEvent): string {
    return `🚨 Security Alert: ${event.type}
Severity: ${event.severity}
Source: ${event.source}
Message: ${event.details.message}
Time: ${new Date(event.timestamp).toISOString()}`;
  }

  private async sendEmailAlert(alert: SecurityAlert, event: SecurityEvent): Promise<void> {
    // Implémentation de l'envoi d'email
    console.log('Sending email alert:', alert.message);
  }

  private async sendSlackAlert(alert: SecurityAlert, event: SecurityEvent): Promise<void> {
    // Implémentation de l'envoi Slack
    console.log('Sending Slack alert:', alert.message);
  }

  private async sendWebhookAlert(alert: SecurityAlert, event: SecurityEvent): Promise<void> {
    try {
      const webhookUrl = this.config.alertChannels.webhook?.url;
      const headers = this.config.alertChannels.webhook?.headers || {};
      
      if (!webhookUrl) {
        console.warn('Webhook URL not configured');
        return;
      }

      // Format pour notre webhook Netlify
      const payload = {
        id: event.id,
        type: event.type,
        severity: event.severity.toUpperCase(),
        source: event.source,
        details: event.details.message,
        endpoint: event.metadata.endpoint,
        method: event.metadata.method,
        ipAddress: event.ipAddress,
        userAgent: event.metadata.userAgent,
        timestamp: new Date(event.timestamp).toISOString()
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Webhook failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert.sent = true;
        alert.sentAt = Date.now();
        console.log('Webhook alert sent successfully via Netlify function');
      } else {
        throw new Error(result.error || 'Webhook returned error');
      }
      
    } catch (error) {
      console.error('Failed to send webhook alert:', error);
      alert.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  private formatTelegramMessage(event: SecurityEvent): string {
    const severityEmoji = {
      [SecuritySeverity.LOW]: '🔵',
      [SecuritySeverity.MEDIUM]: '🟡',
      [SecuritySeverity.HIGH]: '🟠',
      [SecuritySeverity.CRITICAL]: '🔴'
    };

    const typeLabels = {
      [SecurityEventType.LOGIN_SUCCESS]: 'Connexion réussie',
      [SecurityEventType.LOGIN_FAILED]: 'Échec de connexion',
      [SecurityEventType.BRUTE_FORCE_ATTEMPT]: 'Tentative de force brute',
      [SecurityEventType.SQL_INJECTION_ATTEMPT]: 'Tentative d\'injection SQL',
      [SecurityEventType.XSS_ATTEMPT]: 'Tentative XSS',
      [SecurityEventType.CSRF_ATTEMPT]: 'Tentative CSRF',
      [SecurityEventType.RATE_LIMIT_EXCEEDED]: 'Limite de taux dépassée',
      [SecurityEventType.VALIDATION_FAILED]: 'Échec de validation',
      [SecurityEventType.UNAUTHORIZED_ACCESS]: 'Accès non autorisé'
    };

    const emoji = severityEmoji[event.severity] || '⚪';
    const typeLabel = typeLabels[event.type] || event.type;
    const timestamp = new Date(event.timestamp).toLocaleString('fr-FR');
    
    return `
🚨 <b>ALERTE DE SÉCURITÉ - ${event.severity.toUpperCase()}</b>

${emoji} <b>Type:</b> ${typeLabel}
📍 <b>Source:</b> ${event.source}
🕐 <b>Timestamp:</b> ${timestamp}
📝 <b>Message:</b> ${event.details.message}

${event.metadata.endpoint ? `🔗 <b>Endpoint:</b> ${event.metadata.method} ${event.metadata.endpoint}\n` : ''}
${event.metadata.userAgent ? `🌐 <b>User-Agent:</b> ${event.metadata.userAgent.substring(0, 100)}...\n` : ''}
${event.metadata.country ? `🌍 <b>Localisation:</b> ${event.metadata.city || ''}, ${event.metadata.country}\n` : ''}

<i>ID: ${event.id}</i>
    `.trim();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('security_events', JSON.stringify(this.events));
      localStorage.setItem('security_alerts', JSON.stringify(this.alerts));
    } catch (error) {
      console.error('Failed to save security logs to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const events = localStorage.getItem('security_events');
      const alerts = localStorage.getItem('security_alerts');
      
      if (events) {
        this.events = JSON.parse(events);
      }
      
      if (alerts) {
        this.alerts = JSON.parse(alerts);
      }
    } catch (error) {
      console.error('Failed to load security logs from storage:', error);
    }
  }

  private cleanupOldEvents(): void {
    const cutoff = Date.now() - (this.config.retentionDays * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(e => e.timestamp > cutoff);
    
    // Limiter le nombre d'événements
    if (this.events.length > this.config.maxLogs) {
      this.events = this.events.slice(-this.config.maxLogs);
    }
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupOldEvents();
      this.saveToStorage();
    }, 60 * 60 * 1000); // Nettoyage toutes les heures
  }
}

// Configuration par défaut
export const defaultSecurityLoggerConfig: SecurityLoggerConfig = {
  enabled: true,
  logLevel: SecuritySeverity.LOW,
  maxLogs: 10000,
  retentionDays: 30,
  alertThresholds: {
    [SecurityEventType.BRUTE_FORCE_ATTEMPT]: {
      count: 5,
      timeWindow: 15, // 15 minutes
      severity: SecuritySeverity.HIGH
    },
    [SecurityEventType.SQL_INJECTION_ATTEMPT]: {
      count: 1,
      timeWindow: 60, // 1 heure
      severity: SecuritySeverity.CRITICAL
    },
    [SecurityEventType.XSS_ATTEMPT]: {
      count: 1,
      timeWindow: 60, // 1 heure
      severity: SecuritySeverity.CRITICAL
    },
    [SecurityEventType.RATE_LIMIT_EXCEEDED]: {
      count: 10,
      timeWindow: 5, // 5 minutes
      severity: SecuritySeverity.MEDIUM
    }
  },
  alertChannels: {
    email: {
      enabled: true,
      recipients: [
        'gerald.dore@gmail.com',
        'info@monplanretraite.ca', 
        'gadore@yahoo.com'
      ],
      smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        }
      }
    },
    slack: {
      enabled: false,
      webhookUrl: '',
      channel: '#security'
    },
    webhook: {
      enabled: true,
              url: process.env.TELEGRAM_WEBHOOK_URL || 'https://www.monplanretraite.ca/.netlify/functions/telegramAlert',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
};

// Export d'une instance par défaut
export const securityLogger = SecurityLogger.getInstance(defaultSecurityLoggerConfig);
