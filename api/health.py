"""
Vercel Serverless Function: GET /api/health
Health check endpoint
"""

from http.server import BaseHTTPRequestHandler
import json
import os


class handler(BaseHTTPRequestHandler):
    """Handler para Vercel Serverless Function"""
    
    def do_GET(self):
        try:
            reglamento_path = os.path.join(os.path.dirname(__file__), "..", "backend", "reglamento.json")
            total_entradas = 0
            reglamento_cargado = False
            
            try:
                with open(reglamento_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    total_entradas = len(data)
                    reglamento_cargado = True
            except:
                pass
            
            response_data = {
                "status": "healthy",
                "reglamento_cargado": reglamento_cargado,
                "total_entradas": total_entradas
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
        
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
