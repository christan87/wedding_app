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

import { MongoClient } from 'mongodb';

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'wedding-app';

// Validate that the MongoDB URI is defined
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global variable to cache the MongoDB client connection.
 * In development, Next.js hot reloading can cause multiple connections.
 * Using a global variable prevents creating too many connections.
 */
let cachedClient = null;
let cachedDb = null;

/**
 * CONNECT TO DATABASE
 * 
 * Establishes a connection to MongoDB and returns the client and database.
 * Uses connection pooling to reuse existing connections.
 * 
 * @returns {Promise<{client: MongoClient, db: Db}>} MongoDB client and database
 */
export async function connectToDatabase() {
  // If we already have a cached connection, return it
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // Create a new MongoDB client with connection options
  // Note: Keep options minimal for Netlify serverless compatibility
  const client = new MongoClient(MONGODB_URI, {
    // Connection pool settings
    maxPoolSize: 10, // Maximum number of connections in the pool
    minPoolSize: 1,  // Minimum number of connections to maintain (reduced for serverless)
    // Timeout settings
    serverSelectionTimeoutMS: 10000, // Timeout for selecting a server
    socketTimeoutMS: 45000, // Timeout for socket operations
    connectTimeoutMS: 10000, // Timeout for initial connection
    // Retry settings
    retryWrites: true,
    retryReads: true,
  });

  // Connect to MongoDB
  await client.connect();

  // Get the database
  const db = client.db(MONGODB_DB);

  // Cache the connection for reuse
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
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
