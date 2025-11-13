"""
Backend FastAPI para Chatbot de Reglamento de Tránsito de Hermosillo
Integra búsqueda en JSON local con modelo LLM de Hugging Face
Modelo: AIDC-AI/Marco-LLM-ES (español)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from typing import List, Dict, Optional
import os
import re

app = FastAPI(title="Chatbot Reglamento Tránsito Hermosillo")

# Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8081", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar datos del reglamento
REGLAMENTO_PATH = os.path.join(os.path.dirname(__file__), "reglamento.json")
reglamento_data: List[Dict] = []

@app.on_event("startup")
async def load_reglamento():
    """Cargar el JSON del reglamento al iniciar la aplicación"""
    global reglamento_data
    try:
        with open(REGLAMENTO_PATH, "r", encoding="utf-8") as f:
            reglamento_data = json.load(f)
        print(f"✅ Reglamento cargado: {len(reglamento_data)} entradas")
    except FileNotFoundError:
        print(f"⚠️  No se encontró {REGLAMENTO_PATH}")
        reglamento_data = []
    except Exception as e:
        print(f"❌ Error al cargar reglamento: {e}")
        reglamento_data = []


class QueryRequest(BaseModel):
    pregunta: str


class QueryResponse(BaseModel):
    respuesta: str
    fuentes: Optional[List[Dict]] = []
    usa_llm: bool = False


# Configuración de Hugging Face
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
USE_LLM = bool(HUGGINGFACE_API_KEY)
LLM_MODEL = "AIDC-AI/Marco-LLM-ES"


def buscar_en_reglamento(pregunta: str, max_resultados: int = 3) -> List[Dict]:
    """
    Busca en el JSON del reglamento entradas relevantes a la pregunta
    """
    pregunta_lower = pregunta.lower()
    palabras_clave = [p for p in pregunta_lower.split() if len(p) > 3]
    
    resultados = []
    
    for item in reglamento_data:
        texto_busqueda = f"{item.get('categoria', '')} {item.get('subcategoria', '')} {item.get('descripcion', '')}".lower()
        
        # Contar coincidencias
        coincidencias = sum(1 for palabra in palabras_clave if palabra in texto_busqueda)
        
        if coincidencias > 0:
            resultados.append({
                "item": item,
                "score": coincidencias
            })
    
    # Ordenar por relevancia
    resultados.sort(key=lambda x: x["score"], reverse=True)
    
    return [r["item"] for r in resultados[:max_resultados]]


async def generar_respuesta_llm(pregunta: str, entradas: List[Dict]) -> str:
    """
    Genera una respuesta usando el modelo LLM de Hugging Face
    """
    try:
        import aiohttp
        
        # Construir contexto desde las entradas encontradas
        contexto = ""
        for entrada in entradas:
            contexto += f"- {entrada.get('subcategoria', '')}: {entrada.get('descripcion', '')}\n"
            if entrada.get('articulo'):
                contexto += f"  Fundamento: {entrada.get('articulo')}\n"
        
        # Construir el prompt
        prompt = f"""Eres un asistente experto en el Reglamento de Tránsito de Hermosillo, Sonora.

Pregunta del usuario: {pregunta}

Información relevante del reglamento:
{contexto}

Instrucciones:
- Responde de forma clara, concisa y profesional
- Usa formato markdown: **negrita** para títulos, _cursiva_ para fundamentos legales
- Menciona los artículos del reglamento cuando sea relevante
- Si la información no es suficiente, indícalo claramente
- Mantén un tono amigable pero formal

Respuesta:"""

        # Llamar a la API de Hugging Face
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 300,
                "temperature": 0.7,
                "top_p": 0.9,
                "return_full_text": False
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"https://api-inference.huggingface.co/models/{LLM_MODEL}",
                headers=headers,
                json=payload,
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    if isinstance(result, list) and len(result) > 0:
                        texto_generado = result[0].get("generated_text", "")
                        return texto_generado.strip()
                    else:
                        print(f"⚠️ Respuesta inesperada del LLM: {result}")
                        return None
                else:
                    error_text = await response.text()
                    print(f"❌ Error en API Hugging Face ({response.status}): {error_text}")
                    return None
    
    except Exception as e:
        print(f"❌ Error generando respuesta con LLM: {e}")
        return None


def generar_respuesta_simple(pregunta: str, entradas: List[Dict]) -> str:
    """
    Genera una respuesta basada en las entradas encontradas (sin LLM)
    """
    if not entradas:
        return "Lo siento, no encontré información específica sobre eso en el reglamento de tránsito de Hermosillo. ¿Podrías reformular tu pregunta o ser más específico?"
    
    respuesta = "📋 Encontré la siguiente información en el Reglamento de Tránsito de Hermosillo:\n\n"
    
    for i, entrada in enumerate(entradas, 1):
        respuesta += f"**{i}. {entrada.get('subcategoria', 'Información')}**\n"
        respuesta += f"{entrada.get('descripcion', '')}\n"
        
        if entrada.get('articulo'):
            respuesta += f"_Fundamento: {entrada.get('articulo')}_\n"
        
        respuesta += "\n"
    
    if len(entradas) > 1:
        respuesta += f"_Se encontraron {len(entradas)} entradas relevantes._\n"
    
    respuesta += "\n💡 ¿Necesitas más información sobre algún tema específico?"
    
    return respuesta


@app.post("/query", response_model=QueryResponse)
async def consultar_reglamento(request: QueryRequest):
    """
    Endpoint principal para consultas al chatbot
    Flujo: Búsqueda JSON → Construcción de prompt → Query LLM → Respuesta formateada
    """
    try:
        if not request.pregunta or len(request.pregunta.strip()) < 3:
            raise HTTPException(
                status_code=400, 
                detail="La pregunta debe tener al menos 3 caracteres"
            )
        
        # 1. Buscar en el reglamento JSON
        entradas_relevantes = buscar_en_reglamento(request.pregunta)
        
        # 2. Intentar generar respuesta con LLM si está configurado
        respuesta_texto = None
        usa_llm = False
        
        if USE_LLM and entradas_relevantes:
            print(f"🤖 Generando respuesta con LLM para: {request.pregunta}")
            respuesta_texto = await generar_respuesta_llm(request.pregunta, entradas_relevantes)
            if respuesta_texto:
                usa_llm = True
        
        # 3. Si LLM falló o no está configurado, usar respuesta simple
        if not respuesta_texto:
            respuesta_texto = generar_respuesta_simple(request.pregunta, entradas_relevantes)
        
        return QueryResponse(
            respuesta=respuesta_texto,
            fuentes=entradas_relevantes,
            usa_llm=usa_llm
        )
    
    except Exception as e:
        print(f"❌ Error en consulta: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    """Endpoint de bienvenida"""
    return {
        "mensaje": "🚗 API Chatbot Reglamento de Tránsito Hermosillo",
        "version": "2.0",
        "entradas_cargadas": len(reglamento_data),
        "llm_habilitado": USE_LLM,
        "modelo_llm": LLM_MODEL if USE_LLM else None,
        "endpoints": {
            "POST /query": "Consultar el reglamento (soporta LLM si está configurado)",
            "GET /": "Este mensaje",
            "GET /health": "Estado del servicio"
        }
    }


@app.get("/health")
async def health_check():
    """Endpoint de salud"""
    return {
        "status": "healthy",
        "reglamento_cargado": len(reglamento_data) > 0,
        "total_entradas": len(reglamento_data)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
