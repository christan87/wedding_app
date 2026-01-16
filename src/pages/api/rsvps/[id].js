/**
 * ============================================================================
 * FILE: [id].js
 * LOCATION: src/pages/api/rsvps/[id].js
 * PURPOSE: API endpoint for individual RSVP operations (GET, PUT, DELETE)
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This API route handles operations on a specific RSVP by ID:
 * - GET /api/rsvps/:id - Retrieve a single RSVP
 * - PUT /api/rsvps/:id - Update an existing RSVP
 * - DELETE /api/rsvps/:id - Delete an RSVP
 * 
 * DYNAMIC ROUTES:
 * ===============
 * The [id] in the filename makes this a dynamic route.
 * The ID is accessible via req.query.id
 * 
 * USAGE:
 * ======
 * GET /api/rsvps/507f1f77bcf86cd799439011
 * Returns: Single RSVP object
 * 
 * PUT /api/rsvps/507f1f77bcf86cd799439011
 * Body: { attending: false, comments: "Can't make it" }
 * Returns: Updated RSVP object
 * 
 * DELETE /api/rsvps/507f1f77bcf86cd799439011
 * Returns: Success message
 * 
 * ============================================================================
 */

import { getRsvpById, updateRsvp, deleteRsvp } from '@/services/rsvpService';

/**
 * API HANDLER
 * 
 * Handles HTTP requests for the /api/rsvps/:id endpoint.
 * 
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 */
export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  // Validate ID format
  if (!id || id.length !== 24) {
    return res.status(400).json({
      success: false,
      error: 'Invalid RSVP ID format',
    });
  }

  try {
    switch (method) {
      case 'GET':
        // Get a single RSVP
        await handleGet(req, res, id);
        break;

      case 'PUT':
        // Update an RSVP
        await handlePut(req, res, id);
        break;

      case 'DELETE':
        // Delete an RSVP
        await handleDelete(req, res, id);
        break;

      default:
        // Method not allowed
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
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
 * Retrieves a single RSVP by ID.
 */
async function handleGet(req, res, id) {
  const rsvp = await getRsvpById(id);

  if (!rsvp) {
    return res.status(404).json({
      success: false,
      error: 'RSVP not found',
    });
  }

  res.status(200).json({
    success: true,
    data: rsvp,
  });
}

/**
 * HANDLE PUT REQUEST
 * 
 * Updates an existing RSVP.
 * Only updates fields that are provided in the request body.
 */
async function handlePut(req, res, id) {
  const { guestName, email, attending, numberOfGuests, dietaryRestrictions, comments, approved } = req.body;

  // Check if RSVP exists
  const existingRsvp = await getRsvpById(id);
  if (!existingRsvp) {
    return res.status(404).json({
      success: false,
      error: 'RSVP not found',
    });
  }

  // Build update object with only provided fields
  const updateData = {};
  if (guestName !== undefined) updateData.guestName = guestName.trim();
  if (email !== undefined) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }
    updateData.email = email.toLowerCase().trim();
  }
  if (attending !== undefined) updateData.attending = Boolean(attending);
  if (numberOfGuests !== undefined) updateData.numberOfGuests = numberOfGuests;
  if (dietaryRestrictions !== undefined) updateData.dietaryRestrictions = dietaryRestrictions;
  if (comments !== undefined) updateData.comments = comments;
  if (approved !== undefined) updateData.approved = Boolean(approved);

  // Check if there's anything to update
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No fields to update',
    });
  }

  const updatedRsvp = await updateRsvp(id, updateData);

  res.status(200).json({
    success: true,
    data: updatedRsvp,
  });
}

/**
 * HANDLE DELETE REQUEST
 * 
 * Deletes an RSVP from the database.
 */
async function handleDelete(req, res, id) {
  const deleted = await deleteRsvp(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'RSVP not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'RSVP deleted successfully',
  });
}
