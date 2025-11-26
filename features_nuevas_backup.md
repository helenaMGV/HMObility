# HMObility v4.0.1 - Registro de Mejoras Implementadas

**Última actualización:** 25 de noviembre de 2025  
**Versión:** 4.0.1  
**Estado:** Producción

---

## 🎯 Visión General

HMObility Safe Streets es una **plataforma premium de movilidad urbana inteligente** que combina:
- 🗺️ Gemelo digital de Hermosillo con datos en tiempo real
- 🤖 IA predictiva para optimización de rutas y seguridad vial
- ♿ Accesibilidad WCAG 2.1 AAA
- 📊 Dashboard personalizable con widgets drag & drop
- 🎮 Gamificación educativa

**Stack Tecnológico:**
- **Frontend:** React 18.3 + TypeScript 5.8 + Vite 5.4
- **UI/UX:** Tailwind CSS 3.4 + shadcn/ui + Framer Motion
- **Mapas:** Leaflet + OpenStreetMap + Heatmaps
- **Gráficas:** Recharts + Chart.js
- **State:** TanStack Query + Context API
- **Backend:** Python serverless (Vercel Functions)
- **Analytics:** Mixpanel + Google Analytics 4

---

## 0. Convenciones para Copilot

En todas las features:

- **Mantener stack actual** (no Mapbox, no logins reales, no pagos, no IoT).
- Usar:
  - Rutas en `src/pages/` (React Router, `Index.tsx`).
  - Componentes en `src/components/`.
  - Datos en `public/datajson/` y `src/data/` (JSON mocks).
- Cuando se mencione “crear JSON nuevo”, asumir que va en:
  - `public/datajson/*.json` (datasets geográficos, series de tiempo).
  - `src/data/*.json` (catálogos, preguntas, textos).

Para cada feature se especifica: **Descripción**, **Se monta sobre**, **Archivos nuevos / cambios**.

---

## 1. Seguridad vial y reglamento (encima de mapa, chatbot, calculadora, juego)

### 1. Radar de infracciones por artículo del Reglamento

**Descripción**  
Vista que agrupa siniestros y/o registros por **artículos clave del Reglamento de Tránsito** (alcohol, velocidad, celular, ciclovía, cinturón, peatón, etc.) y muestra:

- Top 10 artículos más violados.
- Gráficas por año / severidad / modo.

**Se monta sobre**

- `src/components/Dashboard.tsx`
- `src/components/Statistics.tsx`
- `src/components/QuickStats.tsx`
- `src/data/reglamento.json`
- Datos actuales de accidentes en `public/datajson/` (usar campo de tipo de accidente o un campo derivado).

**Archivos nuevos / cambios**

- Nuevo JSON: `src/data/reglamento_articulos_clave.json`  
  - Estructura sugerida: `[{ "id": "art_XX", "tema": "alcohol", "descripcion_corta": "...", "severidad": "alta" }, ...]`
- Nueva sección/componente: `src/components/RadarInfracciones.tsx`
- Integrar `RadarInfracciones` en una nueva pestaña o sección dentro de `Dashboard.tsx`  
  (por ejemplo: “Seguridad → Radar de infracciones”).

---

### 2. Planeador de operativos de alcoholímetro

**Descripción**  
Mapa que sugiere **puntos y horarios** para operativos de alcoholímetro según:

- Densidad de siniestros nocturnos / fines de semana.
- Tipo de siniestro (choques por probable alcohol).

**Se monta sobre**

- `src/components/AccidentsMap.tsx`
- `src/pages/MapPage.tsx`
- `Dashboard.tsx` (nueva pestaña tipo “Operativos”).

**Archivos nuevos / cambios**

- Nuevo JSON: `public/datajson/operativos_alcoholimetro_sugeridos.json`  
  - Mock con: coordenadas, horario sugerido, día de semana, nivel de prioridad.
- Nuevo componente: `src/components/OperativosAlcoholimetroMap.tsx`  
  - Reutilizar lógica de `AccidentsMap.tsx` con otra capa.
- Nueva vista en dashboard: `src/components/OperativosPanel.tsx`  
  - Cards + tabla con detalle de puntos sugeridos.

