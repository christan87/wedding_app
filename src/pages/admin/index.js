/**
 * ============================================================================
 * FILE: index.js
 * LOCATION: src/pages/admin/index.js
 * PURPOSE: Admin dashboard page - the main landing page for logged-in admins
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This is the admin dashboard that users see after logging in.
 * It displays:
 * 1. Welcome message and page title
 * 2. Statistics cards showing Guests, RSVPs, and Events counts
 * 3. Quick actions section with a logout button
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - @clerk/nextjs: SignOutButton component for logging out
 * 
 * Components:
 * - AdminLayout: Provides the sidebar navigation and page structure
 *   Location: src/components/admin/AdminLayout.js
 * - ProtectedPage: Ensures only logged-in users can access this page
 *   Location: src/components/admin/ProtectedPage.js
 * 
 * HOW PROTECTION WORKS:
 * =====================
 * The page is wrapped in two components:
 * 1. ProtectedPage (outer): Checks if user is logged in, redirects to login if not
 * 2. AdminLayout (inner): Provides the sidebar and consistent page layout
 * 
 * This pattern should be used for all admin pages.
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { SignOutButton } from '@clerk/nextjs';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedPage from '@/components/admin/ProtectedPage';

/**
 * ADMINDASHBOARD COMPONENT
 * 
 * The main admin dashboard page.
 * Shows statistics and quick actions for wedding management.
 */
export default function AdminDashboard() {
  // State for storing RSVPs from database
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
   * CALCULATE TOTAL GUEST COUNT
   * 
   * Counts total attendees from approved RSVPs:
   * - Each RSVP counts as 1
   * - If guests=true, add 1 more (total 2 for that RSVP)
   */
  const getTotalGuestCount = () => {
    const approvedGuests = rsvps.filter(rsvp => rsvp.approved === true);
    return approvedGuests.reduce((total, guest) => {
      let count = 1;
      if (guest.guests) {
        count += 1;
      }
      return total + count;
    }, 0);
  };

  return (
    // ProtectedPage: Redirects to /admin/login if not authenticated
    <ProtectedPage>
      {/* AdminLayout: Provides sidebar navigation */}
      <AdminLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Welcome to the Wedding Admin Panel</p>
          </div>

          {/* Statistics Cards Grid */}
          {/* Responsive: 1 column on mobile, 2 columns on larger screens */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total RSVPs Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total RSVPs</h3>
              {loading ? (
                <div className="mt-2 h-9 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="mt-2 text-3xl font-bold text-blue-600">{rsvps.length}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">Responses received</p>
            </div>

            {/* Approved Guests Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Approved Guests</h3>
              {loading ? (
                <div className="mt-2 h-9 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="mt-2 text-3xl font-bold text-green-600">{getTotalGuestCount()}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">Total attendees</p>
            </div>

            {/* Attending Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Attending</h3>
              {loading ? (
                <div className="mt-2 h-9 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="mt-2 text-3xl font-bold text-rose-600">{rsvps.filter(r => r.attending).length}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">Confirmed yes</p>
            </div>

            {/* Approved RSVPs Card
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Approved</h3>
              {loading ? (
                <div className="mt-2 h-9 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="mt-2 text-3xl font-bold text-purple-600">{rsvps.filter(r => r.approved).length}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">Approved RSVPs</p>
            </div> */}
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Quick Actions Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              {/* Logout Button - uses Clerk's SignOutButton */}
              <SignOutButton>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Logout
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedPage>
  );
}
