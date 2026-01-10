import { SignOutButton } from '@clerk/nextjs';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedPage from '@/components/admin/ProtectedPage';

export default function AdminDashboard() {
  return (
    <ProtectedPage>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Welcome to the Wedding Admin Panel</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Guests</h3>
              <p className="mt-2 text-3xl font-bold text-rose-600">0</p>
              <p className="mt-1 text-sm text-gray-500">Total invited</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">RSVPs</h3>
              <p className="mt-2 text-3xl font-bold text-rose-600">0</p>
              <p className="mt-1 text-sm text-gray-500">Responses received</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Events</h3>
              <p className="mt-2 text-3xl font-bold text-rose-600">0</p>
              <p className="mt-1 text-sm text-gray-500">Scheduled</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
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
