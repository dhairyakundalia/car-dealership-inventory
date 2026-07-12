import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchBar({ onSearch }) {
  const [filters, setFilters] = useState({ make: '', model: '', category: '' })
  const prevFilters = useRef(filters)

  const isEmpty = !filters.make && !filters.model && !filters.category

  useEffect(() => {
    const prev = prevFilters.current
    const prevEmpty = !prev.make && !prev.model && !prev.category
    if (!prevEmpty && isEmpty) {
      onSearch({ make: '', model: '', category: '' })
    }
    prevFilters.current = filters
  }, [filters, onSearch, isEmpty])

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
    <div className="rounded-2xl border bg-card/80 p-4 shadow-sm">
      <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Make</label>
          <Input
            placeholder="e.g. Toyota"
            value={filters.make}
            onChange={handleChange('make')}
            className="h-9 bg-white/70 dark:bg-white/5 border-border/60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Model</label>
          <Input
            placeholder="e.g. Camry"
            value={filters.model}
            onChange={handleChange('model')}
            className="h-9 bg-white/70 dark:bg-white/5 border-border/60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Category</label>
          <Input
            placeholder="e.g. Sedan"
            value={filters.category}
            onChange={handleChange('category')}
            className="h-9 bg-white/70 dark:bg-white/5 border-border/60"
          />
        </div>
        <Button type="submit" size="sm" className="h-9">Search</Button>
        {!isEmpty && (
          <Button type="button" variant="outline" size="sm" className="h-9" onClick={handleClear}>
            Clear
          </Button>
        )}
      </form>
    </div>
  )
}
