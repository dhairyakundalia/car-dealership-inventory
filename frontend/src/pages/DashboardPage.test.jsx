import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AuthContext } from '@/context/AuthContext'
import DashboardPage from './DashboardPage'

vi.mock('@/api/authApi', () => ({ authApi: {} }))
vi.mock('@/api/vehicleApi', () => ({
  vehicleApi: {
    getAll: vi.fn().mockResolvedValue({
      data: [
        { id: '1', make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 },
        { id: '2', make: 'Honda', model: 'Accord', category: 'Sedan', price: 28000, quantity: 0 },
      ]
    }),
    search: vi.fn(),
    purchase: vi.fn(),
  }
}))

const authValue = {
  user: { email: 'u@t.com', role: 'ROLE_USER' },
  token: 'tok',
  isAdmin: false,
  login: vi.fn(), register: vi.fn(), logout: vi.fn(),
}

describe('DashboardPage', () => {
  it('renders heading and vehicle count', async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <DashboardPage />
        </AuthContext.Provider>
      </MemoryRouter>
    )
    expect(await screen.findByText(/toyota camry/i)).toBeInTheDocument()
    expect(screen.getByText(/honda accord/i)).toBeInTheDocument()
  })
})