---

### 3. Planeador de operativos de velocidad y celular

**Descripción**  
Vista que marca **corredores críticos** donde:

- Hay concentración de choques relacionados con exceso de velocidad o distracción (ej. uso de celular).
- Sugiere tramos y horarios para radares o patrullas.

**Se monta sobre**

- `AccidentsMap.tsx`
- `SpeedMap.tsx` (extender)
- `Statistics.tsx` (curvas por hora del día)

**Archivos nuevos / cambios**

- Nuevo JSON: `public/datajson/corredores_criticos_velocidad.json`  
  - Cada registro: tramo (polyline), nivel de riesgo, horas pico.
- Nuevo componente: `src/components/VelocidadOperativosView.tsx`
- Integrar como subpestaña en dashboard (por ejemplo, `/dashboard/seguridad`).

---

### 4. Mapa dinámico de límites de velocidad y “calles 30”

**Descripción**  
Capa en el mapa que muestra:

- Límites de velocidad actuales por tramo.
- Simulación de escenario con **“calles 30 km/h”** en zonas escolares / hospitalarias / residenciales.

**Se monta sobre**

- `SpeedMap.tsx`
- `MapPage.tsx`

**Archivos nuevos / cambios**

- Nuevo JSON: `public/datajson/limites_velocidad_tramos.json`  
  - Campos: id_tramo, coords, limite_actual, limite_escenario_30, tipo_zona.
- Extender `SpeedMap.tsx` para:
  - Toggle: `actual` vs `escenario_calles_30`.
  - Leyenda de colores para límites.

---

### 5. Simulador de sanciones y puntos de licencia

**Descripción**  
Herramienta que, dado un conjunto de infracciones (simuladas), calcula:

- Multas acumuladas.
- Puntos de licencia perdidos.
- Posible suspensión (solo como texto explicativo).

**Se monta sobre**

- `src/components/FineCalculator.tsx` (extensión)
- `reglamento.json` / JSON derivado de sanciones.

**Archivos nuevos / cambios**

- Nuevo JSON: `src/data/sanciones_puntos.json`  
  - Artículo, descripción, multa base, puntos, gravedad.
- Extender `FineCalculator.tsx` para:
  - Aceptar varias infracciones.
  - Mostrar resumen: total $ y total puntos.

---

### 6. Examen teórico de tránsito estructurado (modo “formal”)

**Descripción**  
Un modo de **examen formal** (además del juego actual), con:

- Banco de preguntas con referencia a artículos del reglamento.
- Cálculo de resultado (aprobado/no aprobado).
- Listado de temas débiles por sección (alcohol, peatón, bici, etc.).

**Se monta sobre**

- `src/components/Game.tsx`
- `src/pages/GamePage.tsx`

**Archivos nuevos / cambios**

- Nuevo JSON: `src/data/examen_preguntas.json`  
  - Pregunta, opciones, respuesta correcta, artículo_id, tema.
- Extender `Game.tsx` para tener modo:
  - `modo="juego"` (actual).
  - `modo="examen"` (nuevo, con flujo tipo examen).
- `GamePage.tsx`: agregar toggles para elegir modo.

---

### 7. Tablero Visión Cero Hermosillo

**Descripción**  
Subsección del dashboard con KPIs alineados a Visión Cero:

- Muertes por año, lesiones graves, por modo.
- Progreso hacia metas (ej. reducción anual).
- Indicadores por colonia o corredores principales.

**Se monta sobre**

- `Dashboard.tsx`
- `QuickStats.tsx`
- `Statistics.tsx`

**Archivos nuevos / cambios**

- Nuevo JSON: `public/datajson/vision_cero_indicadores.json`  
  - Metas y valores históricos agregados (mock).
- Nuevo componente: `src/components/VisionCeroPanel.tsx`
- Integrar `VisionCeroPanel` en `/dashboard` (pestaña “Visión Cero”).

---

## 2. Siniestros, High Injury Network e infraestructura (encima de mapas y dashboard)

### 8. Mapa avanzado de High Injury Network (HIN)

