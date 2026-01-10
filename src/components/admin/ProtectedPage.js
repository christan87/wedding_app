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

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * PROTECTEDPAGE COMPONENT
 * 
 * Wrapper component that checks authentication before rendering children.
 * 
 * @param {ReactNode} children - The protected content to render if authenticated
 */
export default function ProtectedPage({ children }) {
  // ========== GET AUTH STATUS ==========
  // isLoaded: true when Clerk has finished checking authentication
  // userId: the logged-in user's ID, or null if not logged in
  const { isLoaded, userId } = useAuth();
  
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

  // ========== AUTHENTICATED ==========
  // User is logged in, render the protected content
  return <>{children}</>;
}
