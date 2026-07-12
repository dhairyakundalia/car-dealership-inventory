import { vehicleApi } from './vehicleApi'

vi.mock('@/lib/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

describe('vehicleApi', () => {
  it('has all required functions', () => {
    expect(typeof vehicleApi.getAll).toBe('function')
    expect(typeof vehicleApi.search).toBe('function')
    expect(typeof vehicleApi.getById).toBe('function')
    expect(typeof vehicleApi.create).toBe('function')
    expect(typeof vehicleApi.update).toBe('function')
    expect(typeof vehicleApi.remove).toBe('function')
    expect(typeof vehicleApi.purchase).toBe('function')
    expect(typeof vehicleApi.restock).toBe('function')
  })
})
