import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { AuthProvider, AuthContext } from '@/context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

const renderProtected = (token, initialRoute = '/') => {
  const authValue = {
    user: token ? { email: 'a@b.com', role: 'ROLE_USER' } : null,
    token,
    isAdmin: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }

  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthContext.Provider value={authValue}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={<ProtectedRoute><div>Dashboard</div></ProtectedRoute>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('renders children when authenticated', () => {
    renderProtected('valid-token')
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  it('redirects to login when unauthenticated', () => {
    renderProtected(null)
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })
})
