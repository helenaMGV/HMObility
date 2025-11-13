"""
Vercel Serverless Function: GET /api
Endpoint de bienvenida para el API
"""

from http.server import BaseHTTPRequestHandler
import json
import os


class handler(BaseHTTPRequestHandler):
    """Handler para Vercel Serverless Function"""
    
    def do_GET(self):
        try:
            reglamento_path = os.path.join(os.path.dirname(__file__), "..", "backend", "reglamento.json")
            entradas_cargadas = 0
            
            try:
                with open(reglamento_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    entradas_cargadas = len(data)
            except:
                pass
            
            response_data = {
                "mensaje": "🚗 API Chatbot Reglamento de Tránsito Hermosillo",
                "version": "2.0 Serverless",
                "entradas_cargadas": entradas_cargadas,
                "llm_habilitado": bool(os.getenv("HUGGINGFACE_API_KEY")),
                "modelo_llm": "AIDC-AI/Marco-LLM-ES" if os.getenv("HUGGINGFACE_API_KEY") else None,
                "endpoints": {
                    "POST /api/query": "Consultar el reglamento (soporta LLM si está configurado)",
                    "GET /api": "Este mensaje",
                    "GET /api/health": "Estado del servicio"
                }
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
        
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
