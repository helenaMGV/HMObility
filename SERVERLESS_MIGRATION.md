# Backend Migration: FastAPI → Vercel Serverless

Fecha: 13 de noviembre de 2025

## ✅ Migración Completada

El backend de FastAPI (`backend/main.py`) ha sido **convertido a funciones serverless de Vercel** para deployment unificado.

---

## 📁 Nueva Estructura

```
api/
├── index.py     # GET  /api        - Info del API
├── health.py    # GET  /api/health - Health check
└── query.py     # POST /api/query  - Consultas chatbot
```

### Endpoints Disponibles

1. **GET /api** - Información del API
   - Retorna versión, entradas cargadas, estado LLM

2. **GET /api/health** - Health Check
   - Status: healthy
   - Entradas cargadas del reglamento
   - Total de entradas

3. **POST /api/query** - Consultas al Chatbot
   - Body: `{ "pregunta": "tu pregunta aquí" }`
   - Response: `{ "respuesta": "...", "fuentes": [...], "usa_llm": false }`
   - Soporta LLM si `HUGGINGFACE_API_KEY` está configurado

---

## 🔧 Características

### Sin Dependencias Externas
- ✅ Solo `urllib`, `json`, `os` (stdlib de Python)
- ✅ No requiere `fastapi`, `uvicorn`, `aiohttp`
- ✅ Deployment más rápido y ligero
- ✅ Menor cold start time

### CORS Automático
- ✅ Headers `Access-Control-Allow-Origin: *`
- ✅ Soporta OPTIONS preflight
- ✅ No configuración manual necesaria

### Carga Lazy del Reglamento
- ✅ JSON cargado una vez y cacheado
- ✅ Reutilizado entre invocaciones
- ✅ Menor tiempo de respuesta

### LLM Opcional
- ✅ Hugging Face API (modelo: AIDC-AI/Marco-LLM-ES)
- ✅ Fallback a búsqueda local si LLM no disponible
- ✅ Configurable con variable `HUGGINGFACE_API_KEY`

---

## 🚀 Deployment

### Vercel (Automático)
```bash
git add .
git commit -m "Migrate to serverless functions"
git push origin main
```

Vercel detecta automáticamente:
- Carpeta `api/` → Serverless Functions
- `vercel.json` → Configuración de rewrites
- `requirements.txt` → Dependencias Python (vacío)

### Variables de Entorno (Opcional)

En Vercel Dashboard → Settings → Environment Variables:

```
HUGGINGFACE_API_KEY=hf_your_token_here
```

Sin esta variable, el chatbot funciona con búsqueda local (keyword matching).

---

## 📊 Comparación: FastAPI vs Serverless

| Característica | FastAPI (antes) | Serverless (ahora) |
|----------------|-----------------|---------------------|
| **Deployment** | Separado (Railway/Render) | Unificado con frontend |
| **Dependencias** | fastapi, uvicorn, aiohttp | Solo stdlib (urllib, json) |
| **Cold Start** | N/A (servidor persistente) | ~500ms |
| **Escalabilidad** | Manual (workers) | Automática (Vercel) |
| **Costo** | $5+/mes o free tier limitado | Gratis (100k invocaciones/mes) |
| **CORS** | Configuración manual | Automático |
| **Timeout** | Sin límite | 10 segundos (Hobby), 60s (Pro) |

---

## 🧪 Testing Local

### Con Vercel CLI
```bash
npm install -g vercel
vercel dev
```

- Frontend: http://localhost:3000
- API: http://localhost:3000/api/query

### Sin Vercel CLI (solo frontend)
```bash
npm run dev
```

- Chatbot usará fallback local (JSON search)
- LLM no disponible sin serverless functions

---

## 📝 Notas Importantes

1. **Backend Legacy**: `backend/main.py` ya no se usa en producción, se mantiene como referencia

2. **Timeout**: Funciones serverless tienen límite de 10 segundos en plan Hobby
   - Suficiente para búsqueda en JSON
   - LLM puede tardar 5-8 segundos en responder

3. **Rate Limits**: 
   - Vercel Hobby: 100,000 invocaciones/mes
   - Hugging Face API: ~30,000 tokens/mes (free tier)

4. **Cache**: Reglamento JSON se carga una vez por función (warm container)

5. **Logs**: Ver en Vercel Dashboard → Functions → Logs

---

## ✅ Verificación

```bash
# Test local con Vercel CLI
vercel dev

# En otra terminal:
curl http://localhost:3000/api

curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"pregunta": "velocidad máxima en zona escolar"}'

curl http://localhost:3000/api/health
```

---

## 🎉 Resultado

**Frontend + Backend desplegados juntos en Vercel**:
- ✅ Un solo comando: `git push`
- ✅ Un solo dominio: `hmobility.vercel.app`
- ✅ Configuración simplificada
- ✅ Escalabilidad automática
- ✅ 100% gratuito en plan Hobby

El sistema está listo para producción. 🚀