**Descripción**  
Capa que muestra **corredores** (no solo puntos) con alta concentración de siniestros graves, con filtros por:

- Severidad.
- Modo (peatón, ciclista, moto, auto).
- Año.

**Se monta sobre**

- `AccidentsMap.tsx`
- `MapPage.tsx`

**Archivos nuevos / cambios**

- Nuevo JSON: `public/datajson/high_injury_network.json`  
  - Tramos (arrays de coordenadas) + métricas por tramo.
- Extender `AccidentsMap.tsx` con:
  - Toggle “Ver corredores críticos (HIN)”.
  - Estilos (polylines más gruesos).

---

### 9. Priorizador de cruceros y corredores peligrosos

**Descripción**  
Ranking de:

- Intersecciones.
- Corredores.

Ordenados por choques, muertes, lesiones graves.

**Se monta sobre**

- `Dashboard.tsx`
- `Statistics.tsx`
- Una nueva tabla en dashboard.

**Archivos nuevos / cambios**

- Nuevo JSON: `public/datajson/cruceros_priorizados.json`  
  - id, nombre_cruce, colonia, métricas de riesgo.
- Nuevo componente: `src/components/CrucerosPrioritariosTable.tsx`
- Integrar en dashboard, idealmente en la misma sección que HIN.

---

### 10. Inventario de activos viales urbanos

**Descripción**  
Listado y mapa de activos como:

- Postes.
- Semáforos.
- Señales.
- Topes / reductores.
- Pasos peatonales.
- Tramos de ciclovía.

Con costo unitario y responsable.

**Se monta sobre**

- `AccidentsMap.tsx` (nueva capa)
- `Dashboard.tsx` (tabla y KPIs)

**Archivos nuevos / cambios**

- Nuevo JSON: `public/datajson/activos_viales.json`  
  - id, tipo, ubicación, costo_unitario, dependencia.
- Nuevo componente: `src/components/ActivosVialesMap.tsx`
- Nuevo componente: `src/components/ActivosVialesTable.tsx`

---

### 11. Calculadora de daños a infraestructura por accidente

**Descripción**  
Permite vincular un siniestro con:

- Activos dañados.
- Estimar costo total.

Y acumular costos por periodo.

**Se monta sobre**

- Vista de detalle de accidente (componente nuevo).
- Datos de `activos_viales.json`.

**Archivos nuevos / cambios**

- Nuevo componente: `src/components/AccidentDetailModal.tsx`  
  - Recibe datos del accidente y permite seleccionar activos dañados.
- Nueva lógica simple para sumar costos y mostrar totales en dashboard.

---

### 12. Priorizador de inversión en cruces/corredores seguros

**Descripción**  
Ranking de lugares donde **más conviene invertir** en infraestructura segura, combinando:

- Siniestros.
- Daños a activos.
- Presencia de escuelas/hospitales.

**Se monta sobre**

- `Dashboard.tsx`
- `CrucerosPrioritariosTable.tsx` (se puede extender).
- `Statistics.tsx`.

**Archivos nuevos / cambios**

- Nuevo JSON: `public/datajson/prioridad_inversion.json`
- Nueva sección en dashboard (cards + tabla + texto recomendación).

---

### 13. Ilustrador dinámico de intervenciones (antes/después)

**Descripción**  
Componente visual que muestra:

- “Antes”: corredor sin tratamiento.
- “Después”: tope, cruce peatonal, ciclovía, reducción de carriles.

Todo como UI estática, no CAD.

**Se monta sobre**

- `Dashboard.tsx` (sección de propuestas de intervención).

**Archivos nuevos / cambios**

- Nuevo JSON: `src/data/intervenciones_escenarios.json`
- Nuevo componente: `src/components/IntervencionBeforeAfter.tsx`

---

### 14. Simulador de protocolo post-siniestro (flujo)

**Descripción**  
UI tipo “wizard” que muestra qué acciones deberían seguir después de un choque grave:

- Investigación.
- Diagnóstico de causa.
- Propuesta de intervención.
- Seguimiento.

**Se monta sobre**

- Nueva sección en dashboard (ej. `/dashboard/post-siniestro`).

