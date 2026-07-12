import api from '@/lib/axiosInstance'

export const authApi = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (email, password) => api.post('/api/auth/register', { email, password }),
}
