# 🚀 Guía de Deployment - HMObility v4.0.0

## Checklist Pre-Deployment

### 1. Configuración de Variables de Entorno
```bash
# Copia el ejemplo
cp .env.example .env.local

# Edita con tus claves reales
nano .env.local
```

**Variables críticas para producción:**
```env
# Analytics (CRÍTICO para Sprint 1)
VITE_MIXPANEL_TOKEN=tu_token_real
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true

# Features
VITE_ENABLE_WORKERS=true
VITE_ENABLE_SW=true
VITE_DEBUG_MODE=false

# API
VITE_API_URL=/api
```

### 2. Build Local
```bash
# Verificar que compila sin errores
npm run build

# Preview del build
npm run preview
```

### 3. Tests de Calidad
```bash
# Lint
npm run lint

# Tests (si existen)
npm run test
```

---

## Deployment en Vercel (Recomendado)

### Opción 1: Deploy via GitHub

1. **Conectar Repositorio**
   ```
   1. Ve a https://vercel.com
   2. Click "New Project"
   3. Importar desde GitHub: helenaMGV/hmobility-safe-streets
   4. Click "Import"
   ```

2. **Configurar Variables de Entorno**
   ```
   En Vercel Dashboard:
   Settings → Environment Variables
   
   Agregar:
   - VITE_MIXPANEL_TOKEN
   - VITE_GA_MEASUREMENT_ID
   - VITE_ENABLE_ANALYTICS=true
   - (todas las demás de .env.example)
   ```

3. **Configurar Build Settings**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Node Version: 18.x
   ```

4. **Deploy**
   ```
   Click "Deploy"
   Esperar 2-3 minutos
   ✅ Live en: https://tu-proyecto.vercel.app
   ```

### Opción 2: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (primera vez)
vercel

# Deploy a producción
vercel --prod
```

---

## Deployment en Netlify

1. **Conectar Repositorio**
   ```
   1. Ve a https://netlify.com
   2. Click "New site from Git"
   3. Conectar GitHub
   4. Seleccionar repositorio
   ```

2. **Configurar Build**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Variables de Entorno**
   ```
   Site settings → Environment Variables
   Agregar todas las variables de .env.example
   ```

4. **Deploy**
   ```
   Click "Deploy site"
   ✅ Live en: https://tu-proyecto.netlify.app
   ```

---

## Configuración Post-Deployment

### 1. Configurar Mixpanel

1. **Crear Proyecto**
   ```
   1. Ve a https://mixpanel.com
   2. Create Project → Nombre: "HMObility"
   3. Copiar Project Token
   ```

2. **Agregar Token a Vercel**
   ```
   Vercel Dashboard → Settings → Environment Variables
   VITE_MIXPANEL_TOKEN = [tu_token]
   ```

3. **Redeploy**
   ```bash
   # Trigger redeploy para aplicar variables
   vercel --prod
   ```

4. **Verificar en Mixpanel**
   ```
   Mixpanel Dashboard → Events → Live View
   Abre tu sitio → Verás eventos en tiempo real
   ```

### 2. Configurar Google Analytics 4

1. **Crear Propiedad**
   ```
   1. Ve a https://analytics.google.com
   2. Admin → Create Property
   3. Nombre: "HMObility"
   4. Copiar Measurement ID (G-XXXXXXXXXX)
   ```

2. **Agregar a Vercel**
   ```
   VITE_GA_MEASUREMENT_ID = G-XXXXXXXXXX
   ```

3. **Verificar**
   ```
   GA4 Dashboard → Reports → Realtime
   Abre tu sitio → Verás usuarios activos
   ```

### 3. Configurar Dominio Personalizado (Opcional)

#### En Vercel:
```
1. Settings → Domains
2. Add Domain → hmobility.mx
3. Configurar DNS:
   - Tipo: A
   - Nombre: @
   - Valor: 76.76.21.21
   
   - Tipo: CNAME
   - Nombre: www
   - Valor: cname.vercel-dns.com
```

#### En tu Registrador de Dominios:
```
Agregar registros DNS según instrucciones de Vercel
Esperar propagación (hasta 48 horas)
```

---

## Configuración de PWA

### 1. Verificar Service Worker

```bash
# En producción, abre DevTools
Application → Service Workers
✅ Debe aparecer: sw.js activo

# Verificar precaching
Application → Cache Storage
✅ Debe haber ~60 recursos cacheados
```

### 2. Test de Instalación

```
1. Abre el sitio en Chrome móvil
2. Menú → "Agregar a pantalla de inicio"
3. ✅ Debe aparecer ícono en home screen
4. Abrir desde ícono → fullscreen sin barra de navegador
```

### 3. Lighthouse Audit

```bash
# En Chrome DevTools
Lighthouse → Generate report
✅ PWA score debe ser 95+
```

---

## Monitoreo y Analytics

### 1. Mixpanel Dashboards

**Crear Dashboard de KPIs:**
```
Mixpanel → Boards → Create Board

Agregar gráficas:
1. Daily Active Users (DAU)
2. Events per Session
3. Onboarding Completion Rate
4. Help Center Usage
5. Top 10 Pages
6. Conversion Funnel
```

**Configurar Alerts:**
```
Mixpanel → Alerts → Create Alert

Ejemplos:
- DAU baja más de 20%
- Error rate > 1%
- Onboarding abandonment > 30%
```

### 2. Google Analytics Dashboards

**Configurar Goals:**
```
GA4 → Admin → Events → Create Event

Conversiones:
- report_submitted (ciudadano reporta)
- game_completed (completa juego)
- data_downloaded (descarga datos)
- onboarding_completed (completa tour)
```

