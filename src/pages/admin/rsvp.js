/**
 * ============================================================================
 * FILE: rsvp.js
 * LOCATION: src/pages/admin/rsvp.js
 * PURPOSE: Admin page for managing RSVP submissions
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This admin page allows authorized users to:
 * - View all RSVP submissions from the database
 * - Approve RSVPs (set approved field to true)
 * - Revoke approval (set approved field back to false)
 * - Delete RSVPs from the database
 * - Expand/collapse RSVP details with dropdown
 * 
 * DEPENDENCIES:
 * =============
 * Components:
 * - ProtectedPage: Ensures only whitelisted users can access
 * - AdminLayout: Provides admin page layout and navigation
 * 
 * API Endpoints:
 * - GET /api/rsvps: Fetches all RSVPs
 * - PUT /api/rsvps/[id]: Updates RSVP (for approve/revoke)
 * - DELETE /api/rsvps/[id]: Deletes RSVP
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import ProtectedPage from '@/components/admin/ProtectedPage';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminRSVPPage() {
  // State for storing RSVPs from database
  const [rsvps, setRsvps] = useState([]);
  
  // State for tracking loading status
  const [loading, setLoading] = useState(true);
  
  // State for error messages
  const [error, setError] = useState(null);
  
  // State for tracking which RSVP details are expanded
  const [expandedIds, setExpandedIds] = useState(new Set());

  /**
   * FETCH RSVPS
   * 
   * Fetches all RSVPs from the database when component mounts.
   */
  useEffect(() => {
    fetchRsvps();
  }, []);

  /**
   * Fetch all RSVPs from the API
   */
  const fetchRsvps = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/rsvps');
      const data = await response.json();
      
      if (data.success) {
        setRsvps(data.data);
      } else {
        setError('Failed to load RSVPs');
      }
    } catch (err) {
      setError('Error loading RSVPs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * APPROVE RSVP
   * 
   * Sets the approved field to true for the specified RSVP.
   * 
   * @param {string} id - RSVP ID
   */
  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/rsvps/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: true }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state to reflect the change
        setRsvps(rsvps.map(rsvp => 
          rsvp._id === id ? { ...rsvp, approved: true } : rsvp
        ));
      } else {
        alert('Failed to approve RSVP');
      }
    } catch (err) {
      alert('Error approving RSVP: ' + err.message);
    }
  };

  /**
   * REVOKE APPROVAL
   * 
   * Sets the approved field back to false for the specified RSVP.
   * 
   * @param {string} id - RSVP ID
   */
  const handleRevoke = async (id) => {
    try {
      const response = await fetch(`/api/rsvps/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: false }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state to reflect the change
        setRsvps(rsvps.map(rsvp => 
          rsvp._id === id ? { ...rsvp, approved: false } : rsvp
        ));
      } else {
        alert('Failed to revoke approval');
      }
    } catch (err) {
      alert('Error revoking approval: ' + err.message);
    }
  };

  /**
   * DELETE RSVP
   * 
   * Permanently removes the RSVP from the database.
   * 
   * @param {string} id - RSVP ID
   */
  const handleDelete = async (id) => {
    // Confirm before deleting
    if (!confirm('Are you sure you want to delete this RSVP? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/rsvps/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setRsvps(rsvps.filter(rsvp => rsvp._id !== id));
      } else {
        alert('Failed to delete RSVP');
      }
    } catch (err) {
      alert('Error deleting RSVP: ' + err.message);
    }
  };

  /**
   * TOGGLE EXPANDED
   * 
   * Toggles the expanded state for an RSVP row.
   * 
   * @param {string} id - RSVP ID
   */
  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  return (
    <ProtectedPage>
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              RSVP Management
            </h1>
            <p className="text-gray-600">
              Manage wedding RSVP submissions
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading RSVPs...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* RSVP List */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Stats Bar */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Total RSVPs:</span>{' '}
                    <span className="text-gray-600">{rsvps.length}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Approved:</span>{' '}
                    <span className="text-green-600">
                      {rsvps.filter(r => r.approved).length}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Attending:</span>{' '}
                    <span className="text-blue-600">
                      {rsvps.filter(r => r.attending).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* RSVP Rows */}
              {rsvps.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No RSVPs yet
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {rsvps.map((rsvp) => (
                    <div key={rsvp._id} className="hover:bg-gray-50 transition-colors">
                      {/* Main Row */}
                      <div className="flex items-center justify-between px-6 py-4">
                        {/* Left: Expand Button + Info */}
                        <div className="flex items-center gap-4 flex-1">
                          {/* Expand/Collapse Button */}
                          <button
                            onClick={() => toggleExpanded(rsvp._id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <svg
                              className={`w-5 h-5 transition-transform ${
                                expandedIds.has(rsvp._id) ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {/* Name, Email, Attending */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-gray-800 truncate">
                                {rsvp.name}
                              </h3>
                              {rsvp.approved && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Approved
                                </span>
                              )}
                              {rsvp.attending ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Attending
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Not Attending
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {rsvp.email}
                            </p>
                          </div>
                        </div>

                        {/* Right: Action Buttons */}
                        <div className="flex items-center gap-2">
                          {/* Approve/Revoke Button */}
                          {rsvp.approved ? (
                            <button
                              onClick={() => handleRevoke(rsvp._id)}
                              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                            >
                              Revoke
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApprove(rsvp._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Approve
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(rsvp._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedIds.has(rsvp._id) && (
                        <div className="px-6 pb-4 bg-gray-50 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            {/* Phone */}
                            <div>
                              <span className="text-sm font-semibold text-gray-700">Phone:</span>
                              <p className="text-sm text-gray-600">{rsvp.phone || 'N/A'}</p>
                            </div>

                            {/* Guests */}
                            <div>
                              <span className="text-sm font-semibold text-gray-700">Bringing Guest:</span>
                              <p className="text-sm text-gray-600">
                                {rsvp.guests ? `Yes - ${rsvp.guestName || 'Name not provided'}` : 'No'}
                              </p>
                            </div>

                            {/* Dietary Restrictions */}
                            <div>
                              <span className="text-sm font-semibold text-gray-700">Dietary Restrictions:</span>
                              <p className="text-sm text-gray-600">
                                {rsvp.dietaryRestrictions?.none && 'None'}
                                {rsvp.dietaryRestrictions?.vegetarian && 'Vegetarian, '}
                                {rsvp.dietaryRestrictions?.vegan && 'Vegan, '}
                                {rsvp.dietaryRestrictions?.glutenFree && 'Gluten-Free, '}
                                {rsvp.dietaryRestrictions?.nutAllergy && 'Nut Allergy, '}
                                {rsvp.dietaryRestrictions?.shellfishAllergy && 'Shellfish Allergy, '}
                                {rsvp.dietaryRestrictions?.other && `Other: ${rsvp.dietaryRestrictions.other}`}
                              </p>
                            </div>

                            {/* Accommodations */}
                            <div>
                              <span className="text-sm font-semibold text-gray-700">Accommodations:</span>
                              <p className="text-sm text-gray-600">
                                {rsvp.accommodations 
                                  ? rsvp.accommodationsText || 'Yes (details not provided)' 
                                  : 'No'}
                              </p>
                            </div>

                            {/* Song Request */}
                            <div className="md:col-span-2">
                              <span className="text-sm font-semibold text-gray-700">Song Request:</span>
                              <p className="text-sm text-gray-600">{rsvp.song || 'None'}</p>
                            </div>

                            {/* Timestamps */}
                            <div>
                              <span className="text-sm font-semibold text-gray-700">Submitted:</span>
                              <p className="text-sm text-gray-600">
                                {new Date(rsvp.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedPage>
  );
}
