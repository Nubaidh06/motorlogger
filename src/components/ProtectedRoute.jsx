import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// redirects to login page if the user is not authenticated
export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  return children
}
