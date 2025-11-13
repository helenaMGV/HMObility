# HMObility Safe Streets 🚦

> Plataforma web para la visualización de accidentes viales y consulta del Reglamento de Tránsito de Hermosillo, Sonora.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6?logo=typescript)]()

## 🌟 Características

- 🗺️ **Mapa Interactivo**: Visualización de accidentes viales en Hermosillo con datos georreferenciados
- 🤖 **Chatbot Inteligente**: Consulta el Reglamento de Tránsito 2025 con búsqueda avanzada
- 📊 **Dashboard de Estadísticas**: Análisis de datos de accidentes por tipo, zona y fecha
- 🎮 **Juego Educativo**: Aprende sobre seguridad vial de forma interactiva
- 📱 **Diseño Responsivo**: Optimizado para móviles, tablets y escritorio
- ♿ **Accesible**: Cumple con estándares WCAG 2.1 AA

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm
- Python 3.10+ (para el backend del chatbot)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/helenaMGV/hmobility-safe-streets.git
cd hmobility-safe-streets

# 2. Instalar dependencias del frontend
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Configurar backend del chatbot (opcional)
cd backend
python3.12 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# 5. Iniciar desarrollo
npm run dev

# 6. (Opcional) En otra terminal, iniciar backend
cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000
```

Visita **http://localhost:8080**

## 🛠️ Tecnologías

- **React 18.3** + **TypeScript 5.8** - Framework UI con type safety
- **Vite 5.4** - Build tool ultrarrápido
- **Tailwind CSS 3.4** + **shadcn/ui** - Sistema de diseño moderno
- **React Router 6** - Navegación SPA
- **Leaflet** - Mapas interactivos
- **Recharts** - Visualizaciones de datos
- **FastAPI** - Backend Python para chatbot
- **TanStack Query** - Gestión de estado asíncrono

## 📊 Funcionalidades Principales

### 🗺️ Mapa de Accidentes
- Visualización georreferenciada de 800+ accidentes
- Filtros por fecha, tipo y gravedad
- Heatmap de zonas de riesgo
- Estadísticas en tiempo real

### 🤖 Chatbot del Reglamento
- 296 artículos del Reglamento de Tránsito 2025
- Búsqueda inteligente por palabras clave
- Modo backend + fallback local
- Respuestas con fundamento legal

### 📈 Dashboard de Estadísticas
- Gráficas interactivas con Recharts
- Análisis temporal y geográfico
- Comparativas por tipo de accidente
- Exportación de datos

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
vercel --prod
```

### Build Manual
```bash
npm run build
# Archivos en dist/
```

Ver documentación completa en [CONTRIBUTING.md](CONTRIBUTING.md)

## 📚 Documentación

- [Audit Report](AUDIT_REPORT.md) - Reporte completo de auditoría y mejoras
- [Contributing Guide](CONTRIBUTING.md) - Guía para contribuir
- [Backend README](backend/README.md) - Documentación del API

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Lee nuestra [guía de contribución](CONTRIBUTING.md).

## 📄 Licencia

MIT License

## 🙏 Créditos

Desarrollado para mejorar la seguridad vial en Hermosillo, Sonora.

---

**Nota**: Proyecto educativo/informativo. Los datos pueden no reflejar la situación completa.
