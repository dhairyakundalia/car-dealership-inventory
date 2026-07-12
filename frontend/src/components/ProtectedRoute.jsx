import { Navigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}
