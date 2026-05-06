/**
 * ============================================================================
 * FILE: signatureService.js
 * LOCATION: src/services/signatureService.js
 * PURPOSE: Signature (Guest Book) database operations
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * Service layer for Guest Book signature CRUD operations.
 * 
 * DEPENDENCIES:
 * =============
 * - connectToDatabase: MongoDB connection utility
 * - ObjectId: MongoDB unique identifier type
 * 
 * ============================================================================
 */

import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'signatures';

/**
 * Get the signatures collection from the database.
 */
async function getSignatureCollection() {
  const { db } = await connectToDatabase();
  return db.collection(COLLECTION_NAME);
}

/**
 * CREATE SIGNATURE
 * 
 * @param {Object} signatureData - Signature data { name, message }
 * @returns {Promise<Object>} Created signature with _id
 */
export async function createSignature(signatureData) {
  const collection = await getSignatureCollection();

  const signature = {
    ...signatureData,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(signature);

  return {
    _id: result.insertedId,
    ...signature,
  };
}

/**
 * GET ALL SIGNATURES
 * 
 * @param {Object} [filter={}] - MongoDB query filter
 * @param {Object} [options={}] - Query options (sort, limit)
 * @returns {Promise<Array>} Array of signature documents
 */
export async function getSignatures(filter = {}, options = {}) {
  const collection = await getSignatureCollection();

  const signatures = await collection
    .find(filter)
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 0)
    .toArray();

  return signatures;
}

/**
 * DELETE SIGNATURE
 * 
 * @param {string} id - MongoDB document ID
 * @returns {Promise<boolean>} True if deleted
 */
export async function deleteSignature(id) {
  const collection = await getSignatureCollection();

  const result = await collection.deleteOne({
    _id: new ObjectId(id),
  });

  return result.deletedCount > 0;
}
