# Backend - Chatbot Reglamento de Tránsito Hermosillo

API FastAPI para el chatbot de consulta del Reglamento de Tránsito de Hermosillo 2025.

## 🚀 Inicio Rápido

### 1. Crear entorno virtual (recomendado)

```bash
python3 -m venv venv
source venv/bin/activate  # En macOS/Linux
# o
venv\Scripts\activate  # En Windows
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. (Opcional) Configurar Hugging Face LLM

Si quieres que el chatbot use inteligencia artificial en lugar de búsqueda simple:

1. Crea una cuenta gratis en [Hugging Face](https://huggingface.co)
2. Obtén tu API key en: https://huggingface.co/settings/tokens
3. Crea un archivo `.env` en este directorio (backend/):

```bash
cp .env.example .env
```

4. Edita `.env` y agrega tu API key:

```
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Nota:** Sin la API key, el chatbot funcionará con búsqueda inteligente en el JSON local.

### 4. Iniciar el servidor

```bash
uvicorn main:app --reload --port 8000
```

El servidor estará disponible en: `http://localhost:8000`

## 🤖 Flujo del Chatbot

1. **Usuario hace pregunta** → React Frontend
2. **Búsqueda en JSON** → Backend busca en reglamento.json (296 entradas)
3. **Construcción de contexto** → Se extraen las entradas más relevantes
4. **Query a LLM** (si está configurado) → Hugging Face API (AIDC-AI/Marco-LLM-ES)
5. **Respuesta formateada** → Markdown con **negrita**, _cursiva_, listas, etc.
6. **Renderizado** → Frontend con react-markdown

## 📡 Endpoints

### `GET /`
Información general de la API

**Response:**
```json
{
  "mensaje": "🚗 API Chatbot Reglamento de Tránsito Hermosillo",
  "version": "2.0",
  "entradas_cargadas": 42,
  "llm_habilitado": true,
  "modelo_llm": "AIDC-AI/Marco-LLM-ES",
  "endpoints": {...}
}
```

### `POST /query`
Consultar el reglamento de tránsito

**Body:**
```json
{
  "pregunta": "¿Cuál es el límite de velocidad en zonas escolares?"
}
```

**Response:**
```json
{
  "respuesta": "**Límite de velocidad en zonas escolares**\n\nSegún el reglamento...",
  "fuentes": [...],
  "usa_llm": true
}
```

### `GET /health`
Verificar estado del servidor

## 🧪 Pruebas

Pueba la API con curl:

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"pregunta": "límite de velocidad en escuelas"}'
```

O abrir la documentación interactiva en: `http://localhost:8000/docs`

## �️ Estructura

```
backend/
├── main.py              # Aplicación FastAPI
├── reglamento.json      # Base de datos del reglamento
├── requirements.txt     # Dependencias Python
└── README.md           # Este archivo
```

## 🔧 Configuración

### CORS
El backend permite peticiones desde:
- `http://localhost:8080` (Vite dev server)
- `http://localhost:5173` (Vite alternative port)

Para producción, actualiza `allow_origins` en `main.py`.

## 📦 Modelo LLM (Opcional)

Para usar el modelo de Hugging Face (AIDC-AI/Marco-LLM-ES):

1. Descomenta las dependencias en `requirements.txt`:
```bash
pip install transformers torch accelerate
```

2. Implementa la integración en `main.py` (código base ya incluido)

**Nota:** El modelo requiere ~14GB de RAM y GPU para mejor rendimiento.

## 🐛 Troubleshooting

### Error: "No se encontró reglamento.json"
Verifica que `reglamento.json` esté en la misma carpeta que `main.py`.

### Error: CORS
Asegúrate de que el frontend esté corriendo en los puertos permitidos (8080 o 5173).

### Puerto en uso
Si el puerto 8000 está ocupado, usa otro:
```bash
uvicorn main:app --reload --port 8001
```
Y actualiza la URL en el frontend.

## 📄 Licencia

Este proyecto es parte de HMObility - Safe Streets Initiative.
