import { render, screen } from '@testing-library/react'
import { VehicleCard } from './VehicleCard'

const vehicle = {
  id: '1',
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: 25000,
  quantity: 5,
}

describe('VehicleCard', () => {
  it('renders vehicle info', () => {
    render(<VehicleCard vehicle={vehicle} />)
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    expect(screen.getByText('Sedan')).toBeInTheDocument()
    expect(screen.getByText(/\$25,000/)).toBeInTheDocument()
    expect(screen.getByText('5 in stock')).toBeInTheDocument()
  })

  it('enables purchase button when in stock', () => {
    render(<VehicleCard vehicle={vehicle} />)
    expect(screen.getByRole('button', { name: /purchase/i })).not.toBeDisabled()
  })

  it('disables purchase button when out of stock', () => {
    render(<VehicleCard vehicle={{ ...vehicle, quantity: 0 }} />)
    expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled()
  })
})
