import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-bold text-lg tracking-tight">
          CarDealership
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end text-sm">
              <span className="font-medium leading-tight">{user?.email}</span>
            </div>
            <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-xs">
              {isAdmin ? 'Admin' : 'User'}
            </Badge>
          </div>

          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
            Log out
          </Button>
        </div>
      </div>
    </nav>
  )
}
