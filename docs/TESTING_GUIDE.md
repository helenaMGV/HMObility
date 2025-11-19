# 🧪 Testing Guide - HMObility v3.3.0

## ✅ Estado Actual del Testing

**Test Suite Completo**: 25/25 tests pasando ✅

```bash
Test Files  5 passed (5)
Tests       25 passed (25)
Duration    ~3s
```

---

## 📊 Cobertura por Módulo

### Components (9 tests)
- **OSMLayerControl** (7 tests) ✅
  - Rendering del panel de control
  - Toggles de capas (semáforos, cruces, ciclovías, calles)
  - Estados checked/unchecked
  - Visibilidad de layers
  - Estilos y estructura

- **AccidentsMap** (2 tests) ✅
  - Module import validation
  - React component structure

### Libraries (16 tests)
- **Logger** (6 tests) ✅
  - Debug, info, warn, error levels
  - Metadata injection
  - Timestamps
  - Console output formatting

- **Validation** (7 tests) ✅
  - Zod schema validation
  - AccidentData schema
  - Array validation
  - Required fields enforcement
  - Coordinate range validation

- **Formatters** (3 tests) ✅
  - Date formatting
  - Time extraction
  - Number formatting

---

## 🚀 Ejecutar Tests

### Comandos Disponibles

```bash
# Run tests (watch mode)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Coverage Report

```bash
npm run test:coverage
```

**Meta de Cobertura**: >80% (configurado en `vitest.config.ts`)

Thresholds:
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

---

## 📁 Estructura de Tests

```
src/
├── test/
│   ├── setup.ts          # Configuración global (mocks, cleanup)
│   └── utils.tsx         # Custom render con providers
│
├── components/
│   └── __tests__/
│       ├── OSMLayerControl.test.tsx
│       └── AccidentsMap.test.tsx
│
└── lib/
    └── __tests__/
        ├── logger.test.ts
        ├── validation.test.ts
        └── formatters.test.ts
```

---

## 🛠️ Configuración (vitest.config.ts)

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 🎯 Mocks Configurados

### Global Mocks (src/test/setup.ts)

1. **window.matchMedia**
   ```typescript
   Object.defineProperty(window, 'matchMedia', {
     writable: true,
     value: vi.fn().mockImplementation((query) => ({
       matches: false,
       media: query,
       // ... otros métodos
     })),
   });
   ```

2. **IntersectionObserver**
   ```typescript
   global.IntersectionObserver = class IntersectionObserver {
     constructor() {}
     disconnect() {}
     observe() {}
     // ...
   } as any;
   ```

3. **ResizeObserver**
   ```typescript
   global.ResizeObserver = class ResizeObserver {
     constructor() {}
     disconnect() {}
     observe() {}
     // ...
   } as any;
   ```

4. **Leaflet**
   ```typescript
   vi.mock('leaflet', () => ({
     default: {
       map: vi.fn(),
       tileLayer: vi.fn(),
       marker: vi.fn(),
       circleMarker: vi.fn(() => ({
         addTo: vi.fn(),
         bindPopup: vi.fn(),
         on: vi.fn(),
       })),
       Icon: {
         Default: {
           prototype: { _getIconUrl: vi.fn() },
           mergeOptions: vi.fn(),
         },
       },
       // ... más métodos
     },
   }));
   ```

5. **react-leaflet**
   ```typescript
   vi.mock('react-leaflet', () => ({
     MapContainer: vi.fn(({ children }) => children),
     TileLayer: vi.fn(() => null),
     Marker: vi.fn(({ children }) => children),
     Popup: vi.fn(({ children }) => children),
     useMap: vi.fn(() => ({
       addLayer: vi.fn(),
       removeLayer: vi.fn(),
       fitBounds: vi.fn(),
     })),
     GeoJSON: vi.fn(() => null),
   }));
   ```

---

## 📝 Escribir Nuevos Tests

### Ejemplo: Test de Componente

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import { fireEvent } from '@testing-library/react';
import MiComponente from '@/components/MiComponente';

describe('MiComponente', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<MiComponente title="Test" />);
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    render(<MiComponente />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    expect(button).toHaveClass('active');
  });
});
```

### Ejemplo: Test de Utilidad

```typescript
import { describe, it, expect } from 'vitest';
import { miUtilidad } from '@/lib/miUtilidad';

describe('miUtilidad', () => {
  it('transforms data correctly', () => {
    const input = { foo: 'bar' };
    const output = miUtilidad(input);
    
    expect(output).toEqual({ foo: 'BAR' });
  });

  it('handles edge cases', () => {
    expect(miUtilidad(null)).toBeNull();
    expect(miUtilidad(undefined)).toBeUndefined();
  });
});
```

---

## 🔍 Testing Libraries Usadas

### Core
- **vitest**: ^4.0.10 - Test runner (más rápido que Jest para Vite)
- **jsdom**: Simula entorno browser en Node

### React Testing
- **@testing-library/react**: Render y queries de componentes
- **@testing-library/jest-dom**: Matchers adicionales (toBeInTheDocument, etc.)
- **@testing-library/user-event**: Simulación avanzada de eventos de usuario

### UI
- **@vitest/ui**: Interfaz web para ejecutar y visualizar tests

---

## 📈 Roadmap de Testing

### ✅ Fase 1 - Completada
- [x] Configurar Vitest + React Testing Library
- [x] Setup de mocks globales
- [x] Tests de componentes críticos (OSMLayerControl, AccidentsMap)
- [x] Tests de utilidades (logger, validation, formatters)
- [x] 25 tests pasando

### 🎯 Fase 2 - Próxima (Sprint 2)
- [ ] Tests para GamePage y juegos educativos
- [ ] Tests de integración para flujos completos
- [ ] Aumentar cobertura a >80%

### 🔮 Fase 3 - Futura (Sprint 3-4)
- [ ] E2E tests con Playwright
- [ ] Visual regression tests
- [ ] Performance tests
- [ ] Accessibility tests (a11y)

---

## 🐛 Debugging Tests

### Ver tests en UI

```bash
npm run test:ui
```

Abre http://localhost:51204/__vitest__/

### Ver output detallado

```bash
npm test -- --reporter=verbose
```

### Ejecutar un solo archivo

```bash
npm test -- OSMLayerControl.test.tsx
```

### Ejecutar un solo test

```bash
npm test -- -t "renders the control panel"
```

---

## ⚡ Performance

**Tiempo de Ejecución**:
- Test Files: ~3s para 5 archivos
- Individual: <500ms por archivo
- Setup: ~2s (mocks, providers)

**Optimizaciones aplicadas**:
- ✅ Mocks eficientes de Leaflet
- ✅ Cleanup automático después de cada test
- ✅ Parallel test execution (por defecto en Vitest)
- ✅ Cache de módulos

---

## 📚 Recursos

- [Vitest Docs](https://vitest.dev)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

## 🎯 Best Practices

1. **AAA Pattern**: Arrange, Act, Assert
2. **Descriptive test names**: Describe el comportamiento, no la implementación
3. **One assertion per test**: Facilita debugging
4. **Mock external dependencies**: API calls, localStorage, etc.
5. **Test user behavior**: No internal implementation details
6. **Use data-testid sparingly**: Prefer accessible queries (getByRole, getByLabelText)
7. **Keep tests isolated**: No dependencies entre tests

---

<div align="center">

**Tests: 25/25 ✅ | Coverage: En progreso | Status: Production Ready**

</div>
