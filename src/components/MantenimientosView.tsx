import React, { useState } from 'react';
import {
  Mantenimiento,
  Maquina,
  Tecnico,
  Usuario,
  TipoMantenimiento,
  EstadoMantenimiento
} from '../types';
import {
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Play,
  Pencil,
  Trash2,
  X,
  UserCheck,
  Building2,
  Filter
} from 'lucide-react';

interface MantenimientosViewProps {
  mantenimientos: Mantenimiento[];
  maquinas: Maquina[];
  tecnicos?: Tecnico[];
  usuarios?: Usuario[];
  currentUser?: Usuario;
  onCrear: (m: Partial<Mantenimiento>) => Promise<void>;
  onActualizar: (id: number, m: Partial<Mantenimiento>) => Promise<void>;
  onEliminar?: (id: number) => Promise<void>;
  isReadOnly?: boolean;
}

export const MantenimientosView: React.FC<MantenimientosViewProps> = ({
  mantenimientos,
  maquinas,
  tecnicos = [],
  usuarios = [],
  currentUser,
  onCrear,
  onActualizar,
  onEliminar,
  isReadOnly = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('TODOS');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [soloMisMantenimientos, setSoloMisMantenimientos] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMantenimiento, setEditingMantenimiento] = useState<Mantenimiento | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modo de asignación en modal: 'cuenta' (técnico interno) o 'externo' (proveedor tercero)
  const [asignacionModo, setAsignacionModo] = useState<'cuenta' | 'externo'>('cuenta');

  // Encontrar si el usuario actual tiene perfil de técnico
  const myTecnicoProfile = tecnicos.find(
    t => (currentUser && t.correo && t.correo.toLowerCase() === currentUser.correo.toLowerCase()) ||
         (currentUser && t.usuario_id === currentUser.id)
  );

  // Inicialización de técnico por defecto
  const defaultTecnicoName = myTecnicoProfile
    ? `${myTecnicoProfile.nombre} ${myTecnicoProfile.apellido} (${myTecnicoProfile.correo})`
    : tecnicos.length > 0
    ? `${tecnicos[0].nombre} ${tecnicos[0].apellido} (${tecnicos[0].correo})`
    : currentUser
    ? `${currentUser.nombre} ${currentUser.apellido} (${currentUser.correo})`
    : 'Taller Interno PRODIMA';

  const defaultTecnicoId = myTecnicoProfile ? myTecnicoProfile.id : tecnicos.length > 0 ? tecnicos[0].id : undefined;

  const [formData, setFormData] = useState({
    maquina_id: maquinas.length > 0 ? maquinas[0].id : 1,
    tipo: 'Preventivo' as TipoMantenimiento,
    descripcion: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    costo: 850,
    proveedor: 'Taller Interno PRODIMA',
    tecnico_responsable: defaultTecnicoName,
    tecnico_id: defaultTecnicoId,
    estado: 'Programado' as EstadoMantenimiento,
    observaciones: ''
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenModal = (m?: Mantenimiento) => {
    if (m) {
      setEditingMantenimiento(m);

      // Verificar si el técnico coincide con algún técnico registrado
      const matchedTec = tecnicos.find(
        t => `${t.nombre} ${t.apellido}`.toLowerCase() === (m.tecnico_responsable || '').toLowerCase() ||
             (m.tecnico_responsable || '').toLowerCase().includes(t.correo.toLowerCase()) ||
             (m.tecnico_id && t.id === m.tecnico_id)
      );

      setAsignacionModo(matchedTec ? 'cuenta' : m.proveedor === 'Taller Interno PRODIMA' ? 'cuenta' : 'externo');

      setFormData({
        maquina_id: m.maquina_id,
        tipo: m.tipo,
        descripcion: m.descripcion,
        fecha_inicio: m.fecha_inicio,
        fecha_fin: m.fecha_fin,
        costo: m.costo,
        proveedor: m.proveedor,
        tecnico_responsable: m.tecnico_responsable,
        tecnico_id: m.tecnico_id || (matchedTec ? matchedTec.id : undefined),
        estado: m.estado,
        observaciones: m.observaciones || ''
      });
    } else {
      setEditingMantenimiento(null);
      setAsignacionModo('cuenta');
      setFormData({
        maquina_id: maquinas.length > 0 ? maquinas[0].id : 1,
        tipo: 'Preventivo',
        descripcion: 'Inspección de circuitos de potencia, prueba de aislamiento e higienización de conectores DINSE.',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        costo: 850,
        proveedor: 'Taller Interno PRODIMA',
        tecnico_responsable: defaultTecnicoName,
        tecnico_id: defaultTecnicoId,
        estado: 'Programado',
        observaciones: 'Mantenimiento preventivo de rutina programado.'
      });
    }
    setIsModalOpen(true);
  };

  const handleSelectTecnicoAccount = (tecnicoIdStr: string) => {
    const tecId = Number(tecnicoIdStr);
    const tec = tecnicos.find(t => t.id === tecId);
    if (tec) {
      setFormData(prev => ({
        ...prev,
        tecnico_id: tec.id,
        tecnico_responsable: `${tec.nombre} ${tec.apellido} (${tec.correo})`,
        proveedor: prev.proveedor === 'Taller Interno PRODIMA' || !prev.proveedor ? 'Taller Interno PRODIMA' : prev.proveedor
      }));
    }
  };

  const handleSelectUserAccount = (userIdStr: string) => {
    const uId = Number(userIdStr);
    const u = usuarios.find(user => user.id === uId);
    if (u) {
      setFormData(prev => ({
        ...prev,
        tecnico_responsable: `${u.nombre} ${u.apellido} (${u.correo})`,
        proveedor: 'Taller Interno PRODIMA'
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descripcion.trim()) {
      showNotification('error', 'Por favor ingrese la descripción del mantenimiento.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingMantenimiento) {
        await onActualizar(editingMantenimiento.id, formData);
        showNotification('success', `Mantenimiento #${editingMantenimiento.id} actualizado correctamente.`);
      } else {
        await onCrear(formData);
        showNotification('success', 'Nuevo mantenimiento registrado y programado exitosamente.');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showNotification('error', `Error al procesar: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Botón rápido: Iniciar trabajo ('En proceso')
  const handleStartMantenimiento = async (m: Mantenimiento) => {
    try {
      await onActualizar(m.id, { estado: 'En proceso' });
      showNotification('success', `Mantenimiento #${m.id} iniciado. La máquina ahora se encuentra 'En mantenimiento'.`);
    } catch (err: any) {
      showNotification('error', `Error al iniciar: ${err.message || err}`);
    }
  };

  // Botón rápido: Finalizar trabajo ('Finalizado')
  const handleFinishMantenimiento = async (m: Mantenimiento) => {
    if (confirm(`¿Finalizar el mantenimiento #${m.id} de la máquina ${m.maquina_codigo || `M-${m.maquina_id}`}? La máquina pasará a estado 'Disponible'.`)) {
      try {
        await onActualizar(m.id, { estado: 'Finalizado' });
        showNotification('success', `Mantenimiento finalizado. Máquina liberada a estado 'Disponible'.`);
      } catch (err: any) {
        showNotification('error', `Error al finalizar: ${err.message || err}`);
      }
    }
  };

  // Botón rápido: Eliminar / Cancelar mantenimiento
  const handleDeleteMantenimiento = async (m: Mantenimiento) => {
    if (confirm(`¿Está seguro de eliminar o cancelar el registro de mantenimiento #${m.id}?`)) {
      try {
        if (onEliminar) {
          await onEliminar(m.id);
        } else {
          await onActualizar(m.id, { estado: 'Cancelado' });
        }
        showNotification('success', `Mantenimiento #${m.id} retirado del sistema.`);
      } catch (err: any) {
        showNotification('error', `Error al eliminar: ${err.message || err}`);
      }
    }
  };

  // Filtrado de mantenimientos
  const filteredMantenimientos = (mantenimientos || []).filter(m => {
    const text = searchTerm.toLowerCase();
    const matchesSearch =
      (m.descripcion || '').toLowerCase().includes(text) ||
      (m.maquina_codigo || '').toLowerCase().includes(text) ||
      (m.proveedor || '').toLowerCase().includes(text) ||
      (m.tecnico_responsable || '').toLowerCase().includes(text);

    const matchesType = typeFilter === 'TODOS' || m.tipo === typeFilter;
    const matchesStatus = statusFilter === 'TODOS' || m.estado === statusFilter;

    let matchesMine = true;
    if (soloMisMantenimientos && currentUser) {
      const resp = (m.tecnico_responsable || '').toLowerCase();
      matchesMine =
        resp.includes(currentUser.nombre.toLowerCase()) ||
        resp.includes(currentUser.apellido.toLowerCase()) ||
        resp.includes(currentUser.correo.toLowerCase()) ||
        resp.includes(currentUser.username.toLowerCase());
    }

    return matchesSearch && matchesType && matchesStatus && matchesMine;
  });

  // Estadísticas rápidas
  const countProgramados = (mantenimientos || []).filter(m => m.estado === 'Programado').length;
  const countEnProceso = (mantenimientos || []).filter(m => m.estado === 'En proceso').length;
  const countFinalizados = (mantenimientos || []).filter(m => m.estado === 'Finalizado').length;
  const totalCosto = (mantenimientos || []).reduce((acc, curr) => acc + (Number(curr.costo) || 0), 0);

  return (
    <div className="space-y-6">

      {/* Banner de Notificación */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            Mantenimiento de Máquinas
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de servicios preventivos y correctivos, asignación a cuentas de técnicos y control de costos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser && currentUser.rol === 'Técnico' && (
            <button
              onClick={() => setSoloMisMantenimientos(prev => !prev)}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 ${
                soloMisMantenimientos
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              {soloMisMantenimientos ? 'Viendo mis mantenimientos' : 'Filtrar asignados a mí'}
            </button>
          )}

          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nuevo Mantenimiento
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen Operativo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Programados</span>
          <div className="text-xl font-bold text-blue-400 mt-1 flex items-center justify-between">
            <span>{countProgramados}</span>
            <Clock className="w-4 h-4 text-blue-500/50" />
          </div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">En Proceso</span>
          <div className="text-xl font-bold text-amber-400 mt-1 flex items-center justify-between">
            <span>{countEnProceso}</span>
            <Wrench className="w-4 h-4 text-amber-500/50" />
          </div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Finalizados</span>
          <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center justify-between">
            <span>{countFinalizados}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
          </div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Costo Acumulado</span>
          <div className="text-xl font-bold font-mono text-slate-200 mt-1">
            Q{totalCosto.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar máquina, técnico, descripción..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 shrink-0">Tipo:</span>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="TODOS">Todos los Tipos</option>
            <option value="Preventivo">Preventivo</option>
            <option value="Correctivo">Correctivo</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 shrink-0">Estado:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="Programado">Programado</option>
            <option value="En proceso">En proceso</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Tabla de Mantenimientos */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700 uppercase tracking-wider">
              <tr>
                <th className="p-3">Máquina</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Descripción / Trabajo</th>
                <th className="p-3">Fechas</th>
                <th className="p-3">Técnico / Cuenta Asignada</th>
                <th className="p-3">Costo</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredMantenimientos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No se encontraron mantenimientos con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredMantenimientos.map(m => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition group">
                    <td className="p-3">
                      <span className="font-mono text-amber-400 font-bold block">
                        {m.maquina_codigo || `M-${m.maquina_id}`}
                      </span>
                      <span className="text-[10px] text-slate-500">ID #{m.id}</span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          m.tipo === 'Preventivo'
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {m.tipo}
                      </span>
                    </td>

                    <td className="p-3 max-w-xs">
                      <div className="text-slate-200 font-medium line-clamp-2">{m.descripcion}</div>
                      {m.observaciones && (
                        <div className="text-[10px] text-slate-500 italic mt-0.5">{m.observaciones}</div>
                      )}
                    </td>

                    <td className="p-3 text-slate-400">
                      <div>{m.fecha_inicio}</div>
                      <div className="text-[10px] text-slate-500">hasta {m.fecha_fin}</div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{m.tecnico_responsable || 'Sin asignar'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{m.proveedor}</div>
                    </td>

                    <td className="p-3 font-mono font-bold text-emerald-400">
                      Q{Number(m.costo || 0).toFixed(2)}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded inline-flex items-center gap-1 ${
                          m.estado === 'Finalizado'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : m.estado === 'En proceso'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : m.estado === 'Programado'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {m.estado === 'En proceso' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                        {m.estado}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">

                        {/* Botón Iniciar (si está Programado) */}
                        {m.estado === 'Programado' && (
                          <button
                            onClick={() => handleStartMantenimiento(m)}
                            className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-[10px] font-bold rounded flex items-center gap-1 transition cursor-pointer"
                            title="Comenzar trabajo y marcar máquina 'En mantenimiento'"
                          >
                            <Play className="w-3 h-3" /> Iniciar
                          </button>
                        )}

                        {/* Botón Finalizar (si está En proceso o Programado) */}
                        {['Programado', 'En proceso'].includes(m.estado) && (
                          <button
                            onClick={() => handleFinishMantenimiento(m)}
                            className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded flex items-center gap-1 transition cursor-pointer"
                            title="Finalizar mantenimiento y liberar máquina a 'Disponible'"
                          >
                            <FileCheck className="w-3 h-3" /> Finalizar
                          </button>
                        )}

                        {/* Botón Editar */}
                        <button
                          onClick={() => handleOpenModal(m)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded transition cursor-pointer"
                          title="Editar información del mantenimiento"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Botón Eliminar / Cancelar */}
                        <button
                          onClick={() => handleDeleteMantenimiento(m)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded transition cursor-pointer"
                          title="Eliminar o cancelar este registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR MANTENIMIENTO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  {editingMantenimiento ? `Editar Mantenimiento #${editingMantenimiento.id}` : 'Programar / Asignar Mantenimiento'}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Seleccione la máquina y la cuenta del técnico responsable de ejecutar el servicio.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              
              {/* Seleccionar Máquina */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Máquina de Soldar</label>
                <select
                  required
                  value={formData.maquina_id}
                  onChange={e => setFormData({ ...formData, maquina_id: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                >
                  {maquinas.map(m => (
                    <option key={m.id} value={m.id}>
                      [{m.codigo_interno || `M-${m.id}`}] {m.marca} {m.modelo} — Estado: {m.estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* ASIGNACIÓN A CUENTA (TÉCNICO) */}
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    Asignar a Cuenta de Técnico
                  </label>

                  {/* Selector de Modo */}
                  <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setAsignacionModo('cuenta')}
                      className={`px-2 py-1 text-[10px] rounded-md font-medium transition ${
                        asignacionModo === 'cuenta'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Cuenta Interna
                    </button>
                    <button
                      type="button"
                      onClick={() => setAsignacionModo('externo')}
                      className={`px-2 py-1 text-[10px] rounded-md font-medium transition ${
                        asignacionModo === 'externo'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Proveedor Externo
                    </button>
                  </div>
                </div>

                {asignacionModo === 'cuenta' ? (
                  <div className="space-y-2">
                    <label className="block text-[11px] text-slate-400">
                      Seleccionar técnico homologado del sistema:
                    </label>
                    <select
                      value={formData.tecnico_id || ''}
                      onChange={e => handleSelectTecnicoAccount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="" disabled>-- Seleccione un Técnico --</option>
                      {tecnicos.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.nombre} {t.apellido} — {t.especialidad} ({t.correo || t.codigo_empleado})
                        </option>
                      ))}
                    </select>

                    {/* También permitir elegir usuarios con rol Técnico o Supervisor si no están en técnicos */}
                    {usuarios.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] text-slate-500 block mb-1">
                          O bien, asignar a otra cuenta de usuario:
                        </span>
                        <select
                          onChange={e => handleSelectUserAccount(e.target.value)}
                          className="w-full bg-slate-900/70 border border-slate-700/60 rounded-lg p-1.5 text-[11px] text-slate-300"
                          defaultValue=""
                        >
                          <option value="" disabled>-- Seleccionar por cuenta de usuario --</option>
                          {usuarios.map(u => (
                            <option key={u.id} value={u.id}>
                              @{u.username} ({u.nombre} {u.apellido}) — Rol: {u.rol}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="text-[11px] text-amber-400/90 font-medium bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Responsable asignado: <strong className="text-slate-100">{formData.tecnico_responsable}</strong></span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Nombre del Técnico o Taller Externo</label>
                      <input
                        type="text"
                        required
                        value={formData.tecnico_responsable}
                        onChange={e => setFormData({ ...formData, tecnico_responsable: e.target.value })}
                        placeholder="Ej. Ing. Especialista / Taller Certificado"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Empresa Proveedora</label>
                      <input
                        type="text"
                        required
                        value={formData.proveedor}
                        onChange={e => setFormData({ ...formData, proveedor: e.target.value })}
                        placeholder="Ej. Lincoln Electric Guatemala, Miller Service"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tipo y Estado */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tipo de Mantenimiento</label>
                  <select
                    value={formData.tipo}
                    onChange={e => setFormData({ ...formData, tipo: e.target.value as TipoMantenimiento })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Preventivo">Preventivo</option>
                    <option value="Correctivo">Correctivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Estado del Servicio</label>
                  <select
                    value={formData.estado}
                    onChange={e => setFormData({ ...formData, estado: e.target.value as EstadoMantenimiento })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Programado">Programado</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Descripción del Trabajo */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Descripción del Trabajo / Falla Reportada</label>
                <textarea
                  required
                  rows={2}
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Detalles de la falla, componentes a cambiar o calibración a realizar..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                ></textarea>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha_inicio}
                    onChange={e => setFormData({ ...formData, fecha_inicio: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Fecha Estimada Fin</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha_fin}
                    onChange={e => setFormData({ ...formData, fecha_fin: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>

              {/* Costo */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Costo Estimado / Real (Quetzales GTQ)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.costo}
                  onChange={e => setFormData({ ...formData, costo: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono"
                />
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Observaciones (Opcional)</label>
                <input
                  type="text"
                  value={formData.observaciones}
                  onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Repuestos requeridos, número de orden, etc."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    'Guardando...'
                  ) : editingMantenimiento ? (
                    'Guardar Cambios'
                  ) : (
                    'Registrar Mantenimiento'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
