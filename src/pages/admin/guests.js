/**
 * ============================================================================
 * FILE: guests.js
 * LOCATION: src/pages/admin/guests.js
 * PURPOSE: Admin page for viewing approved guest list
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This admin page displays all approved RSVPs with:
 * - Total guest count (RSVPs with guests=true count as 2 attendees)
 * - List of all approved RSVPs with name, email, and phone
 * - Copyable list of all emails (comma-separated)
 * - Copyable list of all phone numbers (comma-separated)
 * 
 * DEPENDENCIES:
 * =============
 * Components:
 * - ProtectedPage: Ensures only whitelisted users can access
 * - AdminLayout: Provides admin page layout and navigation
 * 
 * API Endpoints:
 * - GET /api/rsvps?approved=true: Fetches only approved RSVPs
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import ProtectedPage from '@/components/admin/ProtectedPage';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminGuestsPage() {
  // State for storing approved RSVPs from database
  const [guests, setGuests] = useState([]);
  
  // State for tracking loading status
  const [loading, setLoading] = useState(true);
  
  // State for error messages
  const [error, setError] = useState(null);
  
  // State for copy feedback
  const [copiedEmails, setCopiedEmails] = useState(false);
  const [copiedPhones, setCopiedPhones] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);

  /**
   * FETCH APPROVED RSVPS
   * 
   * Fetches only approved RSVPs from the database when component mounts.
   */
  useEffect(() => {
    fetchGuests();
  }, []);

  /**
   * Fetch approved RSVPs from the API
   */
  const fetchGuests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch approved RSVPs
      const response = await fetch('/api/rsvps');
      const data = await response.json();
      
      if (data.success) {
        // Filter for approved RSVPs only
        const approvedGuests = data.data.filter(rsvp => rsvp.approved === true);
        setGuests(approvedGuests);
      } else {
        setError('Failed to load guests');
      }
    } catch (err) {
      setError('Error loading guests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * CALCULATE TOTAL GUEST COUNT
   * 
   * Counts total attendees:
   * - Each RSVP counts as 1
   * - If guests=true, add 1 more (total 2 for that RSVP)
   */
  const getTotalGuestCount = () => {
    return guests.reduce((total, guest) => {
      // Each RSVP is 1 person
      let count = 1;
      // If bringing a guest, add 1 more
      if (guest.guests) {
        count += 1;
      }
      return total + count;
    }, 0);
  };

  /**
   * GET ALL EMAILS
   * 
   * Returns comma-separated string of all guest emails
   */
  const getAllEmails = () => {
    return guests.map(guest => guest.email).join(', ');
  };

  /**
   * GET ALL PHONE NUMBERS
   * 
   * Returns comma-separated string of all guest phone numbers (without duplicates)
   */
  const getAllPhones = () => {
    const uniquePhones = [...new Set(guests.map(guest => guest.phone))];
    return uniquePhones.join(', ');
  };

  /**
   * COPY TO CLIPBOARD
   * 
   * Copies text to clipboard and shows feedback
   */
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      
      if (type === 'emails') {
        setCopiedEmails(true);
        setTimeout(() => setCopiedEmails(false), 2000);
      } else if (type === 'phones') {
        setCopiedPhones(true);
        setTimeout(() => setCopiedPhones(false), 2000);
      }
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  /**
   * COPY INDIVIDUAL ITEM
   * 
   * Copies individual email or phone to clipboard
   */
  const copyIndividualItem = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(null), 1500);
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <ProtectedPage>
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Guest List
            </h1>
            <p className="text-gray-600">
              Approved RSVPs and contact information
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading guests...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Guest List */}
          {!loading && !error && (
            <>
              {/* Stats and Copy Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Total Guests Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Total Guests</h3>
                  <p className="text-4xl font-bold text-blue-600">{getTotalGuestCount()}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {guests.length} RSVPs ({guests.filter(g => g.guests).length} bringing guests)
                  </p>
                </div>

                {/* All Emails Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-700">All Emails</h3>
                    <button
                      onClick={() => copyToClipboard(getAllEmails(), 'emails')}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        copiedEmails
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {copiedEmails ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 overflow-hidden">
                    <p className="truncate">{getAllEmails() || 'No emails'}</p>
                  </div>
                </div>

                {/* All Phone Numbers Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-700">All Phone Numbers</h3>
                    <button
                      onClick={() => copyToClipboard(getAllPhones(), 'phones')}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        copiedPhones
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {copiedPhones ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 overflow-hidden">
                    <p className="truncate">{getAllPhones() || 'No phone numbers'}</p>
                  </div>
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Quick Copy Feature</p>
                    <p>Click on any email address or phone number to copy it to your clipboard.</p>
                  </div>
                </div>
              </div>

              {/* Guest List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {guests.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No approved guests yet
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Guest Count
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Guest Name
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {guests.map((guest) => (
                            <tr key={guest._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {guest.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => copyIndividualItem(guest.email, `email-${guest._id}`)}
                                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left transition-colors"
                                  title="Click to copy"
                                >
                                  {copiedItem === `email-${guest._id}` ? (
                                    <span className="text-green-600 font-medium">✓ Copied!</span>
                                  ) : (
                                    guest.email
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => copyIndividualItem(guest.phone, `phone-${guest._id}`)}
                                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left transition-colors"
                                  title="Click to copy"
                                >
                                  {copiedItem === `phone-${guest._id}` ? (
                                    <span className="text-green-600 font-medium">✓ Copied!</span>
                                  ) : (
                                    guest.phone
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {guest.guests ? '2' : '1'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">
                                  {guest.guests ? guest.guestName || 'Not provided' : '-'}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-200">
                      {guests.map((guest) => (
                        <div key={guest._id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{guest.name}</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {guest.guests ? '2' : '1'} guest{guest.guests ? 's' : ''}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-start">
                              <span className="text-gray-500 w-16 shrink-0">Email:</span>
                              <button
                                onClick={() => copyIndividualItem(guest.email, `email-mobile-${guest._id}`)}
                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left break-all transition-colors"
                                title="Click to copy"
                              >
                                {copiedItem === `email-mobile-${guest._id}` ? (
                                  <span className="text-green-600 font-medium">✓ Copied!</span>
                                ) : (
                                  guest.email
                                )}
                              </button>
                            </div>
                            <div className="flex items-start">
                              <span className="text-gray-500 w-16 shrink-0">Phone:</span>
                              <button
                                onClick={() => copyIndividualItem(guest.phone, `phone-mobile-${guest._id}`)}
                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left transition-colors"
                                title="Click to copy"
                              >
                                {copiedItem === `phone-mobile-${guest._id}` ? (
                                  <span className="text-green-600 font-medium">✓ Copied!</span>
                                ) : (
                                  guest.phone
                                )}
                              </button>
                            </div>
                            {guest.guests && (
                              <div className="flex items-start">
                                <span className="text-gray-500 w-16 shrink-0">Guest:</span>
                                <span className="text-gray-900">{guest.guestName || 'Not provided'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </AdminLayout>
    </ProtectedPage>
  );
}
