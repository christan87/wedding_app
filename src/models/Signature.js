/**
 * ============================================================================
 * FILE: Signature.js
 * LOCATION: src/models/Signature.js
 * PURPOSE: Signature (Guest Book) MongoDB model schema definition
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This file defines the Signature data model for the Guest Book feature.
 * Each signature represents a message left by a guest.
 * 
 * SCHEMA FIELDS:
 * ==============
 * - name: Guest's name (required)
 * - message: Guest's message (required)
 * 
 * TIMESTAMPS (automatically added):
 * - createdAt: When the signature was created
 * 
 * ============================================================================
 */

const SignatureSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
};

export const COLLECTION_NAME = 'signatures';

/**
 * VALIDATE SIGNATURE DATA
 * 
 * @param {Object} data - Signature data to validate
 * @returns {Object} Validation result { isValid: boolean, errors: string[] }
 */
export function validateSignature(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('Name is required');
  } else if (data.name.length > 100) {
    errors.push('Name must be 100 characters or fewer');
  }

  if (!data.message || typeof data.message !== 'string' || !data.message.trim()) {
    errors.push('Message is required');
  } else if (data.message.length > 500) {
    errors.push('Message must be 500 characters or fewer');
  }

  // Check for malicious content
  const suspiciousPatterns = [/<script/i, /<iframe/i, /<object/i, /<embed/i, /javascript:/i, /on\w+=\s*/i];
  const combined = (data.name || '') + (data.message || '');
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(combined)) {
      errors.push('Invalid characters detected');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * CREATE SIGNATURE OBJECT
 * 
 * @param {Object} data - Raw signature data
 * @returns {Object} Formatted signature object
 */
/**
 * Server-side sanitize: strip HTML tags and dangerous patterns.
 */
function sanitizeServer(input) {
  if (!input) return '';
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .trim();
}

export function createSignatureObject(data) {
  return {
    name: sanitizeServer(data.name) || '',
    message: sanitizeServer(data.message) || '',
    createdAt: new Date(),
  };
}

export default SignatureSchema;
