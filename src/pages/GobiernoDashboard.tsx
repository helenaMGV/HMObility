import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  AlertTriangle, 
  TrendingUp, 
  Map, 
  Calendar, 
  Database,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Radio,
  Bus,
  ParkingCircle,
  Users,
  Lightbulb,
  DollarSign,
  LayoutGrid,
  Cloud,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import HighInjuryNetwork from '@/components/gobierno/HighInjuryNetwork';
import AssetInventory from '@/components/gobierno/AssetInventory';
import FlowsModule from '@/components/gobierno/FlowsModule';
import CampaignsModule from '@/components/gobierno/CampaignsModule';
import OpenDataModule from '@/components/gobierno/OpenDataModule';
import RealTimeOpsModule from '@/components/gobierno/RealTimeOpsModule';
import TransitView from '@/components/gobierno/TransitView';
import CurbsView from '@/components/gobierno/CurbsView';
import CitizenScienceDashboardView from '@/components/gobierno/CitizenScienceDashboardView';
import InfrastructureRecommender from '@/components/gobierno/InfrastructureRecommender';
import CostsDamagesView from '@/components/gobierno/CostsDamagesView';
import DigitalTwin from '@/components/gobierno/DigitalTwin';
import EmissionsView from '@/components/gobierno/EmissionsView';
import EventsSimulation from '@/components/gobierno/EventsSimulation';
import IsochronesView from '@/components/gobierno/IsochronesView';

export default function GobiernoDashboard() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('overview');

  useEffect(() => {
    if (!user || role !== 'gobierno') {
      navigate('/login');
    }
  }, [user, role, navigate]);

  if (!user || role !== 'gobierno') {
    return null;
  }

  const menuItems = [
    { id: 'overview', label: 'Vista General', icon: LayoutDashboard },
    { id: 'high-injury', label: 'High-Injury Network', icon: AlertTriangle, badge: 'Pro' },
    { id: 'flujos', label: 'Flujos de Movilidad', icon: TrendingUp },
    { id: 'inventario', label: 'Inventario Vial', icon: Map },
    { id: 'campañas', label: 'Campañas', icon: Calendar },
    { id: 'datos', label: 'Datos Abiertos', icon: Database },
    { id: 'realtime', label: 'Centro de Comando', icon: Radio, badge: 'Live' },
    { id: 'transito', label: 'Transporte Público', icon: Bus },
    { id: 'curbs', label: 'Estacionamientos', icon: ParkingCircle },
    { id: 'citizen-science', label: 'Reportes Ciudadanos', icon: Users },
    { id: 'infra-recommender', label: 'Recomendaciones IA', icon: Lightbulb, badge: 'AI' },
    { id: 'costs-damages', label: 'Costos y Daños', icon: DollarSign },
    { id: 'digital-twin', label: 'Gemelo Digital', icon: LayoutGrid, badge: 'PRO' },
    { id: 'emissions', label: 'Emisiones', icon: Cloud, badge: 'PRO' },
    { id: 'events', label: 'Simulación Eventos', icon: Calendar, badge: 'PRO' },
    { id: 'isochrones', label: 'Isócronas', icon: Clock, badge: 'PRO' },
    { id: 'simulator', label: 'Simulador de Rutas', icon: Map, badge: 'NUEVO', isExternal: true },
  ];

  const stats = [
    { label: 'Accidentes (mes)', value: '47', change: '-12%', positive: true },
    { label: 'Zonas Críticas', value: '8', change: 'Sin cambio' },
    { label: 'Activos Viales', value: '1,234', change: '+5%', positive: true },
    { label: 'Reportes Ciudadanos', value: '156', change: '+24%', positive: true },
  ];

  const recentActivity = [
    { id: 1, type: 'Accidente', location: 'Blvd. Luis Encinas', time: 'Hace 2h', severity: 'alta' },
    { id: 2, type: 'Mantenimiento', location: 'Semáforo Colosio y Morelos', time: 'Hace 4h', severity: 'media' },
    { id: 3, type: 'Reporte', location: 'Bache en Villa de Seris', time: 'Hace 5h', severity: 'baja' },
    { id: 4, type: 'Campaña', location: 'Nueva campaña de velocidad', time: 'Hace 1d', severity: 'media' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'alta': return 'bg-red-100 text-red-800 border border-red-200 font-semibold';
      case 'media': return 'bg-orange-100 text-orange-800 border border-orange-200 font-semibold';
      case 'baja': return 'bg-blue-100 text-blue-800 border border-blue-200 font-semibold';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200 font-semibold';
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
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-secondary-foreground" />
              <span className="font-bold text-lg">Gobierno</span>
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

        {/* Menu Items */}
        <ScrollArea className="flex-1 p-2">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              
              // Si es un ítem externo (simulador), usar link
              if (item.isExternal) {
                return (
                  <a
                    key={item.id}
                    href="/mapa-animado"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground hover:text-foreground`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </a>
                );
              }
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-secondary text-secondary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Sidebar Footer */}
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
        {/* Top Bar */}
        <header className="bg-card border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {menuItems.find(m => m.id === activeModule)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-muted-foreground">Hermosillo, Sonora</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{user.role}</Badge>
          </div>
        </header>

        {/* Content Area */}
        <ScrollArea className="flex-1 p-6">
          {activeModule === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardDescription>{stat.label}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <p className={`text-xs ${stat.positive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Últimos eventos y actualizaciones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{activity.type}</span>
                              <Badge variant="outline" className={`text-xs ${getSeverityColor(activity.severity)}`}>
                                {activity.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.location}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Acciones Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveModule('high-injury')}>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Zonas de Riesgo
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveModule('inventario')}>
                      <Map className="w-4 h-4 mr-2" />
                      Ver Inventario
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveModule('campañas')}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Nueva Campaña
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveModule('datos')}>
                      <Database className="w-4 h-4 mr-2" />
                      Exportar Datos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeModule === 'high-injury' && <HighInjuryNetwork />}
          {activeModule === 'inventario' && <AssetInventory />}
          {activeModule === 'flujos' && <FlowsModule />}
          {activeModule === 'campañas' && <CampaignsModule />}
          {activeModule === 'datos' && <OpenDataModule />}
          {activeModule === 'realtime' && <RealTimeOpsModule />}
          {activeModule === 'transito' && <TransitView />}
          {activeModule === 'curbs' && <CurbsView />}
          {activeModule === 'citizen-science' && <CitizenScienceDashboardView />}
          {activeModule === 'infra-recommender' && <InfrastructureRecommender />}
          {activeModule === 'costs-damages' && <CostsDamagesView />}
          {activeModule === 'digital-twin' && <DigitalTwin />}
          {activeModule === 'emissions' && <EmissionsView />}
          {activeModule === 'events' && <EventsSimulation />}
          {activeModule === 'isochrones' && <IsochronesView />}

          {![
            'overview',
            'high-injury',
            'inventario',
            'flujos',
            'campañas',
            'datos',
            'realtime',
            'transito',
            'curbs',
            'citizen-science',
            'infra-recommender',
            'costs-damages',
            'digital-twin',
            'emissions',
            'events',
            'isochrones',
          ].includes(activeModule) && (
            <Card>
              <CardHeader>
                <CardTitle>Módulo en Desarrollo</CardTitle>
                <CardDescription>
                  {menuItems.find(m => m.id === activeModule)?.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Este módulo está en desarrollo. Pronto tendrá funcionalidades completas.
                </p>
              </CardContent>
            </Card>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
