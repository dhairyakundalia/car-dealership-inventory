import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AuthContext } from '@/context/AuthContext'
import Navbar from './Navbar'

const baseAuth = {
  user: { email: 'user@test.com', role: 'ROLE_USER' },
  token: 'tok',
  isAdmin: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
}

const renderNav = (auth = baseAuth) => render(
  <MemoryRouter>
    <AuthContext.Provider value={auth}>
      <Navbar />
    </AuthContext.Provider>
  </MemoryRouter>
)

describe('Navbar', () => {
  it('shows app name and user email', () => {
    renderNav()
    expect(screen.getByText('CarDealership')).toBeInTheDocument()
    expect(screen.getByText('user@test.com')).toBeInTheDocument()
  })

  it('shows user badge for regular users', () => {
    renderNav()
    const badges = screen.getAllByText('User')
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  it('shows admin badge for admin users', () => {
    renderNav({ ...baseAuth, user: { email: 'admin@test.com', role: 'ROLE_ADMIN' }, isAdmin: true })
    const badges = screen.getAllByText('Admin')
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  it('calls logout on button click', async () => {
    const logout = vi.fn()
    const user = userEvent.setup()
    renderNav({ ...baseAuth, logout })
    await user.click(screen.getByRole('button', { name: /log out/i }))
    expect(logout).toHaveBeenCalled()
  })
})
