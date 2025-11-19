import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import logoSrc from '@/assets/logo_hmobility.png';

const MOCK_USERS = {
  'admin@hmobility.mx': { email: 'admin@hmobility.mx', role: 'superadmin' },
  'gob@hmobility.mx': { email: 'gob@hmobility.mx', role: 'gobierno' },
  'ciudadano@hmobility.mx': { email: 'ciudadano@hmobility.mx', role: 'ciudadano' },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleLogin = async (selectedRole: string) => {
    const userEmail = selectedRole === 'superadmin' 
      ? 'admin@hmobility.mx' 
      : selectedRole === 'gobierno'
      ? 'gob@hmobility.mx'
      : 'ciudadano@hmobility.mx';
    
    setIsLoading(true);
    try {
      await login(userEmail, 'password');
      // Navigate based on role
      if (selectedRole === 'superadmin') {
        navigate('/admin');
      } else if (selectedRole === 'gobierno') {
        navigate('/gobierno');
      } else {
        navigate('/mi-panel');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: 'superadmin',
      name: 'Super Administrador',
      email: 'admin@hmobility.mx',
      description: 'Acceso completo al sistema. Gestión de inventario, campañas y configuración.',
      icon: Shield,
      gradient: 'from-accent to-accent/80',
      textColor: 'text-accent-foreground',
      bgColor: 'bg-accent/10 hover:bg-accent/20',
    },
    {
      id: 'gobierno',
      name: 'Gobierno',
      email: 'gob@hmobility.mx',
      description: 'Dashboard profesional con análisis de movilidad, accidentes y operaciones.',
      icon: Building2,
      gradient: 'from-secondary to-secondary/80',
      textColor: 'text-secondary-foreground',
      bgColor: 'bg-secondary/10 hover:bg-secondary/20',
    },
    {
      id: 'ciudadano',
      name: 'Ciudadano',
      email: 'ciudadano@hmobility.mx',
      description: 'Portal público. Consulta el mapa, reporta incidentes y aprende sobre seguridad vial.',
      icon: Users,
      gradient: 'from-primary to-primary/80',
      textColor: 'text-primary',
      bgColor: 'bg-primary/10 hover:bg-primary/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src={logoSrc} alt="HMObility" className="h-20 w-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-secondary">
            HMObility Safe Streets
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sistema Operativo de Movilidad Urbana para Hermosillo
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
              >
                {/* Gradient background decoration */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${role.gradient}`} />
                
                <CardHeader className="pt-6">
                  <div className={`w-16 h-16 rounded-2xl ${role.bgColor} flex items-center justify-center mb-4 transition-colors`}>
                    <Icon className={`w-8 h-8 ${role.textColor}`} />
                  </div>
                  <CardTitle className="text-xl">{role.name}</CardTitle>
                  <CardDescription className="text-sm min-h-[3rem]">
                    {role.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Credencial de acceso:</p>
                    <p className="text-sm font-mono font-semibold">{role.email}</p>
                  </div>

                  <Button
                    onClick={() => handleRoleLogin(role.id)}
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r ${role.gradient} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar como ' + role.name}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Demo sin autenticación real • Los datos se guardan localmente
          </p>
          <Button
            variant="link"
            onClick={() => navigate('/')}
            className="mt-2"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
