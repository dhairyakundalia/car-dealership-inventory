import { renderHook, act } from '@testing-library/react'
import { AuthProvider, AuthContext } from './AuthContext'
import { useContext } from 'react'

vi.mock('@/api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  }
}))

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('provides default state', () => {
    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAdmin).toBe(false)
  })

  it('restores state from localStorage', () => {
    localStorage.setItem('token', 'test-token')
    localStorage.setItem('user', JSON.stringify({ email: 'a@b.com', role: 'ROLE_USER' }))

    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    expect(result.current.token).toBe('test-token')
    expect(result.current.user.email).toBe('a@b.com')
  })

  it('clears state on logout', () => {
    localStorage.setItem('token', 'test-token')
    localStorage.setItem('user', JSON.stringify({ email: 'a@b.com', role: 'ROLE_USER' }))

    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    act(() => result.current.logout())
    expect(result.current.token).toBeNull()
    expect(result.current.user).toBeNull()
  })

  it('detects admin role', () => {
    localStorage.setItem('token', 'admin-token')
    localStorage.setItem('user', JSON.stringify({ email: 'admin@c.com', role: 'ROLE_ADMIN' }))

    const { result } = renderHook(() => useContext(AuthContext), { wrapper })
    expect(result.current.isAdmin).toBe(true)
  })
})
