import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '@/context/AuthContext'
import LoginPage from './LoginPage'

vi.mock('@/api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  }
}))

const renderPage = () => render(
  <MemoryRouter>
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  </MemoryRouter>
)

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    renderPage()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders sign in button and register link', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/register/i)).toHaveAttribute('href', '/register')
  })

  it('shows error when login fails', async () => {
    const { authApi } = await import('@/api/authApi')
    authApi.login.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } })

    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
  })
})
