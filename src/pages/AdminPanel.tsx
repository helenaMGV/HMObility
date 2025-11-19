import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Settings, 
  Database, 
  Users, 
  LayoutDashboard,
  Megaphone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Plus,
  Edit2,
  Trash2,
  Save
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Activo {
  id: string;
  tipo: string;
  nombre: string;
  ubicacion: string;
  colonia: string;
  estado: string;
  costo: number;
}

interface Campana {
  id: string;
  nombre: string;
  tipo: string;
  inicio: string;
  fin: string;
  estado: string;
  alcance: number;
}

export default function AdminPanel() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState('overview');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Mock data
  const [activos, setActivos] = useState<Activo[]>([
    { id: 'ACT-001', tipo: 'Semáforo', nombre: 'Semáforo Colosio', ubicacion: 'Blvd. Colosio y Morelos', colonia: 'Villa de Seris', estado: 'operativo', costo: 85000 },
    { id: 'ACT-002', tipo: 'Señal', nombre: 'Alto Altares', ubicacion: 'Calle Yeomans', colonia: 'Altares', estado: 'operativo', costo: 3500 },
    { id: 'ACT-003', tipo: 'Tope', nombre: 'Reductor Pitic', ubicacion: 'Calle Rosales', colonia: 'Pitic', estado: 'mantenimiento', costo: 12000 },
  ]);

  const [campanas, setCampanas] = useState<Campana[]>([
    { id: 'CAM-001', nombre: 'Respeta Límites de Velocidad', tipo: 'Prevención', inicio: '2025-11-01', fin: '2025-12-31', estado: 'activa', alcance: 50000 },
    { id: 'CAM-002', nombre: 'Cruces Seguros', tipo: 'Educación', inicio: '2025-10-15', fin: '2025-11-30', estado: 'activa', alcance: 30000 },
    { id: 'CAM-003', nombre: 'Cero Alcohol al Volante', tipo: 'Prevención', inicio: '2025-09-01', fin: '2025-11-15', estado: 'finalizada', alcance: 80000 },
  ]);

  useEffect(() => {
    if (!user || role !== 'superadmin') {
      navigate('/login');
    }
  }, [user, role, navigate]);

  if (!user || role !== 'superadmin') {
    return null;
  }

  const menuItems = [
    { id: 'overview', label: 'Vista General', icon: LayoutDashboard },
    { id: 'activos', label: 'Gestión de Activos', icon: Database },
    { id: 'campanas', label: 'Campañas', icon: Megaphone },
    { id: 'zonas', label: 'Zonas y Permisos', icon: MapPin },
    { id: 'config', label: 'Configuración', icon: Settings },
  ];

  const handleDeleteActivo = (id: string) => {
    setActivos(activos.filter(a => a.id !== id));
  };

  const handleDeleteCampana = (id: string) => {
    setCampanas(campanas.filter(c => c.id !== id));
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'operativo':
      case 'activa':
        return 'default';
      case 'mantenimiento':
        return 'secondary';
      case 'dañado':
      case 'finalizada':
        return 'outline';
      default:
        return 'outline';
    }
  };

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
              <Shield className="w-6 h-6 text-accent-foreground" />
              <span className="font-bold text-lg">Admin</span>
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
                      ? 'bg-accent text-accent-foreground'
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
                {menuItems.find(m => m.id === activeModule)?.label || 'Panel Admin'}
              </h1>
              <p className="text-sm text-muted-foreground">Sistema de gestión integral</p>
            </div>
          </div>
          <Badge variant="outline">{user.role}</Badge>
        </header>

        <ScrollArea className="flex-1 p-6">
          {/* Overview */}
          {activeModule === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Activos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{activos.length}</div>
                    <p className="text-xs text-muted-foreground">Infraestructura vial</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Campañas Activas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{campanas.filter(c => c.estado === 'activa').length}</div>
                    <p className="text-xs text-primary">En ejecución</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Usuarios Registrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1,247</div>
                    <p className="text-xs text-muted-foreground">Plataforma</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Reportes Pendientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12</div>
                    <p className="text-xs text-accent-foreground">Requieren atención</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Accesos Rápidos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveModule('activos')}>
                      <Database className="w-4 h-4 mr-2" />
                      Gestionar Activos
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveModule('campanas')}>
                      <Megaphone className="w-4 h-4 mr-2" />
                      Nueva Campaña
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveModule('config')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Configuración
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Activo creado: SEM-004</span>
                        <span className="text-xs">Hace 2h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Campaña actualizada: CAM-002</span>
                        <span className="text-xs">Hace 5h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Zona configurada: Norte</span>
                        <span className="text-xs">Hace 1d</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Gestión de Activos */}
          {activeModule === 'activos' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Inventario de Activos</h2>
                  <p className="text-sm text-muted-foreground">Gestiona la infraestructura vial</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Nuevo Activo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Activo</DialogTitle>
                      <DialogDescription>Registra un nuevo elemento de infraestructura vial</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Tipo</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="semaforo">Semáforo</SelectItem>
                            <SelectItem value="señal">Señal</SelectItem>
                            <SelectItem value="tope">Tope</SelectItem>
                            <SelectItem value="barda">Barda</SelectItem>
                            <SelectItem value="luminaria">Luminaria</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Nombre</Label>
                        <Input placeholder="Nombre del activo" />
                      </div>
                      <div>
                        <Label>Ubicación</Label>
                        <Input placeholder="Dirección completa" />
                      </div>
                      <div>
                        <Label>Colonia</Label>
                        <Input placeholder="Colonia" />
                      </div>
                      <div>
                        <Label>Costo de Instalación</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                      <Button onClick={() => setDialogOpen(false)}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Costo</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activos.map((activo) => (
                        <TableRow key={activo.id}>
                          <TableCell className="font-mono text-xs">{activo.id}</TableCell>
                          <TableCell>{activo.tipo}</TableCell>
                          <TableCell className="font-medium">{activo.nombre}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{activo.ubicacion}</TableCell>
                          <TableCell>
                            <Badge variant={getEstadoBadge(activo.estado)}>{activo.estado}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            ${activo.costo.toLocaleString('es-MX')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteActivo(activo.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Gestión de Campañas */}
          {activeModule === 'campanas' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Campañas de Prevención</h2>
                  <p className="text-sm text-muted-foreground">Gestiona campañas educativas y de concientización</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Nueva Campaña
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Crear Nueva Campaña</DialogTitle>
                      <DialogDescription>Define los objetivos y alcance de la campaña</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nombre de la Campaña</Label>
                        <Input placeholder="Ej: Cruces Seguros 2025" />
                      </div>
                      <div>
                        <Label>Tipo</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prevencion">Prevención</SelectItem>
                            <SelectItem value="educacion">Educación</SelectItem>
                            <SelectItem value="concientizacion">Concientización</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Fecha Inicio</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Fecha Fin</Label>
                          <Input type="date" />
                        </div>
                      </div>
                      <div>
                        <Label>Descripción</Label>
                        <Textarea placeholder="Describe los objetivos y estrategias..." rows={4} />
                      </div>
                      <div>
                        <Label>Alcance Estimado (personas)</Label>
                        <Input type="number" placeholder="50000" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancelar</Button>
                      <Button>
                        <Save className="w-4 h-4 mr-2" />
                        Crear Campaña
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Inicio</TableHead>
                        <TableHead>Fin</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Alcance</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campanas.map((campana) => (
                        <TableRow key={campana.id}>
                          <TableCell className="font-mono text-xs">{campana.id}</TableCell>
                          <TableCell className="font-medium">{campana.nombre}</TableCell>
                          <TableCell>{campana.tipo}</TableCell>
                          <TableCell className="text-sm">{new Date(campana.inicio).toLocaleDateString('es-MX')}</TableCell>
                          <TableCell className="text-sm">{new Date(campana.fin).toLocaleDateString('es-MX')}</TableCell>
                          <TableCell>
                            <Badge variant={getEstadoBadge(campana.estado)}>{campana.estado}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {campana.alcance.toLocaleString('es-MX')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteCampana(campana.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other modules placeholder */}
          {(activeModule === 'zonas' || activeModule === 'config') && (
            <Card>
              <CardHeader>
                <CardTitle>Módulo en Desarrollo</CardTitle>
                <CardDescription>
                  {menuItems.find(m => m.id === activeModule)?.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Este módulo estará disponible próximamente.
                </p>
              </CardContent>
            </Card>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
