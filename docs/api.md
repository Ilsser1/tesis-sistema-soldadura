# Especificación de Endpoints API REST

## Autenticación
- `POST /api/auth/login` - Iniciar sesión y obtener token JWT.
- `POST /api/auth/refresh` - Refrescar sesión.
- `POST /api/auth/logout` - Cerrar sesión y registrar evento en Bitácora.
- `GET /api/auth/me` - Obtener datos del usuario autenticado.

## Usuarios
- `GET /api/usuarios` - Lista de usuarios del sistema.
- `POST /api/usuarios` - Registrar usuario.
- `GET /api/usuarios/{id}` - Consultar usuario por ID.
- `PUT /api/usuarios/{id}` - Actualizar datos de usuario.
- `PUT /api/usuarios/{id}/toggle-estado` - Activar o desactivar usuario.
- `PUT /api/usuarios/{id}/reset-password` - Restablecer contraseña con hash bcrypt.
- `DELETE /api/usuarios/{id}` - Desactivar usuario.

## Técnicos
- `GET /api/tecnicos` - Listar técnicos de soldadura.
- `POST /api/tecnicos` - Crear registro de técnico.
- `GET /api/tecnicos/{id}` - Consultar información detallada de técnico.
- `PUT /api/tecnicos/{id}` - Modificar información de técnico.
- `DELETE /api/tecnicos/{id}` - Desactivar técnico.

## Máquinas de Soldar
- `GET /api/maquinas` - Consultar inventario de máquinas de soldar.
- `POST /api/maquinas` - Registrar nueva máquina de soldar.
- `GET /api/maquinas/{id}` - Consultar detalle de máquina.
- `PUT /api/maquinas/{id}` - Actualizar máquina.
- `DELETE /api/maquinas/{id}` - Dar de baja máquina.

## Asignaciones
- `GET /api/asignaciones` - Listar asignaciones registradas.
- `POST /api/asignaciones` - Asignar máquina a técnico (Aplica reglas de negocio).
- `PUT /api/asignaciones/{id}/finalizar` - Registrar devolución y liberar máquina.

## Mantenimientos
- `GET /api/mantenimientos` - Mantenimientos preventivos y correctivos.
- `POST /api/mantenimientos` - Programar o registrar mantenimiento.
- `PUT /api/mantenimientos/{id}` - Actualizar estado o finalizar mantenimiento.

## Contratos de Mantenimiento
- `GET /api/contratos` - Listar contratos y días restantes calculados.
- `POST /api/contratos` - Crear contrato de mantenimiento.
- `PUT /api/contratos/{id}` - Actualizar contrato.

## Alertas
- `GET /api/alertas` - Centro de alertas del sistema.
- `GET /api/alertas/no-leidas` - Alertas pendientes.
- `PUT /api/alertas/{id}/leer` - Marcar alerta como leída.
- `POST /api/alertas/ejecutar-revision` - Tarea automática de escanear vencimientos.

## Historial y Bitácora
- `GET /api/historial/maquina/{id}` - Trazabilidad completa de una máquina.
- `GET /api/bitacora` - Registro auditado de eventos del sistema.

## Dashboard y Reportes
- `GET /api/dashboard` - Tarjetas y datos de gráficas.
- `GET /api/reportes` - Datos consolidados para exportación en PDF y Excel.
