/**
 * Input sanitization and validation utilities
 */

export class InputSanitizer {
  /**
   * Sanitize string input to prevent XSS
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
      .trim(); // Only trim start/end, preserve internal spaces
  }

  /**
   * Sanitize name input (preserves spaces for compound names)
   */
  static sanitizeName(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/[^a-zA-ZÀ-ÿĀ-žА-я\u4e00-\u9fff\s\-'\.]/g, '') // Keep only letters (including accented), spaces, hyphens, apostrophes, dots
      .replace(/\s{2,}/g, ' ') // Normalize multiple consecutive spaces to single space (but preserve single spaces)
      .trim(); // Trim only start/end
  }

  /**
   * Sanitize numeric input
   */
  static sanitizeNumber(input: any): number {
    const num = parseFloat(input);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Sanitize email input
   */
  static sanitizeEmail(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    const sanitized = input.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  /**
   * Validate and sanitize user data object
   */
  static sanitizeUserData(data: any): any {
    if (!data || typeof data !== 'object') {
      return {};
    }

    const sanitized: any = {};

    // Fields that should use name sanitization (preserve spaces)
    const nameFields = ['prenom1', 'prenom2', 'nom1', 'nom2', 'nom', 'prenom'];

    // Recursively sanitize object properties
    for (const [key, value] of Object.entries(data)) {
      const sanitizedKey = this.sanitizeString(key);
      
      if (typeof value === 'string') {
        // Use special name sanitization for name fields
        if (nameFields.includes(key)) {
          sanitized[sanitizedKey] = this.sanitizeName(value);
        } else {
          sanitized[sanitizedKey] = this.sanitizeString(value);
        }
      } else if (typeof value === 'number') {
        sanitized[sanitizedKey] = this.sanitizeNumber(value);
      } else if (typeof value === 'boolean') {
        sanitized[sanitizedKey] = Boolean(value);
      } else if (Array.isArray(value)) {
        sanitized[sanitizedKey] = value.map(item => 
          typeof item === 'string' ? this.sanitizeString(item) : item
        );
      } else if (value && typeof value === 'object') {
        sanitized[sanitizedKey] = this.sanitizeUserData(value);
      } else {
        sanitized[sanitizedKey] = value;
      }
    }

    return sanitized;
  }

  /**
   * Validate file upload
   */
  static validateFileUpload(file: File, allowedTypes: string[], maxSize: number): boolean {
    if (!file) {
      return false;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > maxSize) {
      throw new Error(`Fichier trop volumineux. Taille maximale: ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    return true;
  }

  /**
   * Rate limiting for API calls
   */
  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests: number[] = [];
    
    return function isRateLimited(): boolean {
      const now = Date.now();
      
      // Remove old requests outside the window
      while (requests.length > 0 && requests[0] <= now - windowMs) {
        requests.shift();
      }
      
      // Check if we've exceeded the limit
      if (requests.length >= maxRequests) {
        return true;
      }
      
      // Add current request
      requests.push(now);
      return false;
    };
  }
}
