import { Navigate } from 'react-router-dom'
import { useAuthUser } from '../stores/authStore'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthUser()
  
  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}