import { createContext, useState, useEffect } from 'react'
import { authApi } from '@/api/authApi'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const login = async (email, password) => {
    setError(null)
    try {
      const { data } = await authApi.login(email, password)
      setUser({ email: data.email, role: data.role })
      setToken(data.token)
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      throw err
    }
  }

  const register = async (email, password) => {
    setError(null)
    try {
      const { data } = await authApi.register(email, password)
      setUser({ email: data.email, role: data.role })
      setToken(data.token)
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      setError(message)
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const value = { user, token, error, login, register, logout, isAdmin: user?.role === 'ROLE_ADMIN' }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
