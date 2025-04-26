import { useAuthUser } from '../stores/authStore'

export const DashboardPage = () => {
  const user = useAuthUser()
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900">Welcome to your Dashboard</h2>
      <p className="mt-1 text-sm text-gray-600">
        Logged in as: {user?.email}
      </p>
    </div>
  )
}