"""
Vercel Serverless Function: POST /api/query
Consulta al chatbot de Reglamento de Tránsito Hermosillo
"""

from http.server import BaseHTTPRequestHandler
import json
import os
from typing import List, Dict, Optional
import urllib.request
import urllib.error

# Cargar datos del reglamento (cargado una vez, reutilizado)
REGLAMENTO_DATA: Optional[List[Dict]] = None


def cargar_reglamento() -> List[Dict]:
    """Cargar el JSON del reglamento (lazy loading)"""
    global REGLAMENTO_DATA
    
    if REGLAMENTO_DATA is not None:
        return REGLAMENTO_DATA
    
    try:
        reglamento_path = os.path.join(os.path.dirname(__file__), "..", "backend", "reglamento.json")
        with open(reglamento_path, "r", encoding="utf-8") as f:
            REGLAMENTO_DATA = json.load(f)
        print(f"✅ Reglamento cargado: {len(REGLAMENTO_DATA)} entradas")
        return REGLAMENTO_DATA
    except Exception as e:
        print(f"❌ Error cargando reglamento: {e}")
        return []


def buscar_en_reglamento(pregunta: str, max_resultados: int = 3) -> List[Dict]:
    """Busca en el JSON del reglamento entradas relevantes"""
    reglamento = cargar_reglamento()
    pregunta_lower = pregunta.lower()
    palabras_clave = [p for p in pregunta_lower.split() if len(p) > 3]
    
    resultados = []
    
    for item in reglamento:
        texto_busqueda = f"{item.get('categoria', '')} {item.get('subcategoria', '')} {item.get('descripcion', '')}".lower()
        coincidencias = sum(1 for palabra in palabras_clave if palabra in texto_busqueda)
        
        if coincidencias > 0:
            resultados.append({
                "item": item,
                "score": coincidencias
            })
    
    resultados.sort(key=lambda x: x["score"], reverse=True)
    return [r["item"] for r in resultados[:max_resultados]]


def generar_respuesta_llm(pregunta: str, entradas: List[Dict]) -> Optional[str]:
    """Genera respuesta usando Hugging Face API (síncrono para serverless)"""
    api_key = os.getenv("HUGGINGFACE_API_KEY", "")
    if not api_key:
        return None
    
    try:
        # Construir contexto
        contexto = ""
        for entrada in entradas:
            contexto += f"- {entrada.get('subcategoria', '')}: {entrada.get('descripcion', '')}\n"
            if entrada.get('articulo'):
                contexto += f"  Fundamento: {entrada.get('articulo')}\n"
        
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

        # Llamar a Hugging Face API (urllib para evitar dependencias)
        headers = {
            "Authorization": f"Bearer {api_key}",
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
        
        req = urllib.request.Request(
            f"https://api-inference.huggingface.co/models/AIDC-AI/Marco-LLM-ES",
            data=json.dumps(payload).encode('utf-8'),
            headers=headers
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            if isinstance(result, list) and len(result) > 0:
                return result[0].get("generated_text", "").strip()
            return None
    
    except Exception as e:
        print(f"❌ Error LLM: {e}")
        return None


def generar_respuesta_simple(pregunta: str, entradas: List[Dict]) -> str:
    """Genera respuesta basada en entradas encontradas (sin LLM)"""
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


class handler(BaseHTTPRequestHandler):
    """Handler para Vercel Serverless Function"""
    
    def do_POST(self):
        try:
            # Leer body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)
            
            pregunta = data.get("pregunta", "").strip()
            
            if not pregunta or len(pregunta) < 3:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "error": "La pregunta debe tener al menos 3 caracteres"
                }).encode('utf-8'))
                return
            
            # Buscar en reglamento
            entradas_relevantes = buscar_en_reglamento(pregunta)
            
            # Intentar LLM
            respuesta_texto = None
            usa_llm = False
            
            if entradas_relevantes:
                respuesta_texto = generar_respuesta_llm(pregunta, entradas_relevantes)
                if respuesta_texto:
                    usa_llm = True
            
            # Fallback a respuesta simple
            if not respuesta_texto:
                respuesta_texto = generar_respuesta_simple(pregunta, entradas_relevantes)
            
            # Responder
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {
                "respuesta": respuesta_texto,
                "fuentes": entradas_relevantes,
                "usa_llm": usa_llm
            }
            
            self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
        
        except Exception as e:
            print(f"❌ Error en query: {e}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": str(e)
            }).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
