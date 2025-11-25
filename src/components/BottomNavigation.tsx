/**
 * Bottom Navigation para móviles
 * Navegación estilo iOS/Android con tabs fijos
 */

import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Bell, Users, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/design-system';
import { analytics, AnalyticsEvents } from '@/lib/analytics';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    icon: Home,
    label: 'Inicio',
    href: '/',
  },
  {
    icon: Map,
    label: 'Mapa',
    href: '/map',
  },
  {
    icon: Bell,
    label: 'Reportar',
    href: '/citizen-reports',
    badge: 2,
  },
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/gobierno/dashboard',
  },
  {
    icon: Users,
    label: 'Perfil',
    href: '/citizen',
  },
];

export function BottomNavigation() {
  const location = useLocation();

  const handleNavClick = (item: NavItem) => {
    analytics.trackEvent(AnalyticsEvents.NAVIGATION, {
      destination: item.href,
      label: item.label,
      source: 'bottom_navigation',
    });
  };

  // Ocultar en desktop
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 shadow-2xl md:hidden">
      <div className="flex items-center justify-around h-16 px-2 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
                          (item.href !== '/' && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => handleNavClick(item)}
              className={cn(
                'flex flex-col items-center justify-center',
                'flex-1 h-full px-2',
                'transition-all duration-200',
                'relative',
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              {/* Indicador activo */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
              )}

              {/* Icono con badge */}
              <div className="relative">
                <Icon
                  className={cn(
                    'w-6 h-6 mb-1 transition-transform',
                    isActive && 'scale-110'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs font-bold"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-xs font-medium transition-all',
                  isActive ? 'font-semibold scale-105' : ''
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
