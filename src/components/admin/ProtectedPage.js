/**
 * ============================================================================
 * FILE: ProtectedPage.js
 * LOCATION: src/components/admin/ProtectedPage.js
 * PURPOSE: Authentication wrapper that protects admin pages from unauthorized access
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component wraps admin pages to ensure only logged-in users can access them.
 * It handles three scenarios:
 * 1. Loading: Shows a spinner while Clerk checks authentication status
 * 2. Not authenticated: Redirects user to /admin/login
 * 3. Authenticated: Renders the protected page content
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - @clerk/nextjs: useAuth hook to check if user is logged in
 * - next/router: useRouter hook to redirect unauthenticated users
 * - react: useEffect hook to trigger redirect when auth status changes
 * 
 * Related Files:
 * - src/pages/admin/login/[[...index]].js: Where users are redirected if not logged in
 * - src/components/admin/AdminLayout.js: Often used together with this component
 * - src/pages/_app.js: Contains ClerkProvider that makes useAuth work
 * 
 * USAGE:
 * ======
 * import ProtectedPage from '@/components/admin/ProtectedPage';
 * 
 * export default function AdminPage() {
 *   return (
 *     <ProtectedPage>
 *       <h1>This content is only visible to logged-in users</h1>
 *     </ProtectedPage>
 *   );
 * }
 * 
 * ============================================================================
 */

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AccessDeniedMessage from './AccessDeniedMessage';

/**
 * WHITELIST
 * 
 * Array of approved email addresses that have access to admin pages.
 * Only users with emails in this list can access protected content.
 * 
 * To add a new admin:
 * 1. Add their email address to this array
 * 2. Ensure they have a Clerk account with that email
 */
const WHITELIST = [
  'christan.price2010@gmail.com',
  'designsbyjmj@gmail.com'
  // Add more approved emails here
];

/**
 * PROTECTEDPAGE COMPONENT
 * 
 * Wrapper component that checks authentication AND whitelist before rendering children.
 * 
 * Now performs two checks:
 * 1. Is the user logged in? (authentication)
 * 2. Is the user's email on the whitelist? (authorization)
 * 
 * @param {ReactNode} children - The protected content to render if authenticated and authorized
 */
export default function ProtectedPage({ children }) {
  // ========== GET AUTH STATUS AND USER INFO ==========
  // isLoaded: true when Clerk has finished checking authentication
  // userId: the logged-in user's ID, or null if not logged in
  const { isLoaded, userId } = useAuth();
  
  // Get user information including email
  // user.primaryEmailAddress.emailAddress contains the user's email
  const { user } = useUser();
  
  // Router for redirecting unauthenticated users
  const router = useRouter();

  // ========== REDIRECT IF NOT AUTHENTICATED ==========
  // This effect runs when auth status changes
  // If user is not logged in, redirect to login page
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/admin/login');
    }
  }, [isLoaded, userId, router]);

  // ========== LOADING STATE ==========
  // Show spinner while Clerk is checking authentication
  // This prevents a flash of content before redirect
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ========== NOT AUTHENTICATED ==========
  // Return null while redirect is in progress
  // This prevents showing protected content briefly
  if (!userId) {
    return null;
  }

  // ========== CHECK WHITELIST ==========
  // User is authenticated, now check if they're on the whitelist
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isWhitelisted = userEmail && WHITELIST.includes(userEmail.toLowerCase());
  
  // If user is not on whitelist, show access denied message
  if (!isWhitelisted) {
    return (
      <AccessDeniedMessage
        title="Access Denied"
        message="Your account does not have permission to access this admin page. Please contact the administrator if you believe this is an error."
        contactEmail="christan.price2010@gmail.com"
      />
    );
  }

  // ========== AUTHENTICATED AND AUTHORIZED ==========
  // User is logged in AND on the whitelist, render the protected content
  return <>{children}</>;
}
