/**
 * ============================================================================
 * FILE: Rsvp.js
 * LOCATION: src/models/Rsvp.js
 * PURPOSE: RSVP MongoDB model schema definition and validation
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This file defines the RSVP data model (schema) for MongoDB.
 * It specifies:
 * 1. The structure of RSVP documents (what fields exist)
 * 2. Field types (String, Boolean, Date, etc.)
 * 3. Validation rules (required fields, formats, etc.)
 * 4. Helper functions for validation and object creation
 * 
 * WHAT IS A MODEL/SCHEMA?
 * =======================
 * In database applications, a model/schema defines the structure of your data.
 * Think of it like a blueprint or template for creating objects.
 * 
 * For example, every RSVP must have:
 * - A name (text)
 * - An email (text, must be valid email format)
 * - Attending status (yes/no)
 * - etc.
 * 
 * This file is the "single source of truth" for what an RSVP looks like.
 * 
 * DEPENDENCIES:
 * =============
 * This file has NO dependencies - it's a pure data definition.
 * It doesn't import anything because it only defines structure.
 * 
 * USED BY:
 * ========
 * Service Layer:
 * - src/services/rsvpService.js
 *   Uses this schema to understand RSVP structure
 * 
 * API Routes:
 * - src/pages/api/rsvps/index.js
 *   Uses validateRsvp() and createRsvpObject() functions
 * 
 * Components:
 * - src/components/public/RSVP/RSVPForm.js
 *   Form fields match this schema structure
 * 
 * RSVP SCHEMA FIELDS:
 * ===================
 * Each RSVP document contains:
 * 
 * CONTACT INFORMATION:
 * - name: Guest's full name (required)
 * - email: Guest's email address (required, unique)
 * - phone: Guest's phone number (required)
 * 
 * ATTENDANCE:
 * - attending: Boolean indicating if they're attending (required)
 * - guests: Boolean indicating if bringing additional guests (required)
 * - guestName: Name of additional guest (required if guests=true)
 * 
 * DIETARY RESTRICTIONS (nested object):
 * - dietaryRestrictions.none: Boolean
 * - dietaryRestrictions.vegetarian: Boolean
 * - dietaryRestrictions.vegan: Boolean
 * - dietaryRestrictions.glutenFree: Boolean
 * - dietaryRestrictions.nutAllergy: Boolean
 * - dietaryRestrictions.shellfishAllergy: Boolean
 * - dietaryRestrictions.other: String (custom dietary restriction)
 * 
 * ACCOMMODATIONS:
 * - accommodations: Boolean indicating if needs accommodations (required)
 * - accommodationsText: String with details (required if accommodations=true)
 * 
 * OPTIONAL FIELDS:
 * - song: String with song request
 * 
 * ADMIN FIELDS:
 * - approved: Boolean indicating if RSVP is approved by admin (default: false)
 * 
 * TIMESTAMPS (automatically added):
 * - createdAt: Timestamp when RSVP was created
 * - updatedAt: Timestamp when RSVP was last updated
 * 
 * ============================================================================
 */

/**
 * RSVP MODEL SCHEMA
 * 
 * Defines the structure and validation rules for RSVP documents.
 * 
 * IMPORTANT NOTE ABOUT MONGODB:
 * =============================
 * MongoDB is "schema-less" - it doesn't enforce structure at the database level.
 * This means you COULD store any data in any format.
 * 
 * However, we define a schema here for:
 * 1. Documentation: So developers know what fields exist
 * 2. Validation: So we can validate data before saving
 * 3. Consistency: So all RSVPs have the same structure
 * 
 * This schema is enforced in the APPLICATION LAYER (our code),
 * not in the DATABASE LAYER (MongoDB itself).
 * 
 * FIELD PROPERTIES EXPLAINED:
 * ===========================
 * - type: The JavaScript type (String, Boolean, Date, etc.)
 * - required: Whether the field must be provided
 * - unique: Whether the value must be unique across all documents
 * - lowercase: Whether to convert to lowercase before saving
 * - trim: Whether to remove whitespace from start/end
 * - default: Default value if not provided
 */
const RsvpSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  attending: {
    type: Boolean,
    required: true,
  },
  guests: {
    type: Boolean,
    required: true,
  },
  guestName: {
    type: String,
    required: false, // Required if guests=true
    trim: true,
  },
  dietaryRestrictions: {
    none: {
      type: Boolean,
      default: false,
    },
    vegetarian: {
      type: Boolean,
      default: false,
    },
    vegan: {
      type: Boolean,
      default: false,
    },
    glutenFree: {
      type: Boolean,
      default: false,
    },
    nutAllergy: {
      type: Boolean,
      default: false,
    },
    shellfishAllergy: {
      type: Boolean,
      default: false,
    },
    other: {
      type: String,
      default: '',
    },
  },
  accommodations: {
    type: Boolean,
    required: true,
  },
  accommodationsText: {
    type: String,
    required: false, // Required if accommodations=true
    trim: true,
  },
  song: {
    type: String,
    required: false,
    trim: true,
  },
  message: {
    type: String,
    required: false,
    trim: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};

/**
 * COLLECTION NAME
 * 
 * The name of the MongoDB collection where RSVP documents are stored.
 * 
 * In MongoDB:
 * - A DATABASE contains multiple COLLECTIONS
 * - A COLLECTION contains multiple DOCUMENTS
 * - A DOCUMENT is like a row in SQL (one RSVP record)
 * 
 * Think of it like:
 * - Database = wedding-app
 * - Collection = rsvps (this is like a table in SQL)
 * - Document = one individual RSVP
 * 
 * This constant is exported so other files can use the same collection name.
 */
export const COLLECTION_NAME = 'rsvps';

/**
 * VALIDATE RSVP DATA
 * 
 * Validates RSVP data against the schema before saving to database.
 * 
 * HOW VALIDATION WORKS:
 * =====================
 * 1. Checks all required fields are present and not empty
 * 2. Validates field formats (e.g., email format)
 * 3. Checks conditional requirements (e.g., guestName if guests=true)
 * 4. Returns validation result with any error messages
 * 
 * WHY WE VALIDATE:
 * ================
 * - Prevents bad data from being saved to database
 * - Provides helpful error messages to users
 * - Ensures data consistency
 * - Catches bugs early
 * 
 * USAGE EXAMPLE:
 * ==============
 * const validation = validateRsvp({
 *   name: 'John Doe',
 *   email: 'invalid-email',  // Bad format!
 *   // ... other fields
 * });
 * 
 * if (!validation.isValid) {
 *   console.log(validation.errors);
 *   // Output: ['Invalid email format']
 * }
 * 
 * @param {Object} data - RSVP data to validate
 * @returns {Object} Validation result { isValid: boolean, errors: string[] }
 */
export function validateRsvp(data) {
  // Array to collect all validation error messages
  const errors = [];

  // ============================================================================
  // VALIDATE REQUIRED FIELDS
  // ============================================================================
  
  // Check name: must exist, be a string, and not be empty after trimming
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('Name is required');
  }

  // Check email: must exist, be a string, and not be empty
  if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
    errors.push('Email is required');
  } else {
    // Validate email format using regular expression (regex)
    // This regex checks for: text@text.text format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format');
    }
  }

  // Check phone: must exist, be a string, and not be empty
  if (!data.phone || typeof data.phone !== 'string' || !data.phone.trim()) {
    errors.push('Phone is required');
  }

  // Check attending: must be a boolean (true or false)
  if (typeof data.attending !== 'boolean') {
    errors.push('Attending status is required');
  }

  // Check guests: must be a boolean (true or false)
  if (typeof data.guests !== 'boolean') {
    errors.push('Guests status is required');
  }

  // Check accommodations: must be a boolean (true or false)
  if (typeof data.accommodations !== 'boolean') {
    errors.push('Accommodations status is required');
  }

  // ============================================================================
  // VALIDATE CONDITIONAL REQUIRED FIELDS
  // ============================================================================
  // These fields are only required if certain conditions are met
  
  // If bringing guests, guest name is required
  if (data.guests === true) {
    if (!data.guestName || typeof data.guestName !== 'string' || !data.guestName.trim()) {
      errors.push('Guest name is required when bringing guests');
    }
  }

  // If needs accommodations, accommodation details are required
  if (data.accommodations === true) {
    if (!data.accommodationsText || typeof data.accommodationsText !== 'string' || !data.accommodationsText.trim()) {
      errors.push('Accommodation details are required when accommodations are needed');
    }
  }

  // Return validation result
  // isValid is true only if there are NO errors
  return {
    isValid: errors.length === 0,  // true if no errors, false if any errors
    errors,                         // array of error messages
  };
}

