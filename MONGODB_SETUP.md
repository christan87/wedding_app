# MongoDB Setup and Usage Guide

This guide explains how to set up and use MongoDB in your wedding app for creating, reading, updating, and deleting (CRUD) RSVP records.

## Table of Contents
1. [Setup](#setup)
2. [Environment Variables](#environment-variables)
3. [API Endpoints](#api-endpoints)
4. [Usage Examples](#usage-examples)
5. [Testing](#testing)

---

## Setup

### 1. MongoDB Atlas (Cloud Database)

If you don't have a MongoDB database yet:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier is fine)
4. Create a database user with username and password
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string

### 2. Local MongoDB (Optional)

Alternatively, install MongoDB locally:
```bash
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

---

## Environment Variables

Add your MongoDB connection string to `.env.local`:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wedding-app?retryWrites=true&w=majority

# Optional: Database name (defaults to 'wedding-app')
MONGODB_DB=wedding-app
```

**Important:** Never commit `.env.local` to version control!

---

## API Endpoints

### 1. Get All RSVPs
```
GET /api/rsvps
```

**Query Parameters:**
- `attending` (optional): Filter by attendance (true/false)
- `limit` (optional): Limit number of results

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "guestName": "John Doe",
      "email": "john@example.com",
      "attending": true,
      "numberOfGuests": 2,
      "dietaryRestrictions": "Vegetarian",
      "comments": "Looking forward to it!",
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-15T10:00:00.000Z"
    }
  ]
}
```

### 2. Create New RSVP
```
POST /api/rsvps
```

**Request Body:**
```json
{
  "guestName": "John Doe",
  "email": "john@example.com",
  "attending": true,
  "numberOfGuests": 2,
  "dietaryRestrictions": "Vegetarian",
  "comments": "Looking forward to it!"
}
```

**Required Fields:**
- `guestName` (string)
- `email` (string, valid email format)
- `attending` (boolean)

**Optional Fields:**
- `numberOfGuests` (number, defaults to 1)
- `dietaryRestrictions` (string)
- `comments` (string)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "guestName": "John Doe",
    "email": "john@example.com",
    "attending": true,
    "numberOfGuests": 2,
    "dietaryRestrictions": "Vegetarian",
    "comments": "Looking forward to it!",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z"
  }
}
```

### 3. Get Single RSVP
```
GET /api/rsvps/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "guestName": "John Doe",
    "email": "john@example.com",
    "attending": true,
    "numberOfGuests": 2,
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z"
  }
}
```

### 4. Update RSVP
```
PUT /api/rsvps/:id
```

**Request Body:** (only include fields you want to update)
```json
{
  "attending": false,
  "comments": "Unfortunately can't make it"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "guestName": "John Doe",
    "email": "john@example.com",
    "attending": false,
    "numberOfGuests": 2,
    "comments": "Unfortunately can't make it",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T11:00:00.000Z"
  }
}
```

### 5. Delete RSVP
```
DELETE /api/rsvps/:id
```

**Response:**
```json
{
  "success": true,
  "message": "RSVP deleted successfully"
}
```

### 6. Get RSVP Statistics
```
GET /api/rsvps/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "attending": 8,
    "notAttending": 2,
    "totalGuests": 15
  }
}
```

---

## Usage Examples

### Frontend (React/Next.js)

#### Create RSVP Form Handler
```javascript
async function handleSubmit(formData) {
  try {
    const response = await fetch('/api/rsvps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guestName: formData.name,
        email: formData.email,
        attending: formData.attending,
        numberOfGuests: formData.guests,
        dietaryRestrictions: formData.dietary,
        comments: formData.comments,
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('RSVP created:', result.data);
      // Show success message
    } else {
      console.error('Error:', result.error);
      // Show error message
    }
  } catch (error) {
    console.error('Failed to submit RSVP:', error);
  }
}
```

#### Fetch All RSVPs
```javascript
async function fetchRsvps() {
  try {
    const response = await fetch('/api/rsvps');
    const result = await response.json();

    if (result.success) {
      console.log('RSVPs:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Failed to fetch RSVPs:', error);
  }
}
```

#### Update RSVP
```javascript
async function updateRsvp(id, updates) {
  try {
    const response = await fetch(`/api/rsvps/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();

    if (result.success) {
      console.log('RSVP updated:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Failed to update RSVP:', error);
  }
}
```

#### Delete RSVP
```javascript
async function deleteRsvp(id) {
  try {
    const response = await fetch(`/api/rsvps/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (result.success) {
      console.log('RSVP deleted');
      return true;
    }
  } catch (error) {
    console.error('Failed to delete RSVP:', error);
  }
}
```

---

## Testing

### Using cURL

#### Create RSVP
```bash
curl -X POST http://localhost:3000/api/rsvps \
  -H "Content-Type: application/json" \
  -d '{
    "guestName": "John Doe",
    "email": "john@example.com",
    "attending": true,
    "numberOfGuests": 2
  }'
```

#### Get All RSVPs
```bash
curl http://localhost:3000/api/rsvps
```

#### Get Single RSVP
```bash
curl http://localhost:3000/api/rsvps/507f1f77bcf86cd799439011
```

#### Update RSVP
```bash
curl -X PUT http://localhost:3000/api/rsvps/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "attending": false,
    "comments": "Cannot attend"
  }'
```

#### Delete RSVP
```bash
curl -X DELETE http://localhost:3000/api/rsvps/507f1f77bcf86cd799439011
```

#### Get Statistics
```bash
curl http://localhost:3000/api/rsvps/stats
```

### Using Postman or Insomnia

1. Import the endpoints listed above
2. Set the base URL to `http://localhost:3000`
3. Test each endpoint with sample data

---

## File Structure

```
src/
├── lib/
│   └── mongodb.js          # MongoDB connection utility
├── models/
│   └── Rsvp.js            # RSVP data model and CRUD functions
└── pages/
    └── api/
        └── rsvps/
            ├── index.js    # GET all, POST new
            ├── [id].js     # GET, PUT, DELETE by ID
            └── stats.js    # GET statistics
```

---

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

---

## Next Steps

1. **Add authentication**: Protect admin endpoints with Clerk or another auth provider
2. **Add validation**: Use a library like Zod or Joi for request validation
3. **Add indexes**: Create MongoDB indexes for better query performance
4. **Add pagination**: Implement pagination for large datasets
5. **Add search**: Add search functionality by guest name or email
6. **Add email notifications**: Send confirmation emails when RSVPs are created

---

## Support

For issues or questions:
- Check MongoDB Atlas logs
- Check Next.js console logs
- Verify environment variables are set correctly
- Ensure MongoDB connection string is valid
