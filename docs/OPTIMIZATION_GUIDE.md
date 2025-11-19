# Guía de Optimización del Sitio 🚀

## Quick Commands

```bash
# Development
npm run dev                    # Servidor de desarrollo
npm run type-check            # Verificar errores TypeScript
npm run lint                  # Verificar código
npm run lint:fix              # Auto-fix problemas linting

# Build & Analysis
npm run build                 # Build de producción
npm run build:analyze         # Build + visualizar bundle
npm run preview              # Preview del build local

# Maintenance
npm run clean                # Limpiar cache y dist
npm run audit                # Auditar dependencias
npm run audit:fix            # Fix vulnerabilidades
```

---

## 🎯 Optimizaciones Implementadas

### 1. Lazy Loading de Rutas

Todas las páginas se cargan bajo demanda:

```typescript
// App.tsx
const Home = lazy(() => import('./pages/Home'));
const MapPage = lazy(() => import('./pages/MapPage'));
// ... etc
```

**Beneficio:** Bundle inicial reducido de 711KB → ~150KB (79% reducción)

---

### 2. Code Splitting Inteligente

Chunks separados por tipo de dependencia:

```
react-vendor.js       353KB  (React core)
vendor.js            402KB  (Otras librerías)
chart-vendor.js      294KB  (Recharts)
gobierno-modules.js  193KB  (Módulos gobierno)
map-vendor.js        182KB  (Leaflet)
```

**Beneficio:** Mejor cacheado, solo descarga lo necesario por ruta

---

### 3. Security Headers

```json
// vercel.json
{
  "Content-Security-Policy": "...",
  "Strict-Transport-Security": "max-age=31536000",
  "X-Frame-Options": "DENY"
}
```

**Beneficio:** Protección contra XSS, clickjacking, MITM attacks

---

### 4. Image Optimization

```tsx
<img
  src={backgroundImage}
  loading="eager"           // Solo para hero
  fetchPriority="high"      // Priorizar carga
  decoding="async"          // No bloquear render
  width="1920" height="1080" // Prevenir layout shift
/>
```

---

## 📊 Métricas de Performance

### Lighthouse Scores (Estimado)
```
Performance:    95+ ⚡
Accessibility:  95+ ♿
Best Practices: 95+ ✅
SEO:           100  🔍
```

### Bundle Analysis
```
Initial Load: ~150KB gzipped
Total Assets: ~700KB (lazy loaded)
Routes: 10 pages
Chunks: 28 optimized files
```

---

## 🔧 Mejoras Futuras Recomendadas

### Priority 1: Imágenes WebP (30 min)

```bash
# Instalar Squoosh CLI
npm install -D @squoosh/cli

# Convertir imágenes
npx @squoosh/cli \
  --webp auto \
  --resize '{"enabled":true,"width":1920}' \
  src/assets/foto_hermosillo.jpg

# Resultado esperado:
# 172KB → ~80KB (53% reducción)
```

Actualizar componente:
```tsx
<picture>
  <source srcset="foto_hermosillo.webp" type="image/webp" />
  <img src="foto_hermosillo.jpg" alt="..." />
</picture>
```

---

### Priority 2: PWA Support (1 hora)

```bash
# Instalar plugin
npm install -D vite-plugin-pwa

# vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

plugins: [
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'HMObility Safe Streets',
      short_name: 'HMObility',
      theme_color: '#2563eb',
      icons: [...]
    }
  })
]
```

**Beneficios:**
- ✅ Funcionamiento offline
- ✅ Instalable en móviles
- ✅ Service worker automático
- ✅ Caché inteligente

---

### Priority 3: Error Monitoring (30 min)

```bash
# Instalar Sentry
npm install @sentry/react

# main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
});
```

**Beneficios:**
- 🐛 Tracking de errores en producción
- 📊 Performance monitoring
- 🎥 Session replay para debugging
- 📧 Alertas automáticas

---

### Priority 4: Testing Suite (2 horas)

