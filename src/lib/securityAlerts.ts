// src/lib/securityAlerts.ts
// Service de gestion des alertes de sécurité

export interface SecurityAlert {
  id: string;
  timestamp: number;
  type: 'telegram' | 'email' | 'both';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  data?: any;
  sent: boolean;
  error?: string;
}

export interface AlertConfig {
  telegramEnabled: boolean;
  emailEnabled: boolean;
  minSeverity: 'low' | 'medium' | 'high' | 'critical';
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "08:00"
  };
}

class SecurityAlertService {
  private static instance: SecurityAlertService;
  private alerts: SecurityAlert[] = [];
  private config: AlertConfig = {
    telegramEnabled: true,
    emailEnabled: true,
    minSeverity: 'medium',
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00"
    }
  };

  private constructor() {}

  public static getInstance(): SecurityAlertService {
    if (!SecurityAlertService.instance) {
      SecurityAlertService.instance = new SecurityAlertService();
    }
    return SecurityAlertService.instance;
  }

  // Envoyer une alerte Telegram via la fonction Netlify
  private async sendTelegramAlert(severity: string, message: string, data?: any): Promise<boolean> {
    try {
      const response = await fetch('/.netlify/functions/telegramAlert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'security_alert',
          severity: severity,
          details: message,
          source: 'monplanretraite_dashboard',
          data: data,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        console.log('✅ Alerte Telegram envoyée via Netlify function');
        return true;
      } else {
        const error = await response.text();
        console.error('❌ Erreur Telegram Netlify:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur envoi Telegram:', error);
      return false;
    }
  }

  // Envoyer une alerte Email via la fonction Netlify
  private async sendEmailAlert(severity: string, message: string, data?: any): Promise<boolean> {
    try {
      const response = await fetch('/.netlify/functions/security-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: ['info@monplanretraite.ca'], // Email principal valide
          severity: severity,
          message: message,
          data: data,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        console.log('✅ Alerte Email envoyée via Netlify function');
        return true;
      } else {
        const error = await response.text();
        console.error('❌ Erreur Email Netlify:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur envoi Email:', error);
      return false;
    }
  }

  // Vérifier si on est dans les heures silencieuses
  private isQuietHours(): boolean {
    if (!this.config.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = this.config.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = this.config.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Gestion du passage de minuit
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  // Vérifier si l'alerte doit être envoyée selon la sévérité
  private shouldSendAlert(severity: string): boolean {
    const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
    const minLevel = severityLevels[this.config.minSeverity as keyof typeof severityLevels];
    const alertLevel = severityLevels[severity as keyof typeof severityLevels];
    
    return alertLevel >= minLevel;
  }

  // Obtenir l'emoji selon la sévérité
  private getSeverityEmoji(severity: string): string {
    switch (severity) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  }

  // Envoyer une alerte
  public async sendAlert(
    severity: 'low' | 'medium' | 'high' | 'critical',
    message: string,
    data?: any,
    type: 'telegram' | 'email' | 'both' = 'both'
  ): Promise<SecurityAlert> {
    const alert: SecurityAlert = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type,
      severity,
      message,
      data,
      sent: false
    };

    // Vérifier si l'alerte doit être envoyée
    if (!this.shouldSendAlert(severity)) {
      console.log('🔇 Alerte filtrée par niveau de sévérité');
      return alert;
    }

    // Vérifier les heures silencieuses
    if (this.isQuietHours() && severity !== 'critical') {
      console.log('🔇 Alerte filtrée par heures silencieuses');
      return alert;
    }

    let telegramSent = false;
    let emailSent = false;

    // Envoyer Telegram
    if ((type === 'telegram' || type === 'both') && this.config.telegramEnabled) {
      telegramSent = await this.sendTelegramAlert(severity, message, data);
    }

    // Envoyer Email
    if ((type === 'email' || type === 'both') && this.config.emailEnabled) {
      emailSent = await this.sendEmailAlert(severity, message, data);
    }

    alert.sent = telegramSent || emailSent;
    
    if (!alert.sent) {
      alert.error = 'Échec de l\'envoi des alertes';
    }

    this.alerts.push(alert);
    return alert;
  }

  // Obtenir l'historique des alertes
  public getAlerts(): SecurityAlert[] {
    return [...this.alerts];
  }

  // Obtenir les statistiques des alertes
  public getAlertStats() {
    const total = this.alerts.length;
    const sent = this.alerts.filter(a => a.sent).length;
    const failed = this.alerts.filter(a => !a.sent).length;
    
    const bySeverity = {
      low: this.alerts.filter(a => a.severity === 'low').length,
      medium: this.alerts.filter(a => a.severity === 'medium').length,
      high: this.alerts.filter(a => a.severity === 'high').length,
      critical: this.alerts.filter(a => a.severity === 'critical').length
    };

    return {
      total,
      sent,
      failed,
      successRate: total > 0 ? Math.round((sent / total) * 100) : 0,
      bySeverity
    };
  }

  // Configurer le service
  public updateConfig(newConfig: Partial<AlertConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Obtenir la configuration actuelle
  public getConfig(): AlertConfig {
    return { ...this.config };
  }

  // Test de connexion Telegram via fonction Netlify
  public async testTelegramConnection(severity: 'low' | 'medium' | 'high' | 'critical' = 'low'): Promise<boolean> {
    try {
      const response = await fetch('/.netlify/functions/telegramAlert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'connection_test',
          severity: severity,
          details: 'Test de connexion Telegram',
          source: 'monplanretraite_dashboard',
          data: { test: true },
          timestamp: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Erreur test Telegram:', error);
      return false;
    }
  }

  // Test de connexion Email via fonction Netlify
  public async testEmailConnection(severity: 'low' | 'medium' | 'high' | 'critical' = 'low'): Promise<boolean> {
    try {
      const response = await fetch('/.netlify/functions/security-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: ['info@monplanretraite.ca'],
          severity: severity,
          message: 'Test de connexion Email',
          data: { test: true, severity: severity },
          timestamp: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Erreur test Email:', error);
      return false;
    }
  }
}

export const securityAlerts = SecurityAlertService.getInstance();
export default securityAlerts;
