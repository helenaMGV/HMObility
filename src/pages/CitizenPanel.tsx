import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  FileText,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  MessageSquare,
  ThumbsUp,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Reporte {
  id: string;
  tipo: string;
  ubicacion: string;
  colonia: string;
  descripcion: string;
  estatus: 'pendiente' | 'en_revision' | 'resuelto';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  fecha: string;
  votos: number;
  comentarios: number;
}

export default function CitizenPanel() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState('mis-reportes');

  useEffect(() => {
    if (!user || role !== 'ciudadano') {
      navigate('/login');
    }
  }, [user, role, navigate]);

  if (!user || role !== 'ciudadano') {
    return null;
  }

  // Mock data - reportes del usuario
  const misReportes: Reporte[] = [
    {
      id: 'RPT_USR_001',
      tipo: 'bache',
      ubicacion: 'Blvd. Colosio y Morelos',
      colonia: 'Villa de Seris',
      descripcion: 'Bache grande en carril derecho que causa daños a vehículos',
      estatus: 'en_revision',
      prioridad: 'alta',
      fecha: '2025-11-15',
      votos: 23,
      comentarios: 5,
    },
    {
      id: 'RPT_USR_002',
      tipo: 'señal_oculta',
      ubicacion: 'Calle Rosales y Guerrero',
      colonia: 'Pitic',
      descripcion: 'Señal de alto cubierta por árbol, dificulta visibilidad',
      estatus: 'resuelto',
      prioridad: 'media',
      fecha: '2025-11-10',
      votos: 15,
      comentarios: 3,
    },
    {
      id: 'RPT_USR_003',
      tipo: 'iluminacion',
      ubicacion: 'Av. Solidaridad entre Blvd. Colosio y Morelos',
      colonia: 'Sahuaro',
      descripcion: 'Poste de luz apagado, zona oscura peligrosa por las noches',
      estatus: 'pendiente',
      prioridad: 'alta',
      fecha: '2025-11-17',
      votos: 8,
      comentarios: 2,
    },
    {
      id: 'RPT_USR_004',
      tipo: 'falta_paso_peatonal',
      ubicacion: 'Blvd. Luis Encinas frente a Plaza Zaragoza',
      colonia: 'Centro',
      descripcion: 'Falta paso peatonal en zona de alto tráfico peatonal',
      estatus: 'en_revision',
      prioridad: 'critica',
      fecha: '2025-11-12',
      votos: 34,
      comentarios: 8,
    },
    {
      id: 'RPT_USR_005',
      tipo: 'banqueta_dañada',
      ubicacion: 'Calle Universidad esquina con Reforma',
      colonia: 'Bachoco',
      descripcion: 'Banqueta hundida y rota, peligro para peatones',
      estatus: 'resuelto',
      prioridad: 'media',
      fecha: '2025-10-28',
      votos: 19,
      comentarios: 4,
    },
  ];

  const menuItems = [
    { id: 'mis-reportes', label: 'Mis Reportes', icon: FileText },
    { id: 'estadisticas', label: 'Mi Participación', icon: TrendingUp },
    { id: 'historial', label: 'Historial', icon: Calendar },
  ];

  const getEstatusConfig = (estatus: string) => {
    switch (estatus) {
      case 'pendiente':
        return { variant: 'secondary' as const, className: 'bg-muted text-muted-foreground' };
      case 'en_revision':
        return { variant: 'default' as const, className: 'bg-secondary/10 text-secondary-foreground' };
      case 'resuelto':
        return { variant: 'default' as const, className: 'bg-primary/10 text-primary' };
      default:
        return { variant: 'outline' as const, className: '' };
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'text-destructive';
      case 'alta': return 'text-accent-foreground';
      case 'media': return 'text-secondary-foreground';
      case 'baja': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const totalReportes = misReportes.length;
  const resueltos = misReportes.filter(r => r.estatus === 'resuelto').length;
  const enRevision = misReportes.filter(r => r.estatus === 'en_revision').length;
  const pendientes = misReportes.filter(r => r.estatus === 'pendiente').length;
  const totalVotos = misReportes.reduce((sum, r) => sum + r.votos, 0);
  const impacto = Math.round((resueltos / totalReportes) * 100);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-card border-r transition-all duration-300 hidden md:flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">Mi Panel</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 p-2">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="flex-1 text-left text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t space-y-2">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Cuenta</p>
              <p className="text-sm font-semibold truncate">{user.name}</p>
            </div>
          )}
          <Button
            variant="default"
            size={sidebarOpen ? 'default' : 'icon'}
            onClick={() => navigate('/')}
            className="w-full"
          >
            {sidebarOpen ? '← Volver a Inicio' : <ChevronLeft className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size={sidebarOpen ? 'default' : 'icon'}
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full"
          >
            {sidebarOpen ? 'Cerrar Sesión' : <X className="w-4 h-4" />}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {menuItems.find(m => m.id === activeModule)?.label || 'Panel Ciudadano'}
              </h1>
              <p className="text-sm text-muted-foreground">Tu contribución a la movilidad segura</p>
            </div>
          </div>
          <Badge variant="outline">{user.role}</Badge>
        </header>

        <ScrollArea className="flex-1 p-6">
          {/* Mis Reportes */}
          {activeModule === 'mis-reportes' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Reportes Totales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalReportes}</div>
                    <p className="text-xs text-muted-foreground">Contribuciones</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Resueltos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{resueltos}</div>
                    <p className="text-xs text-primary">{impacto}% de impacto</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>En Revisión</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-secondary-foreground">{enRevision}</div>
                    <p className="text-xs text-muted-foreground">En proceso</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Votos Recibidos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalVotos}</div>
                    <p className="text-xs text-muted-foreground">Apoyo comunitario</p>
                  </CardContent>
                </Card>
              </div>

              {/* Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Todos Mis Reportes</CardTitle>
                      <CardDescription>Historial completo de reportes enviados</CardDescription>
                    </div>
                    <Button onClick={() => navigate('/reportes')}>
                      Nuevo Reporte
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estatus</TableHead>
                        <TableHead>Prioridad</TableHead>
                        <TableHead className="text-right">Apoyo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {misReportes.map((reporte) => {
                        const estatusConfig = getEstatusConfig(reporte.estatus);
                        return (
                          <TableRow key={reporte.id}>
                            <TableCell className="font-mono text-xs">{reporte.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm capitalize">{reporte.tipo.replace(/_/g, ' ')}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              <p className="text-sm font-medium line-clamp-1">{reporte.ubicacion}</p>
                              <p className="text-xs text-muted-foreground">{reporte.colonia}</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {new Date(reporte.fecha).toLocaleDateString('es-MX', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={estatusConfig.variant} className={estatusConfig.className}>
                                {reporte.estatus.replace(/_/g, ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={`text-sm font-medium capitalize ${getPrioridadColor(reporte.prioridad)}`}>
                                {reporte.prioridad}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-3 text-sm">
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="w-3 h-3" />
                                  {reporte.votos}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  {reporte.comentarios}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mi Participación */}
          {activeModule === 'estadisticas' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Impacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tasa de resolución</p>
                      <div className="text-4xl font-bold text-primary">{impacto}%</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Problemas resueltos</p>
                      <div className="text-2xl font-bold">{resueltos} de {totalReportes}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tiempo promedio</p>
                      <div className="text-2xl font-bold">8 días</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5" />
                      Apoyo Comunitario
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total de votos</p>
                      <div className="text-4xl font-bold">{totalVotos}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Promedio por reporte</p>
                      <div className="text-2xl font-bold">{Math.round(totalVotos / totalReportes)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Reporte más apoyado</p>
                      <div className="text-2xl font-bold">34 votos</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Categorías
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { tipo: 'Baches', cantidad: 1 },
                      { tipo: 'Iluminación', cantidad: 1 },
                      { tipo: 'Señalización', cantidad: 1 },
                      { tipo: 'Pasos peatonales', cantidad: 1 },
                      { tipo: 'Banquetas', cantidad: 1 },
                    ].map((categoria) => (
                      <div key={categoria.tipo} className="flex items-center justify-between">
                        <span className="text-sm">{categoria.tipo}</span>
                        <Badge variant="outline">{categoria.cantidad}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tu Contribución</CardTitle>
                  <CardDescription>Gracias por ayudar a mejorar la movilidad en Hermosillo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Has reportado <strong>{totalReportes} problemas</strong> en la ciudad, 
                      generando <strong>{totalVotos} votos</strong> de apoyo de la comunidad.
                    </p>
                    <p className="text-sm">
                      <strong>{resueltos} de tus reportes</strong> ya han sido atendidos por las autoridades, 
                      lo que representa un <strong>{impacto}% de efectividad</strong> en tus contribuciones.
                    </p>
                    <div className="pt-4 border-t">
                      <p className="text-sm font-semibold mb-2">Sigue participando:</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>✓ Reporta problemas con fotos y ubicación exacta</li>
                        <li>✓ Apoya reportes de otros ciudadanos</li>
                        <li>✓ Comenta y sugiere soluciones</li>
                        <li>✓ Comparte reportes resueltos en redes sociales</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Historial */}
          {activeModule === 'historial' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timeline de Actividad
                </CardTitle>
                <CardDescription>Cronología de tus reportes y actualizaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {misReportes.map((reporte, index) => (
                    <div key={reporte.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          reporte.estatus === 'resuelto' ? 'bg-primary' : 
                          reporte.estatus === 'en_revision' ? 'bg-secondary' : 
                          'bg-muted'
                        }`} />
                        {index < misReportes.length - 1 && (
                          <div className="w-0.5 h-full bg-border my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold">{reporte.tipo.replace(/_/g, ' ')}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(reporte.fecha).toLocaleDateString('es-MX', { 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{reporte.ubicacion}, {reporte.colonia}</p>
                        <p className="text-sm mb-2">{reporte.descripcion}</p>
                        <div className="flex gap-2">
                          <Badge variant={getEstatusConfig(reporte.estatus).variant}>
                            {reporte.estatus.replace(/_/g, ' ')}
                          </Badge>
                          <Badge variant="outline">{reporte.prioridad}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
