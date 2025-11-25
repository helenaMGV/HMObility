# 🚀 Guía de Inicio Rápido - HMObility v4.0.0

## Instalación en 3 Minutos

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/helenaMGV/hmobility-safe-streets.git
cd hmobility-safe-streets
```

### 2️⃣ Instalar Dependencias
```bash
npm install
```

### 3️⃣ Configurar Variables de Entorno (Opcional)
```bash
cp .env.example .env.local
```

**Edita `.env.local` con tus claves:**
- `VITE_MIXPANEL_TOKEN` - Para analytics (opcional en desarrollo)
- `VITE_GA_MEASUREMENT_ID` - Para Google Analytics (opcional)

> 💡 **Tip:** La app funciona sin estas claves, pero no tendrás analytics.

### 4️⃣ Iniciar Servidor de Desarrollo
```bash
npm run dev
```

Abre http://localhost:8080

---

## ✨ Nuevas Features v4.0.0

### 🎨 Sistema de Diseño Unificado
```typescript
import { designSystem } from '@/lib/design-system';

// Usar colores de marca
const color = designSystem.colors.brand.primary; // #f38e0b

// Usar componentes predefinidos
const cardClass = designSystem.components.card.elevated;

// Usar animaciones
const transition = designSystem.animations.transition.normal;
```

### 📊 Analytics
```typescript
import { analytics, AnalyticsEvents } from '@/lib/analytics';

// Trackear evento personalizado
analytics.trackEvent(AnalyticsEvents.PAGE_VIEW, {
  page_name: 'Dashboard',
});

// Trackear conversión
analytics.trackConversion('user_registered', 1, {
  source: 'onboarding',
});
```

### 🔧 Web Workers
```typescript
import { useRouteWorker } from '@/hooks/useRouteWorker';

const { calculateRoute, isReady } = useRouteWorker();

// Calcular ruta en segundo plano (no bloquea la UI)
const result = await calculateRoute(origin, destination, osmRoutes);
```

### 🗺️ Mega Menu
```typescript
import { MegaMenu } from '@/components/MegaMenu';

// En tu layout
<MegaMenu />
```

### 📱 Bottom Navigation
```typescript
import { BottomNavigation } from '@/components/BottomNavigation';

// Se auto-oculta en desktop
<BottomNavigation />
```

### 🎓 Onboarding Tour
```typescript
import { OnboardingTour, ciudadanoTourSteps } from '@/components/OnboardingTour';

<OnboardingTour
  steps={ciudadanoTourSteps}
  onComplete={() => console.log('Tour completado')}
/>
```

### 🆘 Centro de Ayuda
```typescript
import { HelpCenter } from '@/components/HelpCenter';

// Botón flotante siempre visible
<HelpCenter />
```

### 🔔 Notificaciones
```typescript
import { notificationStore } from '@/components/NotificationCenter';

// Agregar notificación
notificationStore.add({
  type: 'success',
  title: 'Reporte enviado',
  message: 'Tu reporte ha sido recibido correctamente',
  actionLabel: 'Ver detalles',
  actionUrl: '/reportes/123',
});
```

---

## 📂 Estructura de Archivos Clave

```
src/
├── lib/
│   ├── design-system.ts       # Sistema de diseño unificado ⭐
│   ├── analytics.ts            # Analytics integrado ⭐
│   └── logger.ts
├── workers/
│   └── route-calculator.worker.ts  # Web Worker para rutas ⭐
├── hooks/
│   ├── useRouteWorker.ts      # Hook para web workers ⭐
│   └── useOSMRoutes.ts
├── components/
│   ├── MegaMenu.tsx           # Mega menú de navegación ⭐
│   ├── BottomNavigation.tsx   # Navegación móvil ⭐
│   ├── OnboardingTour.tsx     # Tour guiado ⭐
│   ├── HelpCenter.tsx         # Centro de ayuda ⭐
│   └── NotificationCenter.tsx # Notificaciones ⭐
└── pages/
    ├── Home.tsx
    ├── MapPage.tsx
    └── GobiernoDashboard.tsx
```

⭐ = Nuevos en v4.0.0

---

## 🎯 Flujos Principales

### Para Ciudadanos
1. **Ver Mapa** → `/map` - Mapa interactivo con accidentes
2. **Reportar** → `/citizen-reports` - Reportar problemas viales
3. **Jugar** → `/game` - Juego educativo de seguridad vial
4. **Datos** → `/gobierno/datos-abiertos` - Descargar datasets

### Para Gobierno
1. **Dashboard** → `/gobierno/dashboard` - Vista ejecutiva con 16 módulos
2. **High-Injury Network** → Zonas críticas identificadas
3. **Centro de Comando** → Monitoreo en tiempo real
4. **Analítica** → Reportes y estadísticas avanzadas

### Para Desarrolladores
1. **API Docs** → `/api` - Endpoints disponibles
2. **Datos Abiertos** → JSON/CSV/GeoJSON descargables
3. **Sistema de Diseño** → `design-system.ts` - Tokens reutilizables

---

## 🐛 Resolución de Problemas

### El servidor no inicia en puerto 8080
```bash
# Usa otro puerto
npm run dev -- --port 3000
```

### Error de TypeScript
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Analytics no funciona
- Verifica que `VITE_ENABLE_ANALYTICS=true` en `.env.local`
- Abre la consola del navegador para ver eventos (en desarrollo)

### Web Workers no funcionan
- Asegúrate de usar un navegador moderno (Chrome 87+, Firefox 79+)
- Verifica `VITE_ENABLE_WORKERS=true`

### PWA no se instala
```bash
# Regenerar Service Worker
npm run build
```

---

## 📦 Comandos Útiles

```bash
# Desarrollo
npm run dev                  # Servidor dev en :8080
npm run dev:host            # Exponer en red local

