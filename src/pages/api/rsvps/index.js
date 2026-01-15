/**
 * ============================================================================
 * FILE: index.js
 * LOCATION: src/pages/api/rsvps/index.js
 * PURPOSE: API endpoint for RSVP list operations (GET all, POST new)
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This is a Next.js API route that handles HTTP requests for RSVP operations.
 * It provides two main functions:
 * 1. GET /api/rsvps - Retrieve all RSVPs from the database
 * 2. POST /api/rsvps - Create a new RSVP in the database
 * 
 * WHAT IS AN API ROUTE?
 * =====================
 * An API route is a server-side endpoint that handles HTTP requests.
 * Think of it as a "door" that the frontend can knock on to:
 * - Get data from the database
 * - Save data to the database
 * - Update or delete data
 * 
 * The flow is:
 * User fills form → Form submits to API → API saves to database → API responds
 * 
 * NEXT.JS API ROUTES:
 * ===================
 * In Next.js, files in pages/api/ automatically become API endpoints:
 * - pages/api/rsvps/index.js → http://yoursite.com/api/rsvps
 * - pages/api/rsvps/[id].js → http://yoursite.com/api/rsvps/:id
 * 
 * DEPENDENCIES:
 * =============
 * Service Layer:
 * - createRsvp, getRsvps: Database operations
 *   Location: src/services/rsvpService.js
 *   Purpose: Handles actual database queries
 * 
 * Data Model:
 * - validateRsvp: Validates RSVP data
 * - createRsvpObject: Creates formatted RSVP object
 *   Location: src/models/Rsvp.js
 *   Purpose: Data validation and formatting
 * 
 * CALLED BY:
 * ==========
 * Frontend Components:
 * - src/components/public/RSVP/RSVPForm.js
 *   Submits form data to POST /api/rsvps
 * 
 * USAGE EXAMPLES:
 * ===============
 * GET /api/rsvps
 * Returns: {
 *   success: true,
 *   count: 10,
 *   data: [{ _id: '...', name: 'John Doe', ... }, ...]
 * }
 * 
 * POST /api/rsvps
 * Body: {
 *   name: "John Doe",
 *   email: "john@example.com",
 *   phone: "555-1234",
 *   attending: true,
 *   guests: false,
 *   // ... other fields
 * }
 * Returns: {
 *   success: true,
 *   data: { _id: '...', name: 'John Doe', ... }
 * }
 * 
 * ============================================================================
 */

import { createRsvp, getRsvps } from '@/services/rsvpService';
import { validateRsvp, createRsvpObject } from '@/models/Rsvp';

/**
 * API HANDLER
 * 
 * Main function that handles all HTTP requests to /api/rsvps.
 * 
 * HOW THIS WORKS:
 * ===============
 * 1. Next.js calls this function when someone makes a request to /api/rsvps
 * 2. We check the HTTP method (GET, POST, etc.)
 * 3. We route to the appropriate handler function
 * 4. If something goes wrong, we catch the error and return an error response
 * 
 * HTTP METHODS EXPLAINED:
 * =======================
 * - GET: Retrieve data (like reading a book)
 * - POST: Create new data (like writing a new page)
 * - PUT: Update existing data (like editing a page)
 * - DELETE: Remove data (like tearing out a page)
 * 
 * This endpoint only handles GET and POST.
 * For PUT and DELETE, see src/pages/api/rsvps/[id].js
 * 
 * @param {Object} req - Request object (contains method, body, query, etc.)
 * @param {Object} res - Response object (used to send data back to client)
 */
export default async function handler(req, res) {
  // Extract the HTTP method from the request
  const { method } = req;

  // Try to handle the request
  try {
    // Route to the appropriate handler based on HTTP method
    switch (method) {
      case 'GET':
        // Handle GET request - retrieve all RSVPs
        await handleGet(req, res);
        break;

      case 'POST':
        // Handle POST request - create a new RSVP
        await handlePost(req, res);
        break;

      default:
        // If method is not GET or POST, return error
        // HTTP 405 = Method Not Allowed
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({
          success: false,
          error: `Method ${method} Not Allowed`,
        });
        break;
    }
  } catch (error) {
    // If anything goes wrong, catch the error and return error response
    // HTTP 500 = Internal Server Error
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
 * Retrieves all RSVPs from the database.
 * 
 * HOW THIS WORKS:
 * ===============
 * 1. Extracts optional query parameters from URL
 * 2. Builds filter object based on parameters
 * 3. Calls service layer to get RSVPs from database
 * 4. Returns RSVPs with success response
 * 
 * QUERY PARAMETERS:
 * =================
 * These are optional parameters in the URL:
 * - attending: Filter by attendance (true/false)
 *   Example: /api/rsvps?attending=true
 * - limit: Limit number of results
 *   Example: /api/rsvps?limit=10
 * 
 * HTTP STATUS CODES:
 * ==================
 * - 200: Success - request completed successfully
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function handleGet(req, res) {
  // Extract query parameters from URL
  // Example: /api/rsvps?attending=true&limit=10
  const { attending, limit } = req.query;

  // Build filter object for database query
  const filter = {};
  if (attending !== undefined) {
    // Convert string 'true'/'false' to boolean
    filter.attending = attending === 'true';
  }

  // Build options object for database query
  const options = {};
  if (limit) {
    // Convert string to number
    options.limit = parseInt(limit);
  }

  // Get RSVPs from database using service layer
  const rsvps = await getRsvps(filter, options);

  // Send success response with data
  // HTTP 200 = OK
  res.status(200).json({
    success: true,
    count: rsvps.length,  // Number of RSVPs returned
    data: rsvps,          // Array of RSVP objects
  });
}

/**
 * HANDLE POST REQUEST
 * 
 * Creates a new RSVP in the database.
 * 
 * HOW THIS WORKS:
 * ===============
 * 1. Receives RSVP data from request body (from form submission)
 * 2. Validates the data using the model's validation function
 * 3. If validation fails, returns error with messages
 * 4. If validation passes, formats the data
 * 5. Saves to database using service layer
 * 6. Returns the created RSVP with success response
 * 
 * VALIDATION:
 * ===========
 * Before saving to database, we check:
 * - All required fields are present
 * - Email is in valid format
 * - Phone number is provided
 * - Boolean fields are actually booleans
 * - Conditional fields (guestName if guests=true)
 * 
 * HTTP STATUS CODES:
 * ==================
 * - 201: Created - new resource created successfully
 * - 400: Bad Request - validation failed
 * 
 * @param {Object} req - Request object (contains form data in req.body)
 * @param {Object} res - Response object
 */
async function handlePost(req, res) {
  // Validate RSVP data using the model's validation function
  // This checks all required fields and formats
  const validation = validateRsvp(req.body);
  
  // If validation failed, return error response
  if (!validation.isValid) {
    // HTTP 400 = Bad Request (client sent invalid data)
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: validation.errors,  // Array of error messages
    });
  }

  // Create properly formatted RSVP object with defaults
  // This ensures consistent data format (lowercase email, trimmed strings, etc.)
  const rsvpData = createRsvpObject(req.body);

  // Save to database using service layer
  const rsvp = await createRsvp(rsvpData);

  // Send success response with created RSVP
  // HTTP 201 = Created (new resource created successfully)
  res.status(201).json({
    success: true,
    data: rsvp,  // The created RSVP with _id from MongoDB
  });
}
