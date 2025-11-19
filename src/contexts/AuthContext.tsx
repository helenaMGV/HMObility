import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos de roles disponibles
export type UserRole = 'ciudadano' | 'gobierno' | 'superadmin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // Para desarrollo/demo
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios mock para simulación
const MOCK_USERS: Record<string, User> = {
  'admin@hmobility.mx': {
    id: '1',
    name: 'Super Administrador',
    email: 'admin@hmobility.mx',
    role: 'superadmin',
  },
  'gob@hmobility.mx': {
    id: '2',
    name: 'Gobierno Hermosillo',
    email: 'gob@hmobility.mx',
    role: 'gobierno',
  },
  'ciudadano@hmobility.mx': {
    id: '3',
    name: 'Usuario Ciudadano',
    email: 'ciudadano@hmobility.mx',
    role: 'ciudadano',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Cargar sesión desde localStorage al montar
  useEffect(() => {
    const storedUser = localStorage.getItem('hmobility_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('hmobility_user');
      }
    }
  }, []);

  // Guardar sesión en localStorage cuando cambia
  useEffect(() => {
    if (user) {
      localStorage.setItem('hmobility_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hmobility_user');
    }
  }, [user]);

  const login = async (email: string, _password: string) => {
    // Simulación: cualquier password funciona para usuarios mock
    const mockUser = MOCK_USERS[email];
    
    if (mockUser) {
      setUser(mockUser);
    } else {
      // Si no existe, crear usuario ciudadano genérico
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        role: 'ciudadano',
      };
      setUser(newUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Función de desarrollo para cambiar roles sin re-login
  const switchRole = (newRole: UserRole) => {
    if (user && newRole) {
      setUser({ ...user, role: newRole });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook de conveniencia para verificar roles
export function useRole() {
  const { role, user } = useAuth();
  
  return {
    role,
    isCiudadano: role === 'ciudadano',
    isGobierno: role === 'gobierno',
    isSuperAdmin: role === 'superadmin',
    isAuthenticated: !!user,
  };
}
