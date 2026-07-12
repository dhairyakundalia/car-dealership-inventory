import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders all filter inputs', () => {
    render(<SearchBar onSearch={vi.fn()} />)
    expect(screen.getByText('Make')).toBeInTheDocument()
    expect(screen.getByText('Model')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
  })

  it('calls onSearch with filter values on submit', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchBar onSearch={onSearch} />)

    await user.type(screen.getByPlaceholderText(/toyota/i), 'Toyota')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(onSearch).toHaveBeenCalledWith({ make: 'Toyota', model: '', category: '' })
  })

  it('clears filters on clear button', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchBar onSearch={onSearch} />)

    const makeInput = screen.getByPlaceholderText(/toyota/i)
    await user.type(makeInput, 'Toyota')
    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(onSearch).toHaveBeenCalledWith({ make: '', model: '', category: '' })
  })
})