/**
 * CREATE DEFAULT RSVP OBJECT
 * 
 * Creates a new RSVP object with default values and proper formatting.
 * 
 * WHAT THIS FUNCTION DOES:
 * ========================
 * 1. Takes raw form data from the user
 * 2. Applies default values for missing fields
 * 3. Formats data correctly (lowercase email, trim whitespace, etc.)
 * 4. Ensures all fields match the schema structure
 * 5. Returns a clean, ready-to-save RSVP object
 * 
 * WHY WE USE THIS:
 * ================
 * - Ensures consistent data format
 * - Prevents undefined/null values
 * - Applies business logic (e.g., email lowercase)
 * - Makes code more maintainable
 * 
 * USAGE EXAMPLE:
 * ==============
 * const formData = {
 *   name: '  John Doe  ',  // Has extra spaces
 *   email: 'JOHN@EXAMPLE.COM',  // Uppercase
 *   attending: true,
 *   // ... other fields
 * };
 * 
 * const rsvp = createRsvpObject(formData);
 * // Result:
 * // {
 * //   name: 'John Doe',  // Trimmed
 * //   email: 'john@example.com',  // Lowercase
 * //   attending: true,
 * //   // ... all fields with defaults
 * // }
 * 
 * @param {Object} data - Raw RSVP data (usually from form submission)
 * @returns {Object} Formatted RSVP object ready to save to database
 */
export function createRsvpObject(data) {
  // Create and return a properly formatted RSVP object
  return {
    // Contact information (trimmed and formatted)
    name: data.name?.trim() || '',                      // Remove whitespace
    email: data.email?.toLowerCase().trim() || '',      // Lowercase + trim
    phone: data.phone?.trim() || '',                    // Remove whitespace
    
    // Attendance information (converted to boolean)
    attending: Boolean(data.attending),                 // Ensure boolean
    guests: Boolean(data.guests),                       // Ensure boolean
    guestName: data.guestName?.trim() || '',            // Remove whitespace
    // Dietary restrictions (nested object with boolean flags)
    dietaryRestrictions: {
      none: Boolean(data.dietaryRestrictions?.none),
      vegetarian: Boolean(data.dietaryRestrictions?.vegetarian),
      vegan: Boolean(data.dietaryRestrictions?.vegan),
      glutenFree: Boolean(data.dietaryRestrictions?.glutenFree),
      nutAllergy: Boolean(data.dietaryRestrictions?.nutAllergy),
      shellfishAllergy: Boolean(data.dietaryRestrictions?.shellfishAllergy),
      other: data.dietaryRestrictions?.other?.trim() || '',
    },
    // Accommodations
    accommodations: Boolean(data.accommodations),       // Ensure boolean
    accommodationsText: data.accommodationsText?.trim() || '',
    
    // Optional fields
    song: data.song?.trim() || '',                      // Remove whitespace
    message: data.message?.trim() || '',                // Remove whitespace
    
    // Admin approval (default: false)
    approved: Boolean(data.approved),                   // Ensure boolean
    
    // Timestamps (automatically set)
    createdAt: data.createdAt || new Date(),            // Use existing or now
    updatedAt: new Date(),                              // Always set to now
  };
}

/**
 * EXPORT SCHEMA
 * 
 * Export the schema as the default export so other files can import it.
 * 
 * Usage:
 * import RsvpSchema from '@/models/Rsvp';
 */
export default RsvpSchema;

/**
 * ============================================================================
 * END OF MODEL DEFINITION
 * ============================================================================
 * 
 * This model defines the structure of RSVP data for the wedding application.
 * It provides:
 * - Schema definition (RsvpSchema)
 * - Validation function (validateRsvp)
 * - Object creation function (createRsvpObject)
 * - Collection name constant (COLLECTION_NAME)
 * 
 * For database operations using this model, see:
 * - src/services/rsvpService.js (CRUD operations)
 * - src/pages/api/rsvps/*.js (API endpoints)
 * ============================================================================
 */
