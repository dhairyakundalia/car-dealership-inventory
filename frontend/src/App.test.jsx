import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AuthContext } from '@/context/AuthContext'
import App from './App'

const renderApp = (authValue) => render(
  <AuthContext.Provider value={authValue}>
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  </AuthContext.Provider>
)

describe('App routing', () => {
  const authValue = {
    user: null,
    token: null,
    isAdmin: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }

  it('redirects to login when unauthenticated', () => {
    renderApp(authValue)
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument()
  })
})
