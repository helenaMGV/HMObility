/**
 * Mega Menu de Navegación Principal
 * Navegación moderna con categorías y búsqueda integrada
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Gamepad2,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  MapPin,
  AlertTriangle,
  BarChart3,
  FileText,
  Lightbulb,
  Shield,
  Activity,
  Target,
  Leaf,
  Calendar,
  Clock,
  Database,
  Globe,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { designSystem, cn } from '@/lib/design-system';
import { analytics, AnalyticsEvents } from '@/lib/analytics';

interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
  isNew?: boolean;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    title: 'Ciudadano',
    items: [
      {
        title: 'Mapa Interactivo',
        href: '/map',
        icon: <Map className="w-5 h-5" />,
        description: 'Explora accidentes y zonas de riesgo',
      },
      {
        title: 'Reportar Incidente',
        href: '/citizen-reports',
        icon: <AlertTriangle className="w-5 h-5" />,
        description: 'Reporta problemas viales',
        badge: 'Popular',
      },
      {
        title: 'Juego Educativo',
        href: '/game',
        icon: <Gamepad2 className="w-5 h-5" />,
        description: 'Aprende sobre seguridad vial',
      },
      {
        title: 'Mi Panel',
        href: '/citizen',
        icon: <Users className="w-5 h-5" />,
        description: 'Tus reportes y actividad',
      },
    ],
  },
  {
    title: 'Gobierno',
    items: [
      {
        title: 'Dashboard Ejecutivo',
        href: '/gobierno/dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        description: 'Vista general de indicadores',
      },
      {
        title: 'High-Injury Network',
        href: '/gobierno/high-injury-network',
        icon: <Target className="w-5 h-5" />,
        description: 'Zonas de alta siniestralidad',
        isNew: true,
      },
      {
        title: 'Centro de Comando',
        href: '/gobierno/centro-comando',
        icon: <Activity className="w-5 h-5" />,
        description: 'Monitoreo en tiempo real',
      },
      {
        title: 'Analítica Avanzada',
        href: '/gobierno/analytics',
        icon: <BarChart3 className="w-5 h-5" />,
        description: 'Reportes y estadísticas',
      },
      {
        title: 'Recomendaciones IA',
        href: '/gobierno/ia-recommendations',
        icon: <Lightbulb className="w-5 h-5" />,
        description: 'Insights automáticos',
        isNew: true,
      },
      {
        title: 'Gemelo Digital',
        href: '/gobierno/gemelo-digital',
        icon: <Globe className="w-5 h-5" />,
        description: 'Simulación 3D de la ciudad',
      },
    ],
  },
  {
    title: 'Datos y Análisis',
    items: [
      {
        title: 'Datos Abiertos',
        href: '/gobierno/datos-abiertos',
        icon: <Database className="w-5 h-5" />,
        description: 'Descarga datasets',
      },
      {
        title: 'Reportes Ciudadanos',
        href: '/gobierno/reportes-ciudadanos',
        icon: <MessageSquare className="w-5 h-5" />,
        description: 'Gestiona reportes',
        badge: '24',
      },
      {
        title: 'Inventario Vial',
        href: '/gobierno/inventario',
        icon: <FileText className="w-5 h-5" />,
        description: 'Infraestructura catalogada',
      },
      {
        title: 'Análisis de Costos',
        href: '/gobierno/costos',
        icon: <TrendingUp className="w-5 h-5" />,
        description: 'Impacto económico',
      },
    ],
  },
  {
    title: 'Planeación',
    items: [
      {
        title: 'Campañas',
        href: '/gobierno/campanas',
        icon: <Bell className="w-5 h-5" />,
        description: 'Gestiona campañas de prevención',
      },
      {
        title: 'Eventos Especiales',
        href: '/gobierno/eventos',
        icon: <Calendar className="w-5 h-5" />,
        description: 'Planifica operativos',
      },
      {
        title: 'Isócronas',
        href: '/gobierno/isocronas',
        icon: <Clock className="w-5 h-5" />,
        description: 'Análisis de accesibilidad',
      },
      {
        title: 'Emisiones',
        href: '/gobierno/emisiones',
        icon: <Leaf className="w-5 h-5" />,
        description: 'Huella de carbono',
      },
    ],
  },
];

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar items por búsqueda
  const filteredCategories = searchQuery
    ? menuCategories.map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((category) => category.items.length > 0)
    : menuCategories;

  const handleItemClick = (item: MenuItem) => {
    analytics.trackEvent(AnalyticsEvents.NAVIGATION, {
      destination: item.href,
      title: item.title,
      source: 'mega_menu',
    });
    setIsOpen(false);
    setSearchQuery('');
    navigate(item.href);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredCategories.length > 0) {
      const firstItem = filteredCategories[0].items[0];
      if (firstItem) {
        handleItemClick(firstItem);
      }
    }
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Botón de Menú */}
      <Button
        variant="ghost"
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          designSystem.animations.transition.fast,
          'flex items-center gap-2 px-4 py-2 rounded-lg',
          isOpen && 'bg-muted'
        )}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
        <span className="hidden md:inline font-semibold">Menú</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </Button>

      {/* Mega Menu Panel */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-2 w-screen max-w-4xl',
            'bg-white dark:bg-gray-900 rounded-xl shadow-2xl',
            'border-2 border-gray-200 dark:border-gray-700',
            'z-50 overflow-hidden',
            designSystem.animations.entrance.fadeIn
          )}
        >
          {/* Header con Búsqueda */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar módulos, funciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-10 pr-4 py-2 w-full text-lg border-2 focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
          </div>

          {/* Grid de Categorías */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 max-h-[70vh] overflow-y-auto">
            {filteredCategories.map((category, idx) => (
              <div
                key={category.title}
                className={cn(
                  'p-4 hover:bg-muted/50 transition-colors',
                  idx % 2 === 0 && 'bg-gray-50/50 dark:bg-gray-800/50'
                )}
                onMouseEnter={() => setActiveCategory(category.title)}
              >
                {/* Título de Categoría */}
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                  {category.title}
                </h3>

                {/* Items */}
                <div className="space-y-1">
                  {category.items.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg',
                        'hover:bg-white dark:hover:bg-gray-800',
                        'hover:shadow-md transition-all',
                        'group cursor-pointer',
                        'border-2 border-transparent hover:border-primary/20'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-primary group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                              {item.title}
                            </span>
                            {item.isNew && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                Nuevo
                              </Badge>
                            )}
                            {item.badge && (
                              <Badge variant="default" className="text-xs px-1.5 py-0.5">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>
                Presiona <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded border">⌘K</kbd> para buscar
              </span>
              <Link
                to="/admin"
                className="text-primary hover:underline font-medium"
                onClick={() => setIsOpen(false)}
              >
                Panel Admin →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
