import { LogIn, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export function LoginButton() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden md:inline">{user.name}</span>
            <Badge variant="outline" className="ml-1 text-xs">
              {user.role}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 w-4 h-4" />
            Mi Panel
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              logout();
              navigate('/');
            }} 
            className="text-red-600"
          >
            <LogOut className="mr-2 w-4 h-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      asChild
      variant="outline" 
      className="gap-2"
    >
      <Link to="/login">
        <LogIn className="w-4 h-4" />
        <span className="hidden md:inline">Iniciar Sesión</span>
      </Link>
    </Button>
  );
}
