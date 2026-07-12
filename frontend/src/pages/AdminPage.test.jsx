import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AuthContext } from '@/context/AuthContext'
import AdminPage from './AdminPage'

vi.mock('@/api/authApi', () => ({ authApi: {} }))
vi.mock('@/api/vehicleApi', () => ({
  vehicleApi: {
    getAll: vi.fn().mockResolvedValue({
      data: [
        { id: '1', make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 },
      ]
    }),
    remove: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    restock: vi.fn(),
  }
}))

const authValue = {
  user: { email: 'admin@c.com', role: 'ROLE_ADMIN' },
  token: 'tok', isAdmin: true,
  login: vi.fn(), register: vi.fn(), logout: vi.fn(),
}

describe('AdminPage', () => {
  it('renders vehicle table with add button', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <AdminPage />
        </AuthContext.Provider>
      </MemoryRouter>
    )
    expect(await screen.findByText('Toyota')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add vehicle/i })).toBeInTheDocument()
  })

  it('opens add vehicle dialog on button click', async () => {
    const user = (await import('@testing-library/user-event')).default
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <AdminPage />
        </AuthContext.Provider>
      </MemoryRouter>
    )
    await screen.findByText('Toyota')
    await user.click(screen.getByRole('button', { name: /add vehicle/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
