/**
 * ============================================================================
 * FILE: index.js
 * LOCATION: src/pages/api/signatures/index.js
 * PURPOSE: API endpoint for guest book signatures (GET all, POST new)
 * 
 * ENDPOINTS:
 * ==========
 * GET /api/signatures - Retrieve all signatures
 * POST /api/signatures - Create a new signature
 * 
 * ============================================================================
 */

import { createSignature, getSignatures } from '@/services/signatureService';
import { validateSignature, createSignatureObject } from '@/models/Signature';
import { createRateLimiter, getIp } from '@/lib/rateLimiter';

// 5 submissions per IP per 15 minutes
const signatureLimiter = createRateLimiter({ max: 5, windowMs: 15 * 60 * 1000 });

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        await handleGet(req, res);
        break;

      case 'POST':
        await handlePost(req, res);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({
          success: false,
          error: `Method ${method} Not Allowed`,
        });
        break;
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message,
    });
  }
}

/**
 * HANDLE GET REQUEST
 * 
 * Retrieves all signatures, newest first.
 */
async function handleGet(req, res) {
  const signatures = await getSignatures();

  res.status(200).json({
    success: true,
    data: signatures,
  });
}

/**
 * HANDLE POST REQUEST
 * 
 * Creates a new signature after validation.
 */
async function handlePost(req, res) {
  const { success } = signatureLimiter(getIp(req));
  if (!success) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a few minutes before trying again.',
    });
  }

  const validation = validateSignature(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      errors: validation.errors,
    });
  }

  const signatureData = createSignatureObject(req.body);
  const newSignature = await createSignature(signatureData);

  res.status(201).json({
    success: true,
    data: newSignature,
  });
}
