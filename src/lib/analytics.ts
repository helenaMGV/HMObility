/**
 * Sistema de Analytics Unificado
 * Integra Mixpanel, Google Analytics y tracking personalizado
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

interface UserTraits {
  userId?: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

class AnalyticsService {
  private initialized = false;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Inicializar servicios de analytics
   */
  init() {
    if (this.initialized) return;

    try {
      // Solo en producción
      if (import.meta.env.MODE === 'production') {
        this.initMixpanel();
        this.initGoogleAnalytics();
      }

      // Trackear inicio de sesión
      this.trackEvent('app_initialized', {
        environment: import.meta.env.MODE,
        version: '3.6.0',
        timestamp: new Date().toISOString(),
      });

      this.initialized = true;
      console.log('✅ Analytics initialized');
    } catch (error) {
      console.error('❌ Analytics initialization failed:', error);
    }
  }

  /**
   * Inicializar Mixpanel
   */
  private initMixpanel() {
    // En producción real, cargar Mixpanel aquí
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.mixpanel?.init(import.meta.env.VITE_MIXPANEL_TOKEN || 'demo', {
        debug: import.meta.env.MODE === 'development',
        track_pageview: true,
        persistence: 'localStorage',
      });
    }
  }

  /**
   * Inicializar Google Analytics
   */
  private initGoogleAnalytics() {
    // En producción real, cargar GA4 aquí
    if (typeof window !== 'undefined' && import.meta.env.VITE_GA_MEASUREMENT_ID) {
      // @ts-ignore
      window.gtag?.('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
    }
  }

  /**
   * Generar ID de sesión único
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Trackear evento
   */
  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (!this.initialized) {
      console.warn('Analytics not initialized');
      return;
    }

    const eventData: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer,
      },
      timestamp: new Date(),
    };

    // Enviar a Mixpanel
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.mixpanel?.track(eventName, eventData.properties);
      
      // Enviar a GA4
      // @ts-ignore
      window.gtag?.('event', eventName, eventData.properties);
    }

    // Log en desarrollo
    if (import.meta.env.MODE === 'development') {
      console.log('📊 Analytics Event:', eventData);
    }

    // Guardar en localStorage para debugging
    this.saveEventToStorage(eventData);
  }

  /**
   * Trackear vista de página
   */
  trackPageView(pageName: string, properties?: Record<string, any>) {
    this.trackEvent('page_view', {
      page_name: pageName,
      page_path: window.location.pathname,
      page_title: document.title,
      ...properties,
    });
  }

  /**
   * Identificar usuario
   */
  identifyUser(userId: string, traits?: UserTraits) {
    this.userId = userId;

    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.mixpanel?.identify(userId);
      // @ts-ignore
      window.mixpanel?.people.set(traits);

      // @ts-ignore
      window.gtag?.('set', { user_id: userId });
    }

    this.trackEvent('user_identified', { userId, ...traits });
  }

  /**
   * Trackear tiempo en página
   */
  trackTimeOnPage(pageName: string, seconds: number) {
    this.trackEvent('time_on_page', {
      page_name: pageName,
      duration_seconds: seconds,
      duration_minutes: Math.round(seconds / 60),
    });
  }

  /**
   * Trackear interacción
   */
  trackInteraction(element: string, action: string, properties?: Record<string, any>) {
    this.trackEvent('user_interaction', {
      element,
      action,
      ...properties,
    });
  }

  /**
   * Trackear conversión
   */
  trackConversion(conversionType: string, value?: number, properties?: Record<string, any>) {
    this.trackEvent('conversion', {
      conversion_type: conversionType,
      value,
      ...properties,
    });
  }

  /**
   * Trackear error
   */
  trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...context,
    });
  }

  /**
   * Guardar eventos en localStorage para debugging
   */
  private saveEventToStorage(event: AnalyticsEvent) {
    try {
      const key = 'hmobility_analytics_events';
      const stored = localStorage.getItem(key);
      const events = stored ? JSON.parse(stored) : [];
      
      events.push(event);
      
      // Mantener solo los últimos 100 eventos
      if (events.length > 100) {
        events.shift();
      }
      
      localStorage.setItem(key, JSON.stringify(events));
    } catch (error) {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Obtener eventos almacenados (para debugging)
   */
  getStoredEvents(): AnalyticsEvent[] {
    try {
      const key = 'hmobility_analytics_events';
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Limpiar eventos almacenados
   */
  clearStoredEvents() {
    try {
      localStorage.removeItem('hmobility_analytics_events');
    } catch {
      // Silently fail
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsService();

// Tipos de eventos comunes
export const AnalyticsEvents = {
  // Navegación
  PAGE_VIEW: 'page_view',
  NAVIGATION: 'navigation',
  
  // Dashboard Gobierno
  DASHBOARD_MODULE_OPENED: 'dashboard_module_opened',
  DATA_EXPORTED: 'data_exported',
  CAMPAIGN_CREATED: 'campaign_created',
  REPORT_REVIEWED: 'report_reviewed',
  
  // Ciudadano
  REPORT_SUBMITTED: 'report_submitted',
  MAP_INTERACTION: 'map_interaction',
  ACCIDENT_VIEWED: 'accident_viewed',
  DATA_DOWNLOADED: 'data_downloaded',
  
  // Simulaciones
  SIMULATION_STARTED: 'simulation_started',
  SIMULATION_COMPLETED: 'simulation_completed',
  SCENARIO_CHANGED: 'scenario_changed',
  
  // Engagement
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  SHARE_CLICKED: 'share_clicked',
  
  // Conversiones
  USER_REGISTERED: 'user_registered',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
} as const;
