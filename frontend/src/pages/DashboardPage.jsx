import { useState, useEffect, useCallback } from 'react'
import { vehicleApi } from '@/api/vehicleApi'
import { VehicleCard } from '@/components/VehicleCard'
import { SearchBar } from '@/components/SearchBar'
import Navbar from '@/components/Navbar'

export default function DashboardPage() {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1">Browse and purchase available vehicles</p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={fetchVehicles} />
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-12">Loading vehicles...</p>
        ) : vehicles.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No vehicles found.</p>
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
