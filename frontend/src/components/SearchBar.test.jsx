import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders all filter inputs', () => {
    render(<SearchBar onSearch={vi.fn()} />)
    expect(screen.getByPlaceholderText(/make/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/model/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/category/i)).toBeInTheDocument()
  })

  it('calls onSearch with filter values on submit', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchBar onSearch={onSearch} />)

    await user.type(screen.getByPlaceholderText(/make/i), 'Toyota')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(onSearch).toHaveBeenCalledWith({ make: 'Toyota', model: '', category: '' })
  })

  it('clears filters on clear button', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchBar onSearch={onSearch} />)

    await user.type(screen.getByPlaceholderText(/make/i), 'Toyota')
    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(onSearch).toHaveBeenCalledWith({ make: '', model: '', category: '' })
  })
})
