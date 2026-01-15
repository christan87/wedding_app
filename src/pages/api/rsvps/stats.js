/**
 * ============================================================================
 * FILE: stats.js
 * LOCATION: src/pages/api/rsvps/stats.js
 * PURPOSE: API endpoint for RSVP statistics
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This API route provides statistics about RSVPs:
 * - Total number of RSVPs
 * - Number attending
 * - Number not attending
 * - Total number of guests
 * 
 * USAGE:
 * ======
 * GET /api/rsvps/stats
 * Returns: {
 *   total: 10,
 *   attending: 8,
 *   notAttending: 2,
 *   totalGuests: 15
 * }
 * 
 * ============================================================================
 */

import { getRsvpStats } from '@/services/rsvpService';

/**
 * API HANDLER
 * 
 * Handles HTTP requests for the /api/rsvps/stats endpoint.
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
    const stats = await getRsvpStats();

    res.status(200).json({
      success: true,
      data: stats,
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
