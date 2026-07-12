import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '@/context/AuthContext'
import RegisterPage from './RegisterPage'

vi.mock('@/api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  }
}))

const renderPage = () => render(
  <MemoryRouter>
    <AuthProvider>
      <RegisterPage />
    </AuthProvider>
  </MemoryRouter>
)

describe('RegisterPage', () => {
  it('renders all form fields', () => {
    renderPage()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('renders create account button and login link', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByText(/sign in/i)).toHaveAttribute('href', '/login')
  })

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/^password$/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'different')
    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
  })

  it('shows error when password is too short', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/^password$/i), 'short')
    await user.type(screen.getByLabelText(/confirm password/i), 'short')
    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
  })
})
