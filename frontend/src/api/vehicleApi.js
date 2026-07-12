import api from '@/lib/axiosInstance'

export const vehicleApi = {
  getAll: () => api.get('/api/vehicles'),
  search: (params) => api.get('/api/vehicles/search', { params }),
  getById: (id) => api.get(`/api/vehicles/${id}`),
  create: (data) => api.post('/api/vehicles', data),
  update: (id, data) => api.put(`/api/vehicles/${id}`, data),
  remove: (id) => api.delete(`/api/vehicles/${id}`),
  purchase: (id) => api.post(`/api/vehicles/${id}/purchase`),
  restock: (id) => api.post(`/api/vehicles/${id}/restock`),
}
