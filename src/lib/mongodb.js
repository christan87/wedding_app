/**
 * ============================================================================
 * FILE: mongodb.js
 * LOCATION: src/lib/mongodb.js
 * PURPOSE: MongoDB connection utility with connection pooling
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This utility manages the MongoDB connection for the application.
 * It implements connection pooling to reuse database connections across
 * API requests, which is essential for serverless environments like Next.js.
 * 
 * CONNECTION POOLING:
 * ===================
 * In serverless environments, each API request may spin up a new instance.
 * Without connection pooling, we'd create a new database connection for
 * every request, which is slow and can exhaust connection limits.
 * 
 * This utility caches the connection in a global variable so subsequent
 * requests reuse the same connection instead of creating new ones.
 * 
 * ENVIRONMENT VARIABLES:
 * ======================
 * Required in .env.local:
 * - MONGODB_URI: Your MongoDB connection string
 *   Example: mongodb+srv://username:password@cluster.mongodb.net/wedding-app
 * 
 * USAGE:
 * ======
 * import { connectToDatabase } from '@/lib/mongodb';
 * 
 * const { db } = await connectToDatabase();
 * const collection = db.collection('rsvps');
 * 
 * ============================================================================
 */

import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'wedding-app';

/**
 * Global variable to cache the MongoDB client connection.
 * In development, Next.js hot reloading can cause multiple connections.
 * Using a global variable prevents creating too many connections.
 * 
 * In serverless environments (Netlify), this cache may not persist between
 * cold starts, but it helps reuse connections within the same container.
 */
let cachedClient = null;
let cachedDb = null;

/**
 * CONNECT TO DATABASE
 * 
 * Establishes a connection to MongoDB and returns the client and database.
 * Uses connection pooling to reuse existing connections.
 * 
 * SERVERLESS COMPATIBILITY:
 * - Validates environment variables at runtime (not module load time)
 * - Uses shorter timeouts suitable for serverless cold starts
 * - Checks connection health before reusing cached connections
 * 
 * @returns {Promise<{client: MongoClient, db: Db}>} MongoDB client and database
 * @throws {Error} If MONGODB_URI is not defined or connection fails
 */
export async function connectToDatabase() {
  // Validate environment variable at runtime (not module load time)
  // This allows proper error handling in API routes
  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI environment variable is not defined. Please add it to your Netlify environment variables.'
    );
  }

  // If we have a cached connection, verify it's still alive
  if (cachedClient && cachedDb) {
    try {
      // Ping the database to check if connection is still alive
      await cachedClient.db('admin').command({ ping: 1 });
      return {
        client: cachedClient,
        db: cachedDb,
      };
    } catch (error) {
      // Connection is stale, clear cache and reconnect
      console.warn('Cached MongoDB connection is stale, reconnecting...', error.message);
      cachedClient = null;
      cachedDb = null;
    }
  }

  // Create a new MongoDB client with serverless-optimized options
  const client = new MongoClient(MONGODB_URI, {
    // MongoDB Atlas Stable API (recommended for Atlas connections)
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    // Connection pool settings (optimized for serverless)
    maxPoolSize: 10, // Maximum number of connections in the pool
    minPoolSize: 0,  // No minimum connections (serverless-friendly)
    maxIdleTimeMS: 10000, // Close idle connections after 10 seconds
    // Timeout settings (shorter for serverless cold starts)
    serverSelectionTimeoutMS: 5000, // 5 second timeout for selecting a server
    socketTimeoutMS: 45000, // 45 second timeout for socket operations
    connectTimeoutMS: 10000, // 10 second timeout for initial connection
    // Retry settings
    retryWrites: true,
    retryReads: true,
  });

  try {
    // Connect to MongoDB
    await client.connect();

    // Get the database
    const db = client.db(MONGODB_DB);

    // Cache the connection for reuse
    cachedClient = client;
    cachedDb = db;

    console.log('MongoDB connected successfully');

    return {
      client: cachedClient,
      db: cachedDb,
    };
  } catch (error) {
    // Provide detailed error message for debugging
    console.error('MongoDB connection error:', error);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}

/**
 * CLOSE DATABASE CONNECTION
 * 
 * Closes the MongoDB connection. Typically not needed in serverless
 * environments as connections are managed automatically, but useful
 * for cleanup in certain scenarios.
 */
export async function closeDatabaseConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}
