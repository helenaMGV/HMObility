# 🚀 Guía para Correr HMObility Safe Streets

Esta guía te llevará paso a paso para instalar y ejecutar todo el sistema (Frontend + Backend) en tu entorno local.

## 📋 Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu computadora:

*   **Node.js** (versión 18 o superior) - [Descargar](https://nodejs.org/)
*   **Python** (versión 3.9 o superior) - [Descargar](https://www.python.org/)
*   **Git** - [Descargar](https://git-scm.com/)

---

## 🛠️ Paso 1: Preparación del Entorno

1.  **Clonar el repositorio** (si aún no lo has hecho):
    ```bash
    git clone https://github.com/helenaMGV/hmobility-safe-streets.git
    cd hmobility-safe-streets
    ```

2.  **Configurar variables de entorno**:
    Crea un archivo `.env` en la raíz del proyecto copiando el ejemplo:
    ```bash
    cp .env.example .env
    ```
    *(Opcional)* Si tienes una API Key de Hugging Face para el chatbot inteligente, agrégala en el archivo `.env`. Si no, el sistema funcionará con respuestas básicas.

---

## 🐍 Paso 2: Backend (Python/FastAPI)

El backend maneja el chatbot, la lógica del reglamento y la conexión con modelos de IA.

1.  **Crear un entorno virtual** (recomendado para no mezclar librerías):
    ```bash
    # En macOS/Linux
    python3 -m venv venv
    source venv/bin/activate

    # En Windows
    python -m venv venv
    .\venv\Scripts\activate
    ```

2.  **Instalar dependencias**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Iniciar el servidor**:
    ```bash
    uvicorn backend.main:app --reload --port 8000
    ```
    
    ✅ **Verificación**: Abre `http://localhost:8000/docs` en tu navegador. Deberías ver la documentación interactiva de la API.

---

## ⚛️ Paso 3: Frontend (React/Vite)

La interfaz de usuario con los mapas, juegos y dashboards.

1.  **Abrir una NUEVA terminal** (mantén la del backend corriendo).

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```

    ✅ **Acceso**: Abre `http://localhost:8080` en tu navegador.

---

## 🗺️ Paso 4: Scripts de Datos (Opcional)

Si necesitas actualizar los datos de mapas (calles, semáforos, etc.) desde OpenStreetMap:

1.  Asegúrate de tener el entorno virtual de Python activado (Paso 2.1).
2.  Ejecuta los scripts de descarga:
    ```bash
    # Descargar calles principales
    python scripts/osm/descargar_calles_principales.py
    
    # Descargar infraestructura ciclista y cruces
    python scripts/osm/descargar_cruces_ciclovias.py
    ```

---

## 🆘 Solución de Problemas Comunes

*   **Error: "Address already in use"**:
    *   Asegúrate de no tener otros procesos usando el puerto 8000 (backend) u 8080 (frontend).
*   **El Chatbot no responde**:
    *   Verifica que el backend esté corriendo en la terminal.
    *   Revisa la consola del navegador (F12) para ver si hay errores de conexión (CORS o Network Error).
*   **Error en `pip install`**:
    *   Si falla la instalación de `overpy` o `uvicorn`, intenta actualizar pip: `pip install --upgrade pip`.

---

¡Listo! Ahora tienes el sistema completo corriendo localmente. 🚦🚗
