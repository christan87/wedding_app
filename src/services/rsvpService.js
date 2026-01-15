/**
 * ============================================================================
 * FILE: rsvpService.js
 * LOCATION: src/services/rsvpService.js
 * PURPOSE: RSVP database operations and business logic (Service Layer)
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This is the SERVICE LAYER for RSVP operations. It provides functions for
 * creating, reading, updating, and deleting (CRUD) RSVP records in MongoDB.
 * 
 * WHAT IS A SERVICE LAYER?
 * ========================
 * In software architecture, the service layer sits between:
 * - API Routes (what the user calls) → Service Layer → Database
 * 
 * This separation provides:
 * 1. Reusability: Multiple API routes can use the same service functions
 * 2. Maintainability: Database logic is in one place, not scattered
 * 3. Testability: Service functions can be tested independently
 * 
 * DEPENDENCIES:
 * =============
 * MongoDB Connection:
 * - connectToDatabase: Establishes connection to MongoDB
 *   Location: src/lib/mongodb.js
 *   Purpose: Provides database connection with connection pooling
 * 
 * MongoDB Driver:
 * - ObjectId: MongoDB's unique identifier type
 *   Location: 'mongodb' package
 *   Purpose: Converts string IDs to MongoDB ObjectId format
 * 
 * Data Model:
 * - RSVP Schema: Defines the structure of RSVP data
 *   Location: src/models/Rsvp.js
 *   Purpose: Validation and data structure definition
 * 
 * USED BY:
 * ========
 * API Routes:
 * - src/pages/api/rsvps/index.js (GET all, POST new)
 * - src/pages/api/rsvps/[id].js (GET, PUT, DELETE by ID)
 * - src/pages/api/rsvps/stats.js (GET statistics)
 * 
 * HOW THIS WORKS:
 * ===============
 * 1. API route receives HTTP request from user
 * 2. API route calls service function (e.g., createRsvp)
 * 3. Service function connects to MongoDB
 * 4. Service function performs database operation
 * 5. Service function returns result to API route
 * 6. API route sends HTTP response to user
 * 
 * USAGE EXAMPLES:
 * ===============
 * import { createRsvp, getRsvps, updateRsvp, deleteRsvp } from '@/services/rsvpService';
 * 
 * // Create a new RSVP
 * const newRsvp = await createRsvp({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   attending: true,
 *   // ... other fields
 * });
 * 
 * // Get all RSVPs
 * const allRsvps = await getRsvps();
 * 
 * // Get RSVPs with filter
 * const attendingRsvps = await getRsvps({ attending: true });
 * 
 * ============================================================================
 */

import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * COLLECTION NAME
 * 
 * The name of the MongoDB collection where RSVP documents are stored.
 * In MongoDB, a collection is like a table in SQL databases.
 * All RSVP records are stored in the 'rsvps' collection.
 */
const COLLECTION_NAME = 'rsvps';

/**
 * GET RSVP COLLECTION
 * 
 * Helper function to get the RSVP collection from the database.
 * This is used internally by all other functions in this file.
 * 
 * How it works:
 * 1. Calls connectToDatabase() to get a database connection
 * 2. Returns the 'rsvps' collection from that database
 * 
 * Why we use this:
 * - Avoids repeating the same code in every function
 * - Ensures we always use the correct collection name
 * - Makes it easy to change the collection name if needed
 * 
 * @returns {Promise<Collection>} MongoDB collection object
 */
async function getRsvpCollection() {
  // Get database connection (uses connection pooling)
  const { db } = await connectToDatabase();
  
  // Return the 'rsvps' collection
  return db.collection(COLLECTION_NAME);
}

/**
 * CREATE RSVP
 * 
 * Creates a new RSVP record in the MongoDB database.
 * 
 * How it works:
 * 1. Gets the MongoDB collection
 * 2. Adds timestamp fields (createdAt, updatedAt)
 * 3. Inserts the document into MongoDB
 * 4. Returns the created RSVP with its new _id
 * 
 * The spread operator (...rsvpData) copies all properties from rsvpData
 * into the new object, then we add the timestamp fields.
 * 
 * MongoDB automatically generates a unique _id for each document.
 * 
 * @param {Object} rsvpData - RSVP data (should match schema in src/models/Rsvp.js)
 * @returns {Promise<Object>} Created RSVP with _id and timestamps
 */