**Configurar Informes Personalizados:**
```
GA4 → Explore → Create new exploration

Análisis:
1. User engagement por portal
2. Mobile vs Desktop performance
3. Feature adoption rate
4. Page speed by device
```

### 3. Error Tracking (Opcional - Sentry)

```bash
# Instalar Sentry
npm install @sentry/react

# Configurar en main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});

# Agregar DSN a Vercel
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## Testing en Producción

### 1. Smoke Tests

```
✅ Homepage carga correctamente
✅ Mega Menu funciona
✅ Mapa se renderiza
✅ Bottom Navigation visible en móvil
✅ Onboarding aparece en primera visita
✅ Centro de Ayuda abre
✅ Notificaciones funcionan
✅ Simulaciones corren sin lag (60 FPS)
✅ Analytics trackea eventos (verificar en Mixpanel)
✅ PWA se puede instalar
```

### 2. Tests de Performance

```bash
# PageSpeed Insights
https://pagespeed.web.dev/
Analizar: https://tu-dominio.vercel.app

Targets:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100
```

### 3. Tests Multi-Dispositivo

**Desktop:**
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

**Mobile:**
- ✅ Chrome Android
- ✅ Safari iOS
- ✅ Samsung Internet
- ✅ Firefox Mobile

**Tablets:**
- ✅ iPad
- ✅ Android Tablet

---

## Rollback Plan

### Si algo sale mal:

**Opción 1: Revert en Vercel**
```
1. Deployments → Ver todas
2. Encontrar deployment anterior estable
3. Click "..." → "Promote to Production"
```

**Opción 2: Revert via Git**
```bash
# Revertir último commit
git revert HEAD
git push origin main

# Vercel auto-deploya
```

**Opción 3: Rollback de Variable**
```
Si el problema es una variable:
1. Vercel → Settings → Environment Variables
2. Editar variable problemática
3. Redeploy
```

---

## Maintenance Mode (Opcional)

### Crear página de mantenimiento:

```typescript
// src/pages/Maintenance.tsx
export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          🔧 En Mantenimiento
        </h1>
        <p className="text-xl text-muted-foreground">
          Volveremos pronto. Gracias por tu paciencia.
        </p>
      </div>
    </div>
  );
}
```

### Activar vía variable de entorno:

```env
VITE_MAINTENANCE_MODE=true
```

```typescript
// App.tsx
if (import.meta.env.VITE_MAINTENANCE_MODE === 'true') {
  return <Maintenance />;
}
```

---

## Optimizaciones Post-Launch

### 1. CDN y Caching

**Vercel** ya incluye CDN global, pero puedes optimizar:

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Image Optimization

```bash
# Si usas imágenes grandes
npm install sharp

# Optimizar automáticamente en build
npm run build
```

### 3. Analytics Sampling (Para reducir costos)

```typescript
// analytics.ts
const sampleRate = import.meta.env.PROD ? 0.5 : 1.0; // 50% en prod

if (Math.random() > sampleRate) return;
// trackear evento
```

---

## 📊 Métricas de Éxito

### Semana 1 Post-Launch
- [ ] 100+ usuarios activos
- [ ] 85%+ completion rate de onboarding
- [ ] <1% error rate
- [ ] 60 FPS en simulaciones
- [ ] Lighthouse score 95+

### Mes 1 Post-Launch
- [ ] 1,000+ usuarios activos
- [ ] 50+ reportes ciudadanos
- [ ] 500+ sesiones de juego
- [ ] 100+ descargas de datos
- [ ] NPS score >40

### Trimestre 1
- [ ] 5,000+ usuarios activos
- [ ] Integración con gobierno
- [ ] Feature requests prioritizados
- [ ] Roadmap público
- [ ] Comunidad activa

---

## 🆘 Troubleshooting

### Build falla en Vercel

**Error:** "Module not found"
```bash
# Solución: Verificar imports
npm run build # local
# Si funciona local, verificar Node version en Vercel
```

**Error:** "Out of memory"
```bash
# Aumentar límite en vercel.json
{
  "builds": [{
    "src": "package.json",
    "use": "@vercel/static-build",
    "config": {
      "maxLambdaSize": "50mb"
    }
  }]
}
```

### Analytics no funciona

1. Verificar variables en Vercel
2. Abrir DevTools → Console
3. Buscar errores de Mixpanel/GA
4. Verificar que `VITE_ENABLE_ANALYTICS=true`

### PWA no se instala

1. Verificar manifest.json
2. Service Worker registrado correctamente
3. HTTPS habilitado (requerido para PWA)
4. Lighthouse → PWA audit

### Performance degradado

1. Verificar Web Workers activos
2. Lighthouse audit
3. Bundle analyzer: `npm run build:analyze`
4. Reducir dependencias grandes

---

## 📞 Contacto de Soporte

**Equipo HMObility:**
- 📧 tech@hmobility.mx
- 💬 Slack: #hmobility-tech
- 🐛 GitHub Issues

**Vercel Support:**
- 📖 https://vercel.com/docs
- 💬 https://vercel.com/support

**Emergency Hotline:**
- 🚨 +52 662-XXX-XXXX (24/7)

---

## ✅ Final Checklist

Antes de hacer el deploy final:

- [ ] Variables de entorno configuradas
- [ ] Build local exitoso
- [ ] Tests pasando
- [ ] Mixpanel token válido
- [ ] GA4 ID configurado
- [ ] Dominio apuntando correctamente (si aplica)
- [ ] Service Worker funcionando
- [ ] Lighthouse score >90
- [ ] README actualizado
- [ ] CHANGELOG publicado
- [ ] Equipo notificado
- [ ] Rollback plan listo

---

**¡Listo para el lanzamiento! 🚀**

Deploy: `vercel --prod`
