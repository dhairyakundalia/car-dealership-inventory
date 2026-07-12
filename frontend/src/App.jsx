import { Routes, Route } from 'react-router'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><div className="p-8"><h1 className="text-2xl font-bold">Car Dealership Inventory</h1></div></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  )
}
