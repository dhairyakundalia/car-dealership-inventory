import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function VehicleCard({ vehicle, onPurchase }) {
  const outOfStock = vehicle.quantity === 0

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{vehicle.make} {vehicle.model}</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">{vehicle.category}</p>
          </div>
          <Badge variant={outOfStock ? 'destructive' : 'secondary'} className="shrink-0">
            {outOfStock ? 'Out of Stock' : `${vehicle.quantity} in stock`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-2xl font-bold tracking-tight text-primary">
          ${vehicle.price.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="relative">
        <Button
          className="w-full"
          variant={outOfStock ? 'outline' : 'default'}
          disabled={outOfStock}
          onClick={() => onPurchase?.(vehicle.id)}
        >
          {outOfStock ? 'Out of Stock' : 'Purchase'}
        </Button>
      </CardFooter>
    </Card>
  )
}