export async function createRsvp(rsvpData) {
  // Get the MongoDB collection
  const collection = await getRsvpCollection();
  
  // Create the RSVP object with timestamps
  const rsvp = {
    ...rsvpData,              // Copy all fields from rsvpData
    createdAt: new Date(),    // Add creation timestamp
    updatedAt: new Date(),    // Add update timestamp
  };
  
  // Insert the document into MongoDB
  const result = await collection.insertOne(rsvp);
  
  // Return the created RSVP with its MongoDB _id
  return {
    _id: result.insertedId,   // MongoDB's generated unique ID
    ...rsvp,                   // All the RSVP data
  };
}

/**
 * GET ALL RSVPS
 * 
 * Retrieves RSVP records from the database with optional filtering and sorting.
 * 
 * How it works:
 * 1. Gets the MongoDB collection
 * 2. Queries the database with optional filter
 * 3. Sorts results (default: newest first)
 * 4. Limits results if specified
 * 5. Converts MongoDB cursor to array
 * 
 * Filter examples:
 * - {} (empty): Returns all RSVPs
 * - { attending: true }: Returns only RSVPs where attending is true
 * - { email: 'john@example.com' }: Returns RSVPs with that email
 * 
 * Sort examples:
 * - { createdAt: -1 }: Newest first (default)
 * - { createdAt: 1 }: Oldest first
 * - { name: 1 }: Alphabetical by name
 * 
 * @param {Object} [filter={}] - MongoDB query filter (default: empty = all records)
 * @param {Object} [options={}] - Query options (sort, limit)
 * @returns {Promise<Array>} Array of RSVP documents
 */
export async function getRsvps(filter = {}, options = {}) {
  // Get the MongoDB collection
  const collection = await getRsvpCollection();
  
  // Query the database
  const rsvps = await collection
    .find(filter)                                    // Apply filter
    .sort(options.sort || { createdAt: -1 })        // Sort (default: newest first)
    .limit(options.limit || 0)                      // Limit results (0 = no limit)
    .toArray();                                      // Convert to JavaScript array
  
  return rsvps;
}

/**
 * GET RSVP BY ID
 * 
 * Retrieves a single RSVP by its unique MongoDB ID.
 * 
 * How it works:
 * 1. Gets the MongoDB collection
 * 2. Converts the string ID to MongoDB ObjectId format
 * 3. Finds the document with that _id
 * 4. Returns the document or null if not found
 * 
 * MongoDB IDs are stored as ObjectId type, not strings.
 * We must convert the string ID to ObjectId before querying.
 * 
 * Example ID: "507f1f77bcf86cd799439011" (24-character hex string)
 * 
 * @param {string} id - MongoDB document ID (24-character hex string)
 * @returns {Promise<Object|null>} RSVP document or null if not found
 */
export async function getRsvpById(id) {
  // Get the MongoDB collection
  const collection = await getRsvpCollection();
  
  // Find one document by _id
  const rsvp = await collection.findOne({
    _id: new ObjectId(id),    // Convert string to ObjectId
  });
  
  // Returns the document or null if not found
  return rsvp;
}

/**
 * GET RSVP BY EMAIL
 * 
 * Retrieves a single RSVP by email address.
 * 
 * How it works:
 * 1. Gets the MongoDB collection
 * 2. Converts email to lowercase for case-insensitive search
 * 3. Finds the first document with that email
 * 4. Returns the document or null if not found
 * 
 * Emails are stored in lowercase in the database to ensure
 * case-insensitive uniqueness (john@example.com = JOHN@example.com).
 * 
 * @param {string} email - Guest's email address
 * @returns {Promise<Object|null>} RSVP document or null if not found
 */
export async function getRsvpByEmail(email) {
  // Get the MongoDB collection
  const collection = await getRsvpCollection();
  
  // Find one document by email (case-insensitive)
  const rsvp = await collection.findOne({
    email: email.toLowerCase(),    // Convert to lowercase for matching
  });
  
  // Returns the document or null if not found
  return rsvp;
}

