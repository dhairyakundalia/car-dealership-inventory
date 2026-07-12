import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { vehicleApi } from '@/api/vehicleApi'
import { VehicleCard } from '@/components/VehicleCard'
import { SearchBar } from '@/components/SearchBar'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'

export default function DashboardPage() {
  const { isAdmin } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchVehicles = useCallback(async (filters = {}) => {
    setLoading(true)
    try {
      const hasFilters = filters.make || filters.model || filters.category
      const res = hasFilters
        ? await vehicleApi.search(filters)
        : await vehicleApi.getAll()
      setVehicles(res.data)
    } catch {
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchVehicles() }, [fetchVehicles])

  const handlePurchase = async (id) => {
    try {
      await vehicleApi.purchase(id)
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, quantity: v.quantity - 1 } : v
        )
      )
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
            <p className="text-muted-foreground mt-1">Browse and purchase available vehicles</p>
          </div>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline">Admin Panel</Button>
            </Link>
          )}
        </div>

        <div className="mb-8">
          <SearchBar onSearch={fetchVehicles} />
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border bg-card p-6 space-y-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-32 rounded bg-muted" />
                    <div className="h-4 w-20 rounded bg-muted" />
                  </div>
                  <div className="h-6 w-24 rounded-full bg-muted" />
                </div>
                <div className="h-8 w-28 rounded bg-muted" />
                <div className="h-10 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3 text-muted-foreground/40">&#x1F50D;</p>
            <p className="text-lg font-medium text-muted-foreground">No vehicles found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your search or add a new vehicle.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} onPurchase={handlePurchase} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
