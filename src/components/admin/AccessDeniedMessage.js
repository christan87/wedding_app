/**
 * ============================================================================
 * FILE: AccessDeniedMessage.js
 * LOCATION: src/components/admin/AccessDeniedMessage.js
 * PURPOSE: Display access denied message for unauthorized users
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays a user-friendly access denied message when a logged-in
 * user tries to access a protected admin page but is not on the whitelist.
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - next/image: For displaying images
 * 
 * USED BY:
 * ========
 * - src/components/admin/ProtectedPage.js
 *   Shows this component when user is authenticated but not whitelisted
 * 
 * USAGE:
 * ======
 * import AccessDeniedMessage from '@/components/admin/AccessDeniedMessage';
 * 
 * <AccessDeniedMessage
 *   title="Access Denied"
 *   message="You don't have permission to access this page."
 *   contactEmail="admin@example.com"
 * />
 * 
 * ============================================================================
 */

import Image from 'next/image';

/**
 * ACCESS DENIED MESSAGE COMPONENT
 * 
 * Displays a styled access denied message with customizable text.
 * 
 * @param {string} title - Main heading text (e.g., "Access Denied")
 * @param {string} message - Detailed explanation message
 * @param {string} contactEmail - Email address for users to request access
 * @param {string} iconPath - Optional path to icon image
 */
export default function AccessDeniedMessage({ 
  title = "Access Denied",
  message = "You don't have permission to access this page.",
  contactEmail = "admin@example.com",
  iconPath = "/images/icons/heart.png"
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {title}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* Contact Information */}
        {contactEmail && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              Need access to this page?
            </p>
            <p className="text-sm text-gray-600">
              Contact us at{' '}
              <a 
                href={`mailto:${contactEmail}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {contactEmail}
              </a>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