/**
 * UPDATE RSVP
 * 
 * Updates an existing RSVP record in the database.
 * 
 * How it works:
 * 1. Gets the MongoDB collection
 * 2. Finds the document by _id
 * 3. Updates specified fields using MongoDB's $set operator
 * 4. Automatically updates the updatedAt timestamp
 * 5. Returns the updated document
 * 
 * MongoDB's $set operator updates only the specified fields,
 * leaving other fields unchanged.
 * 
 * The 'returnDocument: after' option returns the updated document
 * instead of the original document.
 * 
 * @param {string} id - MongoDB document ID
 * @param {Object} updateData - Fields to update (partial RSVP object)
 * @returns {Promise<Object|null>} Updated RSVP or null if not found
 */
export async function updateRsvp(id, updateData) {
  // Get the MongoDB collection
  const collection = await getRsvpCollection();
  
  // Find and update the document
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },              // Find by ID
    {
      $set: {                                // MongoDB update operator
        ...updateData,                       // Spread the update fields
        updatedAt: new Date(),               // Update timestamp
      },
    },
    { returnDocument: 'after' }              // Return updated document
  );
  
  // Returns the updated document or null if not found
  return result;
}

/**
 * DELETE RSVP
 * 
 * Permanently deletes an RSVP record from the database.
 * 
 * How it works:
 * 1. Gets the MongoDB collection
 * 2. Finds the document by _id
 * 3. Deletes the document
 * 4. Returns true if deleted, false if not found
 * 
 * WARNING: This is a permanent operation and cannot be undone!
 * 
 * The deletedCount property tells us how many documents were deleted:
 * - 1 = document was found and deleted
 * - 0 = document was not found
 * 
 * @param {string} id - MongoDB document ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export async function deleteRsvp(id) {
  // Get the MongoDB collection
  const collection = await getRsvpCollection();
  
  // Delete the document by ID
  const result = await collection.deleteOne({
    _id: new ObjectId(id),    // Convert string to ObjectId
  });
  
  // Return true if a document was deleted, false otherwise
  return result.deletedCount > 0;
}

/**
 * GET RSVP STATISTICS
 * 
 * Calculates statistics about all RSVPs using MongoDB aggregation.
 * 
 * How it works:
 * 1. Gets the MongoDB collection
 * 2. Uses MongoDB's aggregation pipeline to calculate stats
 * 3. Groups all documents together (_id: null)
 * 4. Counts totals using $sum and $cond operators
 * 5. Returns statistics object
 * 
 * MONGODB AGGREGATION EXPLAINED:
 * ==============================
 * Aggregation is like a pipeline that processes documents:
 * - $group: Groups documents together
 * - $sum: Adds up values
 * - $cond: Conditional logic (if/then/else)
 * 
 * Example: $cond: ['$attending', 1, 0] means:
 * "If attending is true, add 1, otherwise add 0"
 * 
 * Returns:
 * {
 *   total: 10,           // Total number of RSVPs
 *   attending: 8,        // Number of people attending
 *   notAttending: 2,     // Number of people not attending
 *   totalGuests: 15      // Total number of guests (if attending)
 * }
 * 
 * @returns {Promise<Object>} Statistics object with counts
 */
export async function getRsvpStats() {
  // Get the MongoDB collection
  const collection = await getRsvpCollection();
  
  // Run aggregation pipeline
  const stats = await collection.aggregate([
    {
      $group: {                              // Group all documents together
        _id: null,                           // null = one group for all docs
        total: { $sum: 1 },                  // Count all documents
        attending: {                         // Count attending = true
          $sum: { $cond: ['$attending', 1, 0] }
        },
        notAttending: {                      // Count attending = false
          $sum: { $cond: ['$attending', 0, 1] }
        },
        totalGuests: {                       // Sum numberOfGuests if attending
          $sum: { $cond: ['$attending', '$numberOfGuests', 0] }
        },
      },
    },
  ]).toArray();                              // Convert to array
  
  // Return first result or default values if no RSVPs exist
  return stats[0] || {
    total: 0,
    attending: 0,
    notAttending: 0,
    totalGuests: 0,
  };
}

/**
 * ============================================================================
 * END OF SERVICE LAYER
 * ============================================================================
 * 
 * This service layer provides a clean interface for RSVP database operations.
 * All database logic is centralized here, making it easy to maintain and test.
 * 
 * For API routes that use these functions, see:
 * - src/pages/api/rsvps/index.js
 * - src/pages/api/rsvps/[id].js
 * - src/pages/api/rsvps/stats.js
 * ============================================================================
 */
