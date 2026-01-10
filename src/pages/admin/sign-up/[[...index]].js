import { SignUp } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminSignUp() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoaded && userId) {
      router.push('/admin');
    }
  }, [isLoaded, userId, router]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect in progress
  if (userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join the Wedding App admin panel</p>
        </div>

        {/* Clerk SignUp Component */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SignUp
            path="/admin/sign-up"
            routing="path"
            signInUrl="/admin/login"
            forceRedirectUrl="/admin"
          />
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Already have an account?</p>
          <Link
            href="/admin/login"
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            Sign in instead
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Protected by Clerk Authentication</p>
        </div>
      </div>
    </div>
  );
}
