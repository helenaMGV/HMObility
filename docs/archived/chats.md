/*
🧠 PROYECTO: Chatbot de Reglamento de Tránsito de Hermosillo
🎯 OBJETIVO: Crear una plataforma web donde los ciudadanos puedan consultar el reglamento vial en español a través de preguntas abiertas y obtener respuestas claras, usando un modelo LLM alojado en Hugging Face.

📚 FLUJO GENERAL:
1. Usuario escribe pregunta en el frontend (React).
2. Frontend envía la pregunta al backend FastAPI.
3. FastAPI busca en un archivo JSON (`reglamento.json`) entradas relevantes al tema.
4. Con esas entradas, construye un prompt.
5. Consulta un modelo en español (`AIDC-AI/Marco-LLM-ES`) desde Hugging Face.
6. Devuelve la respuesta generada al frontend.

📦 STACK COMPLETO:

Frontend:
- React 18 + TypeScript
- Vite 5 + Tailwind CSS
- shadcn/ui (Textarea, Button, ScrollArea)
- `ChatbotReglamento.tsx` como componente principal

Backend:
- FastAPI (Python 3.10+)
- Transformers de Hugging Face
- Modelo: AIDC-AI/Marco-LLM-ES (7B)
- Archivo local `reglamento.json` como base de conocimiento

⚙️ CONFIGURACIÓN DEL FRONTEND:

1. Guardar el archivo `reglamento.json` en `src/data/reglamento.json`
2. Crear el componente `ChatbotReglamento.tsx` en `src/components/`
3. El componente debe:
   - Tener Textarea para ingresar pregunta
   - Botón para enviar consulta
   - ScrollArea para mostrar respuesta
   - Lógica para hacer `POST` a `http://localhost:8000/query` con body JSON: `{ pregunta: "...text..." }`

✅ Ejemplo de integración:
- Usuario pregunta: “¿Cuál es el límite de velocidad en calles secundarias?”
- Se encuentra entrada relevante en JSON:
  - subcategoría: Calles secundarias o terciarias
  - descripción: 30 km/h en calles secundarias o terciarias.
- Se construye prompt:
  - “Contexto: Calles secundarias o terciarias: 30 km/h en calles secundarias o terciarias.”
  - “Pregunta: ¿Cuál es el límite de velocidad en calles secundarias?”
  - Se genera respuesta con LLM y se devuelve al usuario.

📁 BACKEND FASTAPI (main.py):
- Define un endpoint POST `/query`
- Carga el JSON completo al iniciar
- Filtra entradas del JSON que coincidan con la pregunta
- Construye el prompt y lo manda al modelo desde Hugging Face (con tokenizer y modelo de transformers)
- Devuelve texto limpio como respuesta

🌐 MODELO:
- AIDC-AI/Marco-LLM-ES (español)
- Licencia Apache-2.0
- Cargado con `transformers.AutoTokenizer` y `AutoModelForCausalLM`
- Se recomienda usar con `torch_dtype=torch.float16` y `device_map='auto'` si hay GPU

🧪 Prueba local:
- Ejecutar backend: `uvicorn main:app --reload`
- Ejecutar frontend: `npm run dev`
- Ir a `http://localhost:5173`
- Escribir una pregunta
- Ver respuesta generada por el LLM

🧱 ESTRUCTURA DE CARPETAS:

📁 /frontend
  └─ src/
     ├─ components/
     │   └─ ChatbotReglamento.tsx
     ├─ data/
     │   └─ reglamento.json
     └─ App.tsx

📁 /backend
  ├─ main.py
  ├─ reglamento.json
  └─ requirements.txt

🛠 REQUIREMENTS DEL BACKEND:

fastapi
uvicorn
transformers
torch

🚀 OPCIONAL: Dockerfile y despliegue en Render/Vercel

Este sistema debe ser modular, ágil, liviano y entendible para que un equipo municipal o cívico pueda replicarlo fácilmente en otras ciudades.
*/