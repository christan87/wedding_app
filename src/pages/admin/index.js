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
          {/* Responsive: 1 column on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Guests Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Guests</h3>
              <p className="mt-2 text-3xl font-bold text-rose-600">0</p>
              <p className="mt-1 text-sm text-gray-500">Total invited</p>
            </div>

            {/* RSVPs Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">RSVPs</h3>
              <p className="mt-2 text-3xl font-bold text-rose-600">0</p>
              <p className="mt-1 text-sm text-gray-500">Responses received</p>
            </div>

            {/* Events Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Events</h3>
              <p className="mt-2 text-3xl font-bold text-rose-600">0</p>
              <p className="mt-1 text-sm text-gray-500">Scheduled</p>
            </div>
          </div>

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
