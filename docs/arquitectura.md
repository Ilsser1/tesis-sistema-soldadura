# Arquitectura del Sistema - Sistema Web de Gestión de Técnicos y Máquinas de Soldar

## 1. Visión General
El **Sistema Web de Gestión de Técnicos y Máquinas de Soldar** es una solución web empresarial orientada a la administración operativa, mantenimiento, control de asignaciones, gestión de contratos, trazabilidad e inspección de auditoría de máquinas de soldadura industrial y el personal técnico asociado.

## 2. Diagrama de Capas
```
+-------------------------------------------------------+
|                    PRESENTACIÓN                       |
|   HTML5 / CSS3 (Bootstrap 5) / TypeScript / React UI  |
+-------------------------------------------------------+
                           |
                           v  (REST API / JSON / JWT)
+-------------------------------------------------------+
|                 CAPA DE SERVICIOS / API               |
|      FastAPI / Express Controller Routing & Security  |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
|               CAPA DE REGLAS DE NEGOCIO               |
|   - Validación de Doble Asignación                    |
|   - Restricción de Máquinas en Mantenimiento          |
|   - Tarea Programada de Revisión Diaria de Alertas    |
|   - Trazabilidad en Historial y Registro en Bitácora  |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
|                  PERSISTENCIA DE DATOS                |
|            SQLAlchemy ORM / MySQL 8 Database          |
+-------------------------------------------------------+
```

## 3. Principios de Diseño
- **Clean Code & PEP 8**: Código modular, legible y auto-documentado.
- **SOLID**: Separación clara de responsabilidades entre routers, modelos, esquemas Pydantic y servicios.
- **RBAC (Role-Based Access Control)**: Restricciones granulares según rol (`Administrador`, `Supervisor`, `Técnico`).

## 4. Reglas Críticas de Negocio
1. **Unicidad de Asignación**: Una máquina de soldar solo puede estar asignada a un técnico activo a la vez (`estado = 'Activa'`).
2. **Restricción por Estado**: Una máquina en estado `En mantenimiento`, `Fuera de servicio`, `Reparación` o `Baja` NO puede ser asignada.
3. **Sincronización Automática de Estado**:
   - Asignar máquina -> Estado máquina cambia a `Asignada`.
   - Devolver máquina -> Estado máquina cambia a `Disponible`.
   - Crear mantenimiento -> Estado máquina cambia a `En mantenimiento`.
   - Finalizar mantenimiento -> Estado máquina pasa a `Disponible` (o `Asignada` si existe asignación previa activa).
4. **Cálculo Automático de Alertas de Contrato**:
   - Vencimiento <= 30 días -> Alerta Advertencia.
   - Vencimiento <= 15 días -> Alerta Alta.
   - Vencimiento <= 7 días -> Alerta Crítica URGENTE.
   - Fecha posterior -> Alerta Crítica VENCIDO.