**Archivos nuevos / cambios**

- Nuevo componente: `src/components/PostSiniestroFlow.tsx`
- JSON con pasos: `src/data/post_siniestro_flujo.json`

---

## 3. Transporte público y operación (tipo Ontra, sin backend complejo)

### 15. Módulo de red de transporte público

**Descripción**  
Mapa y panel de rutas de camiones:

- Recorridos.
- Frecuencias.
- KPIs básicos (km, tiempo estimado, demanda mock).

**Se monta sobre**

- Leaflet (nuevo componente de mapa).
- `Dashboard.tsx` (nueva pestaña `/dashboard/transporte`).

**Archivos nuevos / cambios**

- JSON: `public/datajson/rutas_camiones.json`
- Nuevo componente: `src/components/TransitMap.tsx`
- Nuevo componente: `src/components/TransitPanel.tsx`

---

### 16. Escenarios de red (A/B/C) de transporte

**Descripción**  
Permite comparar:

- Red actual vs Escenario A vs Escenario B.

Con cambios en rutas/frecuencias (todos mocks).

**Se monta sobre**

- `TransitMap.tsx`
- `TransitPanel.tsx`

**Archivos nuevos / cambios**

- JSON: `public/datajson/rutas_escenarios.json`
- UI: toggles/selector de escenario.

---

### 17. Simulador de demanda por franja horaria

**Descripción**  
Gráficas de demanda estimada (mock) por hora/día, con slider para ajustar frecuencia y ver impacto.

**Se monta sobre**

- `Statistics.tsx` (Recharts).
- `TransitPanel.tsx`.

**Archivos nuevos / cambios**

- JSON: `public/datajson/demanda_horaria_transporte.json`

---

### 18. Planificador de transporte para eventos especiales

**Descripción**  
Carga un **evento** (concierto, partido, feria) y:

- Muestra cierres de calles y desvíos.
- Muestra cambios simulados en rutas.

**Se monta sobre**

- Leaflet (nuevo componente `EventosMap.tsx`).
- `Dashboard.tsx` (subsección de transporte).

**Archivos nuevos / cambios**

- JSON: `public/datajson/eventos_masivos.json`
- Nuevo componente: `src/components/EventosTransportMap.tsx`

---

### 19. Panel de multimodalidad urbana

**Descripción**  
Muestra distribución de modos:

- Auto, camión, bici, peatón, moto.

Y escenarios simples de cambio.

**Se monta sobre**

- `Statistics.tsx`
- `Dashboard.tsx`

**Archivos nuevos / cambios**

- JSON: `public/datajson/distribucion_modal.json`

---

## 4. Emisiones, clima y accesibilidad

### 20. Calculadora de emisiones por padrón vehicular y corredor

**Descripción**  
Estimación simple de emisiones (CO₂, NOx, PM) por tipo de vehículo + tramo.

**Se monta sobre**

- `Dashboard.tsx` (nueva pestaña `/dashboard/emisiones`).
- `Statistics.tsx`.

**Archivos nuevos / cambios**

- JSON: `public/datajson/padron_vehicular.json`
- JSON: `src/data/factores_emision.json`
- Nuevo componente: `src/components/EmisionesPanel.tsx`

---

### 21. Mapa de emisiones por corredor

**Descripción**  
Capa en el mapa donde cada tramo tiene un color según nivel de emisiones estimadas.

**Se monta sobre**

- `AccidentsMap.tsx` o nuevo mapa en `EmisionesPanel`.

**Archivos nuevos / cambios**

- JSON: `public/datajson/emisiones_por_tramo.json`
- Lógica Leaflet para polylines coloreadas.

---

### 22. Isocronas urbanas simuladas (acceso a servicios)

**Descripción**  
Muestra zonas que se alcanzan en ~10/20/30 minutos (simulación basada en tiempos promedio por corredor). Permite:

- Ver impacto de cierres.
- Ver accesibilidad a escuelas/hospitales.

**Se monta sobre**

- Nuevo componente de mapa (e.g. `IsochronasMap.tsx`).
- Dashboard de movilidad general.

**Archivos nuevos / cambios**

