import { useState, useEffect } from 'react'
import { vehicleApi } from '@/api/vehicleApi'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

const emptyForm = { make: '', model: '', category: '', price: '', quantity: '' }

export default function AdminPage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const res = await vehicleApi.getAll()
      setVehicles(res.data)
    } catch {
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVehicles() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (v) => {
    setEditing(v)
    setForm({ make: v.make, model: v.model, category: v.category, price: String(v.price), quantity: String(v.quantity) })
    setDialogOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) }
    if (editing) {
      await vehicleApi.update(editing.id, payload)
    } else {
      await vehicleApi.create(payload)
    }
    setDialogOpen(false)
    fetchVehicles()
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this vehicle?')) {
      await vehicleApi.remove(id)
      fetchVehicles()
    }
  }

  const handleRestock = async (id) => {
    await vehicleApi.restock(id)
    fetchVehicles()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage vehicle inventory</p>
          </div>
          <Button onClick={openAdd}>Add Vehicle</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleSave}>
                <DialogHeader>
                  <DialogTitle>{editing ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
                  <DialogDescription>Fill in the vehicle details below.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input id="make" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input id="model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input id="quantity" type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editing ? 'Save' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-12">Loading...</p>
        ) : (
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.make}</TableCell>
                    <TableCell>{v.model}</TableCell>
                    <TableCell>{v.category}</TableCell>
                    <TableCell className="text-right">${v.price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{v.quantity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(v)}>Edit</Button>
                        <Button variant="outline" size="sm" onClick={() => handleRestock(v.id)}>Restock</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(v.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {vehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No vehicles found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  )
}
