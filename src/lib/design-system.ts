/**
 * HMObility Design System
 * Sistema de diseño unificado con tokens reutilizables
 * Versión: 1.0.0
 */

export const designSystem = {
  // Paleta de colores de marca
  colors: {
    brand: {
      primary: '#f38e0b',      // Orange - Principal
      secondary: '#efac09',     // Yellow - Secundario
      accent: '#4dc0c5',        // Blue - Acento
      success: '#22c55e',       // Verde
      warning: '#f59e0b',       // Amarillo advertencia
      error: '#ef4444',         // Rojo error
      info: '#3b82f6',          // Azul información
    },
    semantic: {
      danger: '#dc2626',
      neutral: '#6b7280',
      muted: '#9ca3af',
    },
    text: {
      primary: '#1a1a1a',       // 15.8:1 contraste
      secondary: '#4a4a4a',     // 8.9:1 contraste
      muted: '#6b7280',         // 4.6:1 contraste
      inverse: '#ffffff',
    },
    background: {
      light: '#ffffff',
      dark: '#0f172a',
      muted: '#f9fafb',
      accent: '#fef3c7',
    },
  },

  // Espaciados estandarizados (8px base)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },

  // Tipografía consistente
  typography: {
    fontFamily: {
      sans: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"Fira Code", "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    classes: {
      display: 'text-5xl font-bold leading-tight',
      h1: 'text-4xl font-bold leading-tight',
      h2: 'text-3xl font-semibold leading-tight',
      h3: 'text-2xl font-semibold leading-normal',
      h4: 'text-xl font-semibold leading-normal',
      body: 'text-base font-normal leading-normal',
      bodyLarge: 'text-lg font-normal leading-relaxed',
      small: 'text-sm font-normal leading-normal',
      xs: 'text-xs font-normal leading-normal',
      label: 'text-sm font-medium leading-normal',
      caption: 'text-xs font-medium leading-normal uppercase tracking-wide',
    },
  },

  // Radios de borde
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Componentes base
  components: {
    card: {
      base: 'rounded-xl border-2 shadow-md bg-card',
      elevated: 'rounded-xl border-2 shadow-lg bg-card',
      flat: 'rounded-lg border bg-card',
      interactive: 'rounded-xl border-2 shadow-md bg-card hover:shadow-lg transition-shadow cursor-pointer',
    },
    button: {
      primary: 'bg-primary hover:bg-primary/90 text-white font-semibold shadow-md hover:shadow-lg transition-all',
      secondary: 'bg-secondary hover:bg-secondary/90 text-gray-900 font-semibold shadow-md hover:shadow-lg transition-all',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-all',
      ghost: 'hover:bg-muted text-foreground font-medium transition-colors',
      danger: 'bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md hover:shadow-lg transition-all',
      success: 'bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md hover:shadow-lg transition-all',
    },
    input: {
      base: 'border-2 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all',
      error: 'border-2 border-red-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500',
      success: 'border-2 border-green-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500',
    },
    badge: {
      primary: 'bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-1 text-xs font-semibold',
      secondary: 'bg-secondary/10 text-secondary border border-secondary/20 rounded-full px-2 py-1 text-xs font-semibold',
      success: 'bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-1 text-xs font-semibold',
      warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full px-2 py-1 text-xs font-semibold',
      error: 'bg-red-100 text-red-700 border border-red-200 rounded-full px-2 py-1 text-xs font-semibold',
      info: 'bg-blue-100 text-blue-700 border border-blue-200 rounded-full px-2 py-1 text-xs font-semibold',
    },
    alert: {
      success: 'bg-green-50 border-l-4 border-green-500 text-green-900 p-4 rounded-r-lg',
      warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-r-lg',
      error: 'bg-red-50 border-l-4 border-red-500 text-red-900 p-4 rounded-r-lg',
      info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-900 p-4 rounded-r-lg',
    },
  },

  // Animaciones y transiciones
  animations: {
    transition: {
      fast: 'transition-all duration-150 ease-in-out',
      normal: 'transition-all duration-300 ease-in-out',
      slow: 'transition-all duration-500 ease-in-out',
    },
    entrance: {
      fadeIn: 'animate-in fade-in duration-300',
      slideUp: 'animate-in slide-in-from-bottom duration-300',
      slideDown: 'animate-in slide-in-from-top duration-300',
      slideLeft: 'animate-in slide-in-from-right duration-300',
      slideRight: 'animate-in slide-in-from-left duration-300',
      zoom: 'animate-in zoom-in duration-300',
    },
  },

  // Breakpoints responsive
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
  },
} as const;

// Helper para construir classNames
export const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Helper para obtener colores por gravedad
export const getSeverityColor = (severity: 'leve' | 'grave' | 'mortal') => {
  const colors = {
    leve: designSystem.colors.brand.warning,
    grave: '#f97316', // Orange oscuro
    mortal: designSystem.colors.brand.error,
  };
  return colors[severity];
};

// Helper para obtener colores por estado
export const getStatusColor = (status: 'pendiente' | 'en_proceso' | 'atendido' | 'rechazado') => {
  const colors = {
    pendiente: designSystem.colors.brand.warning,
    en_proceso: designSystem.colors.brand.info,
    atendido: designSystem.colors.brand.success,
    rechazado: designSystem.colors.brand.error,
  };
  return colors[status];
};

// Export tipos
export type DesignSystem = typeof designSystem;
export type ColorScale = keyof typeof designSystem.colors.brand;
export type Spacing = keyof typeof designSystem.spacing;
export type Typography = keyof typeof designSystem.typography.classes;
