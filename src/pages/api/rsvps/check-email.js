/**
 * ============================================================================
 * FILE: check-email.js
 * LOCATION: src/pages/api/rsvps/check-email.js
 * PURPOSE: API endpoint to check if an RSVP exists for a given email
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This API route checks if an RSVP already exists for a given email address.
 * Used by the RSVP form to detect duplicate submissions.
 * 
 * USAGE:
 * ======
 * GET /api/rsvps/check-email?email=user@example.com
 * Returns: { success: true, exists: true/false, rsvp: {...} or null }
 * 
 * ============================================================================
 */

import { getRsvpByEmail } from '@/services/rsvpService';

/**
 * API HANDLER
 * 
 * Handles GET requests to check if an RSVP exists for an email.
 * 
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 */
export default async function handler(req, res) {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      error: `Method ${method} Not Allowed`,
    });
  }

  try {
    const { email } = req.query;

    // Validate email parameter
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email parameter is required',
      });
    }

    // Check if RSVP exists for this email
    const existingRsvp = await getRsvpByEmail(email.toLowerCase().trim());

    res.status(200).json({
      success: true,
      exists: !!existingRsvp,
      rsvp: existingRsvp || null,
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message,
    });
  }
}
