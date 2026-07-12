import { Navigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

export default function AdminRoute({ children }) {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