```bash
# Instalar Vitest
npm install -D vitest @testing-library/react @testing-library/jest-dom

# vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
})
```

Ejemplo de test:
```typescript
// HeroSection.test.tsx
import { render, screen } from '@testing-library/react';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  it('renders title correctly', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading')).toHaveTextContent('Sistema Operativo');
  });
});
```

---

### Priority 5: Lighthouse CI (1 hora)

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci && npm run build
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://hmobility.lovable.app
          uploadArtifacts: true
```

**Beneficios:**
- ✅ Performance regression detection
- ✅ Automated reports en PRs
- ✅ Historical tracking

---

## 🎨 Design System

### Componentes Base (shadcn/ui)
```
60+ componentes disponibles:
✅ Button, Input, Select
✅ Dialog, Sheet, Drawer
✅ Card, Badge, Alert
✅ Tabs, Accordion, Tooltip
✅ Chart components (Recharts)
```

### Paleta de Colores
```css
--primary: 222.2 47.4% 11.2%
--secondary: 210 40% 96.1%
--accent: 210 40% 96.1%
--destructive: 0 84.2% 60.2%
--muted: 210 40% 96.1%
```

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

---

## 🔍 Debugging Tips

### Build Analysis

```bash
# Visualizar composición del bundle
npm run build:analyze

# Output: Gráfico interactivo en browser
# Identifica dependencias pesadas
```

### Performance Profiling

```typescript
// En DevTools > Performance
// Grabar interacción con sitio
// Buscar long tasks (>50ms)
// Identificar componentes lentos
```

### Bundle Size Analysis

```bash
# Ver tamaño real de chunks
ls -lh dist/assets/

# Verificar compresión gzip
gzip -k dist/assets/*.js
ls -lh dist/assets/*.gz
```

---

## 📝 Checklist Pre-Deploy

### Code Quality
- [ ] `npm run type-check` sin errores
- [ ] `npm run lint` sin warnings críticos
- [ ] `npm run build` exitoso
- [ ] `npm run preview` funciona correctamente

### Environment Variables
- [ ] `.env.local` no commiteado
- [ ] Variables en Vercel configuradas
- [ ] API keys en environment, no hardcoded

### Content
- [ ] README.md actualizado
- [ ] CHANGELOG.md con nueva versión
- [ ] Comentarios de código relevantes
- [ ] TODOs resueltos o documentados

### Testing
- [ ] Testing manual en todas las rutas
- [ ] Responsive en móvil y desktop
- [ ] Funcionalidad de mapas verificada
- [ ] Chatbot respondiendo correctamente

### Performance
- [ ] Lighthouse score >90 en todas las categorías
- [ ] Imágenes optimizadas (<200KB)
- [ ] Bundle size <500KB inicial
- [ ] Time to Interactive <3s

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Limpiar cache
npm run clean
rm -rf node_modules
npm install
npm run build
```

### TypeScript Errors

```bash
# Verificar errores
npm run type-check

# Si es error de tipos de paquete
npm install -D @types/[package-name]
```

### Large Bundle Warning

```bash
# Si chunk > 600KB:
# 1. Verificar si es necesario
npm run build:analyze

# 2. Considerar dynamic imports
const Component = lazy(() => import('./Heavy'));

# 3. Revisar dependencias
npm ls [package-name]
```

### Slow Build Times

```bash
# Verificar caché
ls -la node_modules/.vite/

# Limpiar y reconstruir
npm run clean
npm run build

# Si persiste, verificar hardware:
# SSD recomendado, 8GB+ RAM
```

---

## 📚 Recursos Adicionales

### Documentación
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Bundle Analyzer](https://www.npmjs.com/package/vite-bundle-visualizer)

### Community
- [GitHub Repo](https://github.com/helenaMGV/hmobility-safe-streets)
- [Vercel Deployment](https://hmobility.lovable.app)

---

*Última actualización: 18 de Noviembre 2025*
