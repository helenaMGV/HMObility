/**
 * Breadcrumbs Navigation
 * Navegación contextual con ruta actual
 */

import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/design-system';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

const routeLabels: Record<string, string> = {
  '': 'Inicio',
  'map': 'Mapa Interactivo',
  'gobierno': 'Gobierno',
  'dashboard': 'Dashboard',
  'high-injury-network': 'Red de Alta Siniestralidad',
  'centro-comando': 'Centro de Comando',
  'analytics': 'Analítica',
  'ia-recommendations': 'Recomendaciones IA',
  'gemelo-digital': 'Gemelo Digital',
  'datos-abiertos': 'Datos Abiertos',
  'reportes-ciudadanos': 'Reportes Ciudadanos',
  'inventario': 'Inventario Vial',
  'costos': 'Análisis de Costos',
  'campanas': 'Campañas',
  'eventos': 'Eventos Especiales',
  'isocronas': 'Isócronas',
  'emisiones': 'Emisiones',
  'admin': 'Administración',
  'citizen': 'Panel Ciudadano',
  'citizen-reports': 'Reportar Incidente',
  'game': 'Juego Educativo',
  'about': 'Acerca de',
  'infraestructura': 'Infraestructura',
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Inicio',
      path: '/',
      icon: <Home className="w-4 h-4" />,
    },
  ];

  let currentPath = '';
  pathnames.forEach((segment) => {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      label: routeLabels[segment] || segment.replace(/-/g, ' '),
      path: currentPath,
    });
  });

  if (breadcrumbs.length === 1) {
    return null; // No mostrar breadcrumbs en home
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 px-4 py-2 text-sm bg-muted/50 rounded-lg"
    >
      <ol className="flex items-center gap-2 list-none">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              {isLast ? (
                <span
                  className="flex items-center gap-1.5 font-medium text-foreground capitalize"
                  aria-current="page"
                >
                  {crumb.icon}
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className={cn(
                    'flex items-center gap-1.5',
                    'text-muted-foreground hover:text-foreground',
                    'transition-colors capitalize'
                  )}
                >
                  {crumb.icon}
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
