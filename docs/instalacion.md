# Guía Paso a Paso de Instalación y Despliegue

## Requisitos Previos
- Python 3.13+
- MySQL 8.0+
- Node.js 18+ / npm (para el cliente web)
- Git

## 1. Clonar Repositorio
```bash
git clone https://github.com/tu-usuario/gestion_tecnicos_soldadura.git
cd gestion_tecnicos_soldadura
```

## 2. Configuración de Base de Datos MySQL
1. Abrir MySQL Workbench o terminal MySQL:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```

## 3. Configuración Backend Python / FastAPI
1. Crear entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```
2. Cargar dependencias:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Copiar archivo de variables de entorno:
   ```bash
   cp backend/.env.example backend/.env
   ```
4. Ejecutar Backend FastAPI:
   ```bash
   uvicorn backend.app.main:app --reload --port 8000
   ```

## 4. Ejecución del Frontend Web
```bash
npm install
npm run dev
```

El sistema estará disponible en `http://localhost:3000`.
Swagger interactivo disponible en `http://localhost:8000/docs`.