- JSON: `public/datajson/tiempos_tramo.json`
- JSON: `public/datajson/isochronas_mock.json`

---

## 5. Movilidad activa, ciclovías y jóvenes

### 23. Mapa de red ciclista actual de Hermosillo

**Descripción**  
Capa que muestra:

- Ciclovías actuales (Olivares, Solidaridad, centro, etc.).
- Tipo de infraestructura.

**Se monta sobre**

- `MapPage.tsx` y `AccidentsMap.tsx` (nueva capa “Ciclovías”).

**Archivos nuevos / cambios**

- JSON: `public/datajson/red_ciclista_actual.json`

---

### 24. Planeador de red ciclista futura

**Descripción**  
Tramos sugeridos para extender la red:

- Conectando colonias, escuelas, universidades.

**Se monta sobre**

- Mapa de ciclovías (misma UI, otra capa).
- Dashboard (ranking de tramos sugeridos).

**Archivos nuevos / cambios**

- JSON: `public/datajson/red_ciclista_propuesta.json`
- `src/components/RedCiclistaPanel.tsx`

---

### 25. Rutas seguras a la escuela

**Descripción**  
Marca escuelas y rutas recomendadas (peatonales/ciclistas) con indicador de riesgo por tramo.

**Se monta sobre**

- Leaflet (nuevo componente `RutasEscolaresMap.tsx`).
- Dashboard o nueva página “Rutas escolares”.

**Archivos nuevos / cambios**

- JSON: `public/datajson/escuelas.json`
- JSON: `public/datajson/rutas_seguras_escolares.json`

---

### 26. Indicadores de movilidad no motorizada

**Descripción**  
KPIs para medir:

- Longitud de red ciclista.
- % población cerca de ciclovías.
- Siniestros de peatones/ciclistas por colonia.

**Se monta sobre**

- `Dashboard.tsx`
- `Statistics.tsx`

**Archivos nuevos / cambios**

- JSON: `public/datajson/indicadores_mov_no_motorizada.json`

---

## 6. Participación ciudadana y ciencia ciudadana

### 27. Portal de reportes ciudadanos de movilidad

**Descripción**  
Página para que una persona:

- Seleccione punto en el mapa.
- Elija tipo de problema (bache, tope mal hecho, auto en ciclovía, semáforo, etc.).
- Envíe un reporte (simulado, guardado en JSON/local).

**Se monta sobre**

- Nueva ruta: `/reportes-ciudadanos` en `Index.tsx`.
- Nuevo componente mapa: `CitizenReportsMap.tsx`.

**Archivos nuevos / cambios**

- JSON (semilla): `public/datajson/reportes_ciudadanos.json`
- Página: `src/pages/CitizenReportsPage.tsx`

---

### 28. Mapa de reportes ciudadanos

**Descripción**  
Visualización de todos los reportes:

- Iconos por tipo.
- Filtros por categoría y fecha.

**Se monta sobre**

- `CitizenReportsMap.tsx`
- `CitizenReportsPage.tsx`

**Archivos nuevos / cambios**

- Extender el mismo JSON de reportes.

---

### 29. Flujo de atención a reportes (vista gobierno)

**Descripción**  
Tablero para rol gobierno con:

- Lista de reportes.
- Estado (nuevo, en revisión, programado, resuelto).
- Filtros.

**Se monta sobre**

- Dashboard: nueva pestaña `/dashboard/ciencia-ciudadana`.

**Archivos nuevos / cambios**

- Nuevo componente: `src/components/ReportesDashboardTable.tsx`
- Campos extra en JSON `reportes_ciudadanos.json` (`status`, `fecha_status`).

---

### 30. Tablero “Seguridad vial en mi colonia”

**Descripción**  
Resumen por colonia:

- Siniestros.
- Reportes ciudadanos.
- Intervenciones (simuladas).

**Se monta sobre**

- `Dashboard.tsx`
- `Statistics.tsx`

**Archivos nuevos / cambios**

- JSON: `public/datajson/indicadores_colonia.json`
- Componente: `src/components/ColoniasSafetyPanel.tsx`

---

### 31. Gamificación ligera de participación

