import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchBar({ onSearch }) {
  const [filters, setFilters] = useState({ make: '', model: '', category: '' })

  const handleChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(filters)
  }

  const handleClear = () => {
    const cleared = { make: '', model: '', category: '' }
    setFilters(cleared)
    onSearch(cleared)
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Make</label>
        <Input
          placeholder="Make"
          value={filters.make}
          onChange={handleChange('make')}
          className="h-9"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Model</label>
        <Input
          placeholder="Model"
          value={filters.model}
          onChange={handleChange('model')}
          className="h-9"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Category</label>
        <Input
          placeholder="Category"
          value={filters.category}
          onChange={handleChange('category')}
          className="h-9"
        />
      </div>
      <Button type="submit" size="sm" className="h-9">Search</Button>
      <Button type="button" variant="outline" size="sm" className="h-9" onClick={handleClear}>
        Clear
      </Button>
    </form>
  )
}
