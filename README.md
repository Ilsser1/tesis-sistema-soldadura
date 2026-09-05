# SISTEMA WEB DE GESTIÓN DE TÉCNICOS Y MÁQUINAS DE SOLDAR

Sistema Web Empresarial Completo, Profesional e Industrial para la administración de técnicos de soldadura, máquinas de soldar, asignaciones de equipo, mantenimientos preventivos y correctivos, contratos con proveedores, trazabilidad en historial, bitácora de auditoría, alertas automáticas y generación de reportes exportables en PDF y Excel.

---

## 🚀 Características Principales

1. **Gestión de Usuarios y Roles**:
   - Control de Acceso Basado en Roles (RBAC): `Administrador`, `Supervisor` y `Técnico`.
   - Autenticación JWT con hash de contraseñas mediante `bcrypt`.

2. **Gestión de Técnicos de Soldadura**:
   - Registro de DPI, especialidad (TIG, MIG/MAG, SMAW, FCAW, SAW, Oxigas), puesto, fecha de ingreso y vinculación a cuenta de usuario.
   - Historial de máquinas asignadas y actividades realizadas.

3. **Gestión de Máquinas de Soldar**:
   - Control por código interno, marca (Miller, Lincoln, ESAB, Fronius, Kemppi, etc.), número de serie, tipo, voltaje, amperaje y ubicación.
   - Control de estados: `Disponible`, `Asignada`, `En mantenimiento`, `Fuera de servicio`, `Reparación`, `Baja`.

4. **Módulo Obligatorio de Asignaciones**:
   - **Regla Estricta 1**: Imposibilidad de doble asignación simultánea para una máquina.
   - **Regla Estricta 2**: Bloqueo automático de asignación a máquinas en estado de mantenimiento, fuera de servicio o reparación.
   - Transición automática de estado de máquina (`Disponible` <-> `Asignada`).

5. **Mantenimientos Preventivos y Correctivos**:
   - Control de costos, repuestos, proveedor técnico y responsable.
   - Cambio de estado automático de máquina a `En mantenimiento` durante la ejecución.

6. **Contratos de Mantenimiento con Alertas de Vencimiento**:
   - Cálculo dinámico de días restantes.
   - Generación de mensajes automáticos:
     - `<= 30 días`: "Contrato próximo a vencer en 30 días"
     - `<= 15 días`: "Contrato próximo a vencer en 15 días"
     - `<= 7 días`: "URGENTE: Contrato vence en 7 días"
     - `Vencido`: "Contrato VENCIDO"

7. **Centro de Alertas Automático**:
   - Tarea programada diaria en segundo plano.
   - Clasificación por prioridad (`Información`, `Advertencia`, `Alta`, `Crítica`).
   - Notificaciones dinámicas en el Dashboard.

8. **Trazabilidad en Historial por Máquina**:
   - Histórico de eventos: Asignación, Devolución, Mantenimiento, Cambio de Estado, Reparación y Movimientos con usuario responsable.

9. **Bitácora del Sistema (Auditoría Segura)**:
   - Registro inalterable de Login, Logout, Creación, Modificación, Eliminaciones e IP de origen.
   - Restringido únicamente para Administradores.

10. **Dashboard Ejecutivo & Reportes**:
    - Tarjetas de resumen métrico y gráficas interactivas.
    - Exportación a **PDF** y **Excel** con filtros avanzados por fecha, máquina y técnico.

---

## 🛠️ Tecnologías Utilizadas

- **Backend / Servidor**: Python 3.13 / FastAPI / SQLAlchemy ORM / Express Node.js Server Layer
- **Base de Datos**: MySQL 8.0+ (`gestion_tecnicos_soldadura`)
- **Frontend**: React 19 / Bootstrap 5 / Tailwind CSS / Lucide Icons / Recharts
- **Exportación**: jsPDF, jsPDF-AutoTable, SheetJS (XLSX)
- **Seguridad**: JWT (JSON Web Tokens), bcrypt, RBAC

---

## 📂 Estructura del Proyecto

```
gestion_tecnicos_soldadura/
├── server.ts                  # Servidor Express Full-Stack con REST API
├── server/
│   └── db.ts                  # Motor de persistencia industrial, reglas y bitácora
├── database/
│   ├── schema.sql             # Estructura DDL para MySQL 8
│   └── seed.sql               # Datos iniciales para pruebas
├── docs/
│   ├── arquitectura.md        # Documentación de arquitectura por capas
│   ├── api.md                 # Especificación de endpoints REST
│   └── instalacion.md         # Guía detallada de despliegue
├── src/
│   ├── App.tsx                # Componente principal con router y navegación
│   ├── types.ts               # Interfaces y tipos de TypeScript
│   ├── components/            # Módulos de interfaz (Dashboard, Maquinas, Asignaciones, etc.)
│   └── data/                  # Datos de semilla iniciales
├── package.json
└── README.md
```

---

## ⚡ Ejecución Rápida

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar Servidor de Desarrollo**:
   ```bash
   npm run dev
   ```

3. **Acceso al Sistema**:
   Navegar a `http://localhost:3000` en el navegador.

---

## 🔐 Credenciales de Prueba

| Usuario | Contraseña | Rol | Descripción |
|---|---|---|---|
| `admin` | `admin123` | **Administrador** | Acceso total a todos los módulos |
| `rgarcia` | `sup123` | **Supervisor** | Asignaciones, Mantenimientos, Contratos y Reportes |
| `jlopez` | `tech123` | **Técnico** | Máquinas asignadas y consulta de actividades |

---

## 📜 Licencia
Desarrollado para el proyecto académico y tesis universitaria *"Sistema Web de Gestión de Técnicos y Máquinas de Soldar"*.

---

## ☁️ Despliegue en Render + Supabase

Esta copia está preparada para despliegue gratuito en Render mediante `render.yaml` y persistencia opcional en Supabase. Para el procedimiento completo consulta `GUIA_PUBLICACION_RENDER_SUPABASE.md`.

El endpoint `/api/health` permite comprobar el estado del servicio y muestra si la persistencia activa es `supabase`, `local-json` o `local-json-fallback`.
