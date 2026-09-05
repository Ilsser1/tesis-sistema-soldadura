import {
  Usuario,
  Tecnico,
  Maquina,
  Asignacion,
  Mantenimiento,
  ContratoMantenimiento,
  Alerta,
  BitacoraRegistro,
  DashboardStats
} from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const currentUserRole = localStorage.getItem('active_role') || 'Administrador';
  const currentUsername = localStorage.getItem('active_username') || 'admin';

  const headers = {
    'Content-Type': 'application/json',
    'x-user-role': currentUserRole,
    'x-user-name': currentUsername,
    ...(options?.headers || {})
  };

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `Error HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (username: string, password?: string) => fetchJson<{ token: string; user: Usuario }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password: password || 'password123' })
  }),

  // Dashboard
  getDashboardStats: () => fetchJson<DashboardStats>('/dashboard'),

  // Usuarios
  getUsuarios: () => fetchJson<Usuario[]>('/usuarios'),
  crearUsuario: (u: Partial<Usuario>) => fetchJson<Usuario>('/usuarios', { method: 'POST', body: JSON.stringify(u) }),
  actualizarUsuario: (id: number, u: Partial<Usuario>) => fetchJson<Usuario>(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(u) }),
  toggleEstadoUsuario: (id: number) => fetchJson<Usuario>(`/usuarios/${id}/toggle-estado`, { method: 'PUT' }),
  resetPassword: (id: number) => fetchJson<{ mensaje: string }>(`/usuarios/${id}/reset-password`, { method: 'PUT' }),

  // Técnicos
  getTecnicos: () => fetchJson<Tecnico[]>('/tecnicos'),
  crearTecnico: (t: Partial<Tecnico>) => fetchJson<Tecnico>('/tecnicos', { method: 'POST', body: JSON.stringify(t) }),
  actualizarTecnico: (id: number, t: Partial<Tecnico>) => fetchJson<Tecnico>(`/tecnicos/${id}`, { method: 'PUT', body: JSON.stringify(t) }),
  desactivarTecnico: (id: number) => fetchJson<{ mensaje: string }>(`/tecnicos/${id}`, { method: 'DELETE' }),

  // Máquinas de Soldar
  getMaquinas: () => fetchJson<Maquina[]>('/maquinas'),
  crearMaquina: (m: Partial<Maquina>) => fetchJson<Maquina>('/maquinas', { method: 'POST', body: JSON.stringify(m) }),
  actualizarMaquina: (id: number, m: Partial<Maquina>) => fetchJson<Maquina>(`/maquinas/${id}`, { method: 'PUT', body: JSON.stringify(m) }),
  darDeBajaMaquina: (id: number) => fetchJson<{ mensaje: string }>(`/maquinas/${id}`, { method: 'DELETE' }),

  // Asignaciones
  getAsignaciones: () => fetchJson<Asignacion[]>('/asignaciones'),
  crearAsignacion: (data: { tecnico_id: number; maquina_id: number; motivo: string; observaciones?: string; usuario_id?: number }) => 
    fetchJson<Asignacion>('/asignaciones', { method: 'POST', body: JSON.stringify(data) }),
  finalizarAsignacion: (id: number, usuario_id?: number, observaciones?: string) => 
    fetchJson<Asignacion>(`/asignaciones/${id}/finalizar`, { method: 'PUT', body: JSON.stringify({ observaciones, usuario_id }) }),

  // Mantenimientos
  getMantenimientos: () => fetchJson<Mantenimiento[]>('/mantenimientos'),
  crearMantenimiento: (m: Partial<Mantenimiento>, usuario_id?: number) => fetchJson<Mantenimiento>('/mantenimientos', { method: 'POST', body: JSON.stringify({ ...m, usuario_id }) }),
  actualizarMantenimiento: (id: number, m: Partial<Mantenimiento>, usuario_id?: number) => fetchJson<Mantenimiento>(`/mantenimientos/${id}`, { method: 'PUT', body: JSON.stringify({ ...m, usuario_id }) }),
  eliminarMantenimiento: (id: number) => fetchJson<{ status: string; id: number }>(`/mantenimientos/${id}`, { method: 'DELETE' }),

  // Contratos
  getContratos: () => fetchJson<ContratoMantenimiento[]>('/contratos'),
  crearContrato: (c: Partial<ContratoMantenimiento>, usuario_id?: number) => fetchJson<ContratoMantenimiento>('/contratos', { method: 'POST', body: JSON.stringify({ ...c, usuario_id }) }),
  actualizarContrato: (id: number, c: Partial<ContratoMantenimiento>, usuario_id?: number) => fetchJson<ContratoMantenimiento>(`/contratos/${id}`, { method: 'PUT', body: JSON.stringify({ ...c, usuario_id }) }),

  // Alertas
  getAlertas: () => fetchJson<Alerta[]>('/alertas'),
  marcarAlertaLeida: (id: number) => fetchJson<Alerta>(`/alertas/${id}/leer`, { method: 'PUT' }),
  marcarTodasAlertasLeidas: () => fetchJson<{ status: string; modificadas: number }>('/alertas/leer-todas', { method: 'PUT' }),
  eliminarAlerta: (id: number) => fetchJson<{ status: string; id: number }>(`/alertas/${id}`, { method: 'DELETE' }),
  limpiarTodasAlertas: (soloLeidas: boolean = false) => fetchJson<{ status: string; eliminadas: number }>(`/alertas${soloLeidas ? '?soloLeidas=true' : ''}`, { method: 'DELETE' }),
  ejecutarRevisionAlertas: () => fetchJson<{ mensaje: string }>('/alertas/ejecutar-revision', { method: 'POST' }),

  // Historial
  getHistorialMaquina: (id: number) => fetchJson<any>(`/historial/maquina/${id}`),

  // Bitácora
  getBitacora: () => fetchJson<BitacoraRegistro[]>('/bitacora'),

  // Reportes
  getReportesData: () => fetchJson<any>('/reportes')
};
