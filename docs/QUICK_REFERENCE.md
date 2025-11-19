# 🚀 Guía Rápida de Optimización - HMObility v3.3.0

## Para Desarrolladores

### 🔥 Hot Tips

1. **Usa el logger centralizado**
```typescript
// ❌ NO HACER
console.log('Error:', err);

// ✅ HACER
import { logger } from '@/lib/logger';
logger.error('Error loading data', { component: 'MapPage', error: err });
```

2. **Valida datos con Zod**
```typescript
// ❌ NO HACER
const data = await res.json();
setAccidents(data);

// ✅ HACER
import { validateData, accidentDataSchema } from '@/lib/validation';
const validated = validateData(accidentDataSchema, data);
if (validated) setAccidents(validated);
```

3. **Lazy load todo lo que puedas**
```typescript
// ✅ Ya implementado en App.tsx
const MapPage = lazy(() => import('./pages/MapPage'));
```

---

## Para Despliegue

### Checklist Pre-Deploy

```bash
# 1. Build local
npm run build

# 2. Preview
npm run preview

# 3. Type check
npm run type-check

# 4. Lint
npm run lint:fix

# 5. Audit
npm run audit

# 6. Deploy
vercel --prod
```

### Variables de Entorno

```bash
# Vercel Dashboard → Settings → Environment Variables
VITE_API_URL=https://hmobility.vercel.app/api
OPENAI_API_KEY=sk-...
```

---

## Performance Tips

### 1. Bundle Size
```bash
# Analizar bundle
npm run build:analyze

# Meta: Mantener <200KB gzipped
# Actual: 150KB ✅
```

### 2. Imágenes
```typescript
// Lazy loading automático con native loading
<img src="..." loading="lazy" alt="..." />
```

### 3. Code Splitting
```typescript
// Ya implementado con React.lazy()
// Cada ruta se carga on-demand
```

---

## Seguridad Checklist

```markdown
✅ CSP configurado (lib/config.ts)
✅ Validación Zod (lib/validation.ts)
✅ Sanitización XSS (sanitizeInput)
✅ CORS configurado (backend)
✅ Rate limiting (10s timeout)
✅ Secure headers (vercel.json)
✅ HTTPS only (Vercel auto)
```

---

## Monitoreo (Roadmap)

### Sentry Setup
```typescript
// 1. Install
npm install @sentry/react

// 2. Init en main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "...",
  environment: "production",
  tracesSampleRate: 0.1,
});

// 3. Wrap App con ErrorBoundary
<Sentry.ErrorBoundary fallback={ErrorFallback}>
  <App />
</Sentry.ErrorBoundary>
```

---

## Testing (Próximo Sprint)

### Setup
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### Ejemplo Test
```typescript
// src/__tests__/OSMLayerControl.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import OSMLayerControl from '../components/OSMLayerControl';

describe('OSMLayerControl', () => {
  it('toggles layers when switches clicked', () => {
    render(<OSMLayerControl />);
    const semaforosSwitch = screen.getByLabelText(/Semáforos/i);
    
    expect(semaforosSwitch).not.toBeChecked();
    fireEvent.click(semaforosSwitch);
    expect(semaforosSwitch).toBeChecked();
  });
});
```

---

## Git Workflow

```bash
# 1. Feature branch
git checkout -b feature/nueva-funcionalidad

# 2. Commits semánticos
git commit -m "feat: agregar nueva funcionalidad X"
git commit -m "fix: corregir bug en componente Y"
git commit -m "docs: actualizar README con Z"

# 3. Push
git push origin feature/nueva-funcionalidad

# 4. Pull Request
# → GitHub → New PR
```

### Conventional Commits
```
feat:     Nueva funcionalidad
fix:      Bug fix
docs:     Documentación
style:    Formato (sin cambios de código)
refactor: Refactorización
perf:     Mejora de performance
test:     Tests
chore:    Tareas de mantenimiento
```

---

## Útiles Comandos

```bash
# Dev con hot reload
npm run dev

# Build optimizado
npm run build

# Analizar bundle
npm run build:analyze

# Type checking
npm run type-check

# Lint con auto-fix
npm run lint:fix

# Limpiar cache
npm run clean

# Audit de seguridad
npm run audit
npm run audit:fix

# Preview del build
npm run preview
```

---

## Estructura Recomendada para Nuevos Componentes

```typescript
// src/components/MiComponente.tsx

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface MiComponenteProps {
  title: string;
  onAction?: () => void;
}

export default function MiComponente({ title, onAction }: MiComponenteProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    logger.debug('MiComponente mounted', { title });
    
    return () => {
      logger.debug('MiComponente unmounted');
    };
  }, [title]);

  const handleClick = () => {
    try {
      // Lógica
      onAction?.();
    } catch (err) {
      logger.error('Error in MiComponente', { error: err });
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={handleClick}>Acción</button>
    </div>
  );
}
```

---

## Links Útiles

- **Docs shadcn/ui**: https://ui.shadcn.com
- **Leaflet Docs**: https://leafletjs.com
- **Zod Docs**: https://zod.dev
- **Recharts**: https://recharts.org
- **Vite**: https://vitejs.dev
- **React Router**: https://reactrouter.com

---

## Contacto y Soporte

- **GitHub**: [@helenaMGV](https://github.com/helenaMGV)
- **Docs**: `/docs` folder
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

<div align="center">

**Happy Coding! 🚀**

</div>
