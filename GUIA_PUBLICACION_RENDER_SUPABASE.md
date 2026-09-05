# Guía rápida: publicar la tesis gratis con Render + Supabase

Esta versión del proyecto está preparada para publicarse como **un solo Web Service** en Render. El frontend React y el backend Express se sirven desde el mismo dominio, por lo que no necesitas configurar CORS ni dos URLs distintas.

## 1. Crear la base persistente en Supabase

1. Crea una cuenta/proyecto en Supabase.
2. Abre **SQL Editor**.
3. Crea una consulta nueva y pega todo el contenido de `database/supabase_state.sql`.
4. Ejecuta la consulta. Debe crearse la tabla `public.app_state`.
5. En el panel de Supabase copia:
   - `Project URL` -> será `SUPABASE_URL`.
   - Una **Secret key** que empiece por `sb_secret_...` -> será `SUPABASE_SECRET_KEY`.

> IMPORTANTE: `SUPABASE_SECRET_KEY` es privada. No la pegues en archivos del proyecto, GitHub, capturas de pantalla ni en el código React. Se configura únicamente como variable secreta en Render.

## 2. Subir el proyecto a GitHub

1. Crea un repositorio nuevo en GitHub, por ejemplo `tesis-sistema-soldadura`.
2. Sube **el contenido de esta carpeta** a la raíz del repositorio.
3. Verifica que `package.json`, `server.ts` y `render.yaml` queden visibles en la raíz.
4. No subas ningún archivo `.env` con claves reales.

## 3. Crear el servicio en Render

### Forma recomendada: Blueprint

1. En Render selecciona **New > Blueprint**.
2. Conecta el repositorio de GitHub.
3. Render detectará `render.yaml`.
4. Cuando solicite las variables secretas, coloca:
   - `SUPABASE_URL`: la URL de tu proyecto Supabase.
   - `SUPABASE_SECRET_KEY`: tu llave `sb_secret_...`.
5. Confirma la creación del servicio.

El archivo `render.yaml` ya contiene:

- Runtime: Node.js
- Plan: Free
- Build: `npm install --include=dev && npm run build`
- Start: `npm start`
- Health check: `/api/health`
- `NODE_ENV=production`

## 4. Comprobar que funcionó

Cuando Render termine, mostrará una URL parecida a:

`https://sistema-tecnicos-soldadura.onrender.com`

Prueba primero:

`https://TU-URL.onrender.com/api/health`

Debe mostrar un JSON parecido a:

```json
{
  "status": "ok",
  "service": "sistema-gestion-tecnicos-soldadura",
  "persistence": "supabase"
}
```

Después abre la URL principal.

## 5. Prueba de persistencia antes de la defensa

1. Inicia sesión.
2. Crea o modifica un registro fácil de reconocer.
3. Espera unos segundos.
4. En Render selecciona **Manual Deploy > Deploy latest commit** o reinicia el servicio.
5. Vuelve a abrir la app.
6. El registro debe seguir allí.

Si `/api/health` muestra `local-json`, revisa que `SUPABASE_URL` y `SUPABASE_SECRET_KEY` estén configuradas en Render. En el plan gratuito, depender solo de `data/db.json` no es adecuado porque el filesystem del servicio no es persistente.

## 6. Si quieres probarlo localmente

Sin Supabase:

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`. Guardará en `data/db.json`.

Con Supabase, crea un archivo `.env` basado en `.env.example` y coloca tus credenciales reales. **Nunca subas `.env` a GitHub.**