# Build
npm run build               # Build de producción
npm run preview             # Preview del build
npm run build:analyze       # Analizar bundle size

# Calidad de Código
npm run lint                # Verificar código
npm run lint:fix            # Corregir automáticamente
npm run test                # Correr tests
npm run test:coverage       # Coverage report

# Backend (Vercel Serverless)
vercel dev                  # Dev con serverless functions
vercel deploy               # Deploy a Vercel
```

---

## 🔗 Links Útiles

- 📖 [Documentación Completa](./README.md)
- 📝 [Changelog v4.0.0](./CHANGELOG_V4.md)
- 🎨 [Propuestas Estratégicas](./docs/PROPUESTA_MEJORAS_COMPLETA.md)
- 🐛 [Reportar Bug](https://github.com/helenaMGV/HMObility/issues)
- 💬 [Discusiones](https://github.com/helenaMGV/HMObility/discussions)

---

## 💡 Tips Pro

### 1. Usar el Sistema de Diseño
```typescript
// ❌ NO hagas esto
<div className="bg-orange-500 p-4 rounded-lg shadow-md">

// ✅ Hazlo así
<div className={designSystem.components.card.elevated}>
```

### 2. Trackear Eventos Importantes
```typescript
// Trackear navegación
analytics.trackEvent(AnalyticsEvents.NAVIGATION, {
  destination: '/map',
  source: 'mega_menu',
});

// Trackear conversiones
analytics.trackConversion('report_submitted', 1);
```

### 3. Usar Web Workers para Cálculos Pesados
```typescript
// ❌ Bloquea la UI
const route = calculateHeavyRoute(points);

// ✅ No bloquea la UI
const { calculateRoute } = useRouteWorker();
const route = await calculateRoute(origin, destination, osmRoutes);
```

### 4. Agregar Onboarding a Nuevas Secciones
```typescript
const customTourSteps: TourStep[] = [
  {
    id: 'step1',
    title: 'Bienvenido',
    content: 'Descripción de la nueva sección',
    position: 'center',
  },
];

<OnboardingTour steps={customTourSteps} onComplete={() => {}} />
```

### 5. Notificar al Usuario
```typescript
import { notificationStore } from '@/components/NotificationCenter';

// Notificar éxito
notificationStore.add({
  type: 'success',
  title: 'Operación exitosa',
  message: 'Los datos se guardaron correctamente',
});
```

---

## 🎨 Personalización de Estilos

### Colores de Marca
Edita `src/lib/design-system.ts`:
```typescript
colors: {
  brand: {
    primary: '#f38e0b',    // Cambia aquí
    secondary: '#efac09',  // Y aquí
    accent: '#4dc0c5',     // Y aquí
  },
}
```

### Tipografía
Edita `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=TU_FUENTE');

body {
  font-family: 'TU_FUENTE', sans-serif;
}
```

---

## 📊 Métricas de Calidad

| Métrica | v3.6.0 | v4.0.0 | Objetivo |
|---------|--------|--------|----------|
| Lighthouse Performance | 95 | 98 | 95+ |
| Lighthouse Accessibility | 95 | 100 | 100 |
| Lighthouse Best Practices | 100 | 100 | 100 |
| Lighthouse SEO | 100 | 100 | 100 |
| Lighthouse PWA | 90 | 95 | 90+ |
| Bundle Size | 450KB | 420KB | <500KB |
| First Contentful Paint | 1.2s | 0.8s | <1.5s |
| Time to Interactive | 2.5s | 1.9s | <3s |

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea tu branch: `git checkout -b feature/nueva-feature`
3. Commit cambios: `git commit -m 'Add: nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Abre un Pull Request

---

## 📞 Soporte

¿Necesitas ayuda?

- 📧 Email: soporte@hmobility.mx
- 💬 Chat: Usa el botón de ayuda en la app
- 🐛 Bugs: [GitHub Issues](https://github.com/helenaMGV/HMObility/issues)
- 💡 Ideas: [GitHub Discussions](https://github.com/helenaMGV/HMObility/discussions)

---

**¡Disfruta construyendo con HMObility v4.0.0! 🚀**