**Descripción**  
En la vista ciudadana:

- Puntos por reportes válidos.
- Insignias simbólicas.

**Se monta sobre**

- `CitizenReportsPage.tsx`
- LocalStorage o estado en frontend (no backend).

**Archivos nuevos / cambios**

- Pequeña estructura de puntaje en `src/data/gamificacion_ciudadana.json` (solo textos y umbrales).

---

### 32. Biblioteca de campañas y educación vial

**Descripción**  
Catálogo de campañas:

- Mensajes (copy).
- Visuales (solo referencias o assets locales).
- Minijuegos vinculados al `Game.tsx`.

**Se monta sobre**

- Nueva página `/educacion-vial` o sección dentro de `/reglamento`.
- `GamePage.tsx` (links desde campañas al juego).

**Archivos nuevos / cambios**

- JSON: `src/data/campanas_viales.json`
- Componente: `src/components/CampanasVialesList.tsx`

---

## 7. Trámites digitales de movilidad

### 33. Portal de trámites de movilidad

**Descripción**  
Página para iniciar trámites como:

- Solicitud de tope.
- Cruce peatonal.
- Cierre de calle por evento.
- Zona de carga/descarga.
- Cajones para discapacidad.

**Se monta sobre**

- Nueva ruta `/tramites-movilidad`.

**Archivos nuevos / cambios**

- JSON: `src/data/tramites_definiciones.json`
- Página: `src/pages/TramitesMovilidadPage.tsx`
- Formularios con `shadcn/ui` (Input, Select, Textarea, Button).

---

### 34. Flujos multi-dependencia simulados

**Descripción**  
Para cada trámite, se muestra un “timeline” de dependencias:

- Tránsito.
- CIDUE.
- IMPLAN.
- (Otros, solo como texto).

**Se monta sobre**

- `TramitesMovilidadPage.tsx` (panel lateral o modal).

**Archivos nuevos / cambios**

- Agregar a `tramites_definiciones.json` los pasos y dependencias.
- Componente: `src/components/FlujoTramiteTimeline.tsx`

---

### 35. Seguimiento de trámites (vista ciudadano)

**Descripción**  
Sección “Mis trámites” con listado de:

- Trámite.
- Fecha.
- Estatus: recibido, en revisión, programado, resuelto.

**Se monta sobre**

- `TramitesMovilidadPage.tsx` o subruta `/tramites-movilidad/mis-tramites`.

**Archivos nuevos / cambios**

- Mock JSON: `public/datajson/tramites_registro_mock.json`
- Componente: `src/components/MisTramitesTable.tsx`

---

### 36. Dashboard de trámites (vista gobierno)

**Descripción**  
Módulo en dashboard para ver:

- Número de trámites por tipo.
- Tiempos promedio de atención.
- Mapa por colonia.

**Se monta sobre**

- Dashboard: nueva pestaña `/dashboard/tramites`.

**Archivos nuevos / cambios**

- Reutilizar `tramites_registro_mock.json`.
- Componentes:
  - `src/components/TramitesDashboardKPIs.tsx`
  - `src/components/TramitesMap.tsx`

---

### 37. Chatbot de trámites + reglamento

**Descripción**  
Extensión del chatbot actual para:

- Responder dudas sobre reglamento.
- Sugerir trámites según el problema planteado.

**Se monta sobre**

- `src/components/ChatbotReglamento.tsx` (extender modos).
- `HMObility_chatbot_data.json` + `tramites_definiciones.json`.

**Archivos nuevos / cambios**

- Campos adicionales en `HMObility_chatbot_data.json` para etiquetar respuestas por “tema_tramite”.
- Lógica en `ChatbotReglamento.tsx` para:
  - Modo “Reglamento”.
  - Modo “Trámites de movilidad”.

---

> **Uso con Copilot:**  
> Trabajar feature por feature, abriendo el archivo relacionado (por ejemplo `Dashboard.tsx`, `MapPage.tsx`, etc.), copiar la descripción de la feature y pedirle a Copilot:
> 
> > “Implementa esta feature usando los componentes existentes, respetando rutas y estructura indicadas en `features_nuevas.md`.”