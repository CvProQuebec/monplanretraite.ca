import Joi from 'joi';
import type { Handler, HandlerEvent } from '@netlify/functions';

// Types pour la validation
export interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Middleware de validation global
export const validateInput = (schema: ValidationSchema) => (handler: Handler): Handler => {
  return async (event: HandlerEvent, context) => {
    try {
      // Validation du body
      if (schema.body && event.body) {
        const body = JSON.parse(event.body);
        const { error } = schema.body.validate(body, { 
          abortEarly: false,
          stripUnknown: true,
          allowUnknown: false
        });
        
        if (error) {
          const validationErrors: ValidationError[] = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }));
          
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
            body: JSON.stringify({
              error: 'Validation failed',
              details: validationErrors,
              message: 'Les données fournies ne respectent pas le format attendu'
            })
          };
        }
      }

      // Validation des query parameters
      if (schema.query && event.queryStringParameters) {
        const { error } = schema.query.validate(event.queryStringParameters, {
          abortEarly: false,
          stripUnknown: true,
          allowUnknown: false
        });
        
        if (error) {
          const validationErrors: ValidationError[] = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }));
          
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            },
            body: JSON.stringify({
              error: 'Query validation failed',
              details: validationErrors,
              message: 'Les paramètres de requête ne respectent pas le format attendu'
            })
          };
        }
      }

      // Si validation réussie, continuer vers le handler
      return handler(event, context);
      
    } catch (error) {
      console.error('Validation middleware error:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
        body: JSON.stringify({
          error: 'Internal validation error',
          message: 'Erreur interne de validation'
        })
      };
    }
  };
};

// Schémas de validation réutilisables
export const commonSchemas = {
  // Validation d'email
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  
  // Validation de téléphone (format canadien)
  phone: Joi.string().pattern(/^\+1[0-9]{10}$/).required(),
  
  // Validation de nom d'entreprise
  companyName: Joi.string().min(2).max(100).required(),
  
  // Validation de nom complet
  fullName: Joi.string().min(2).max(100).required(),
  
  // Validation de code d'activation
  activationCode: Joi.string().min(6).max(50).required(),
  
  // Validation d'URL
  url: Joi.string().uri().required(),
  
  // Validation de message
  message: Joi.string().min(10).max(2000).required(),
  
  // Validation de langue
  language: Joi.string().valid('fr', 'en').required(),
  
  // Validation d'ID SignRequest
  signRequestId: Joi.string().uuid().required(),
  
  // Validation de données NDA
  ndaData: Joi.object({
    nom: Joi.string().min(2).max(100).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    entreprise: Joi.string().min(2).max(100).required(),
    lang: Joi.string().valid('fr', 'en').required()
  }),
  
  // Validation de données de prospects
  prospectData: Joi.object({
    activationCode: Joi.string().min(6).max(50).required(),
    clientCompanyName: Joi.string().min(2).max(100).required(),
    clientWebsite: Joi.string().uri().required(),
    targetIndustry: Joi.string().optional(),
    targetCompanySize: Joi.string().optional(),
    targetLocation: Joi.string().optional(),
    numberOfLeads: Joi.string().pattern(/^[0-9]+$/).optional(),
    specificCriteria: Joi.string().optional()
  }),
  
  // Validation de données de formulaire de contact
  contactFormData: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    phone: Joi.string().optional(),
    company: Joi.string().optional(),
    message: Joi.string().min(10).max(2000).required()
  }),
  
  // Validation de données d'authentification admin
  adminAuthData: Joi.object({
    password: Joi.string().min(8).max(100).required()
  }),
  
  // Validation de données de potentiel (consultation IA)
  potentielData: Joi.object({
    // Informations de contact
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    phone: Joi.string().optional(),
    company: Joi.string().min(2).max(100).required(),
    role: Joi.string().min(2).max(100).required(),
    
    // Contexte entreprise
    sector: Joi.string().min(2).max(100).required(),
    companySize: Joi.string().valid('startup', 'small', 'medium', 'large', 'enterprise').required(),
    
    // Défis et situation
    mainChallenge: Joi.string().min(10).max(500).required(),
    currentSituation: Joi.string().min(10).max(500).required(),
    workVolume: Joi.string().min(2).max(100).required(),
    currentCost: Joi.string().optional(),
    
    // Impact et volume
    weeklyTimeWasted: Joi.number().min(0).max(168).required(),
    avgHourlyRate: Joi.number().min(10).max(1000).required(),
    
    // Défis opérationnels
    operationalChallenge: Joi.string().min(10).max(500).required(),
    challengeDetails: Joi.string().optional(),
    performanceMeasurement: Joi.string().min(10).max(500).required(),
    
    // Urgence et investissement
    urgency: Joi.string().valid('<1month', '1-3months', '3-6months', '6months+').required(),
    budget: Joi.string().valid('<5000', '5000-15000', '15000-50000', '50000+', 'tbd').required(),
    
    // Vision du succès
    idealSolution: Joi.string().min(10).max(500).required(),
    expectedImpact: Joi.string().valid('time', 'cost', 'growth', 'quality').required(),
    constraints: Joi.string().optional(),
    
    // Scores et métadonnées
    auditScore: Joi.number().min(0).max(100).required(),
    finalScore: Joi.number().min(0).max(100).required(),
    needsDiscoveryGuide: Joi.boolean().required(),
    
    // Données calculées
    aiPotentialScore: Joi.number().min(0).max(100).optional(),
    estimatedROI: Joi.number().min(0).optional(),
    recommendedApproach: Joi.string().optional(),
    
    // Métadonnées
    submissionTime: Joi.string().isoDate().required(),
    source: Joi.string().valid('quick_assessment_fr', 'quick_assessment_en').required(),
    
    // Données supplémentaires (optionnelles)
    urgencySignals: Joi.array().items(Joi.string()).optional(),
    recommendedActions: Joi.array().items(Joi.string()).optional(),
    leadData: Joi.object().optional(),
    unified: Joi.object().optional()
  })
};

// Fonction utilitaire pour créer des réponses d'erreur standardisées
export const createValidationErrorResponse = (errors: ValidationError[], message?: string) => ({
  statusCode: 400,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  },
  body: JSON.stringify({
    error: 'Validation failed',
    details: errors,
    message: message || 'Les données fournies ne respectent pas le format attendu'
  })
});

// Fonction utilitaire pour créer des réponses de succès standardisées
export const createSuccessResponse = (data: any, message?: string) => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  },
  body: JSON.stringify({
    success: true,
    data,
    message: message || 'Opération réussie'
  })
}); 