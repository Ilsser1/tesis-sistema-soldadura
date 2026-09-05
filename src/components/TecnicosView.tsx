import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Tecnico, EspecialidadTecnico, Usuario } from '../types';
import {
  HardHat,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  Calendar,
  Award,
  Cpu,
  Wrench,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface TecnicoFormInputs {
  nombre: string;
  apellido: string;
  DPI: string;
  telefono: string;
  correo: string;
  especialidad: EspecialidadTecnico;
  puesto: string;
  fecha_ingreso: string;
  estado: 'Activo' | 'Inactivo';
  usuario_id?: string | number;
}

interface TecnicosViewProps {
  tecnicos: Tecnico[];
  usuarios: Usuario[];
  onCrear: (t: Partial<Tecnico>) => Promise<void>;
  onActualizar: (id: number, t: Partial<Tecnico>) => Promise<void>;
  onDesactivar: (id: number) => Promise<void>;
  isReadOnly?: boolean;
}

export const TecnicosView: React.FC<TecnicosViewProps> = ({
  tecnicos,
  usuarios,
  onCrear,
  onActualizar,
  onDesactivar,
  isReadOnly = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('TODOS');
  const [selectedTecnico, setSelectedTecnico] = useState<Tecnico | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTecnico, setEditingTecnico] = useState<Tecnico | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TecnicoFormInputs>({
    mode: 'onBlur',
    defaultValues: {
      nombre: '',
      apellido: '',
      DPI: '',
      telefono: '',
      correo: '',
      especialidad: 'Soldadura TIG (GTAW)',
      puesto: 'Técnico Especialista PRODIMA',
      fecha_ingreso: new Date().toISOString().split('T')[0],
      estado: 'Activo',
      usuario_id: ''
    }
  });

  const filteredTecnicos = (tecnicos || []).filter(t => {
    const matchesSearch =
      t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.DPI.includes(searchTerm) ||
      t.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = specialtyFilter === 'TODOS' || t.especialidad === specialtyFilter;
    return matchesSearch && matchesSpec;
  });

  const handleOpenModal = (t?: Tecnico) => {
    setSubmitError(null);
    if (t) {
      setEditingTecnico(t);
      reset({
        nombre: t.nombre,
        apellido: t.apellido,
        DPI: t.DPI,
        telefono: t.telefono,
        correo: t.correo,
        especialidad: t.especialidad,
        puesto: t.puesto,
        fecha_ingreso: t.fecha_ingreso,
        estado: t.estado,
        usuario_id: t.usuario_id || ''
      });
    } else {
      setEditingTecnico(null);
      reset({
        nombre: '',
        apellido: '',
        DPI: '',
        telefono: '',
        correo: '',
        especialidad: 'Soldadura TIG (GTAW)',
        puesto: 'Técnico Especialista en Soldadura',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        estado: 'Activo',
        usuario_id: ''
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: TecnicoFormInputs) => {
    setSubmitError(null);
    try {
      const payload: Partial<Tecnico> = {
        ...data,
        usuario_id: data.usuario_id ? Number(data.usuario_id) : null
      };
      if (editingTecnico) {
        await onActualizar(editingTecnico.id, payload);
      } else {
        await onCrear(payload);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setSubmitError(err.message || 'Error al guardar el registro del técnico.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-400" />
            Gestión de Técnicos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Administración de personal técnico, especialidades y equipos asignados.
          </p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-amber-500/10"
          >
            <Plus className="w-4 h-4" /> Registrar Técnico
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, DPI o correo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 shrink-0">Especialidad:</span>
          <select
            value={specialtyFilter}
            onChange={e => setSpecialtyFilter(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="TODOS">Todas las Especialidades</option>
            <option value="Soldadura TIG (GTAW)">Soldadura TIG (GTAW)</option>
            <option value="Soldadura MIG/MAG (GMAW)">Soldadura MIG/MAG (GMAW)</option>
            <option value="Soldadura Arco Eléctrico (SMAW)">Soldadura Arco Eléctrico (SMAW)</option>
            <option value="Soldadura Tubular (FCAW)">Soldadura Tubular (FCAW)</option>
            <option value="Soldadura Arco Sumergido (SAW)">Soldadura Arco Sumergido (SAW)</option>
            <option value="Soldadura Oxigas / Corte">Soldadura Oxigas / Corte</option>
          </select>
        </div>
      </div>

      {/* Grid Cards of Technicians */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTecnicos.map(t => (
          <div key={t.id} className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-amber-500/40 p-4 transition shadow-xl space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{t.nombre} {t.apellido}</h3>
                  <p className="text-[11px] text-amber-400 font-semibold">{t.puesto}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  t.estado === 'Activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {t.estado}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-slate-400">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-slate-200">{t.especialidad}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">DPI: {t.DPI}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 pt-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t.correo}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3 text-slate-400">
                <span className="flex items-center gap-1" title="Máquinas Asignadas Activas">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" /> {t.maquinas_asignadas_count || 0}
                </span>
                <span className="flex items-center gap-1" title="Mantenimientos Realizados">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" /> {t.mantenimientos_count || 0}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setSelectedTecnico(t)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                  title="Ver Detalles y Actividad"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                {!isReadOnly && (
                  <>
                    <button
                      onClick={() => handleOpenModal(t)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                      title="Editar Técnico"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDesactivar(t.id)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/30"
                      title="Desactivar Técnico"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedTecnico && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-sm">{selectedTecnico.nombre} {selectedTecnico.apellido}</h3>
                <p className="text-xs text-amber-400">{selectedTecnico.puesto}</p>
              </div>
              <button onClick={() => setSelectedTecnico(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Especialidad Principal</span>
                  <span className="font-bold text-slate-200">{selectedTecnico.especialidad}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Documento DPI</span>
                  <span className="font-mono font-bold text-slate-200">{selectedTecnico.DPI}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Teléfono de Contacto</span>
                  <span className="text-slate-200">{selectedTecnico.telefono}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Fecha de Ingreso</span>
                  <span className="text-slate-200">{selectedTecnico.fecha_ingreso}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block mb-2">Máquinas de Soldar Asignadas Actualmente:</span>
                {selectedTecnico.maquinas_asignadas_count ? (
                  <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Posee {selectedTecnico.maquinas_asignadas_count} máquina(s) en uso operativo activo.
                  </p>
                ) : (
                  <p className="text-slate-500">No tiene asignaciones de equipo activas en este momento.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedTecnico(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm">
                {editingTecnico ? 'Editar Técnico' : 'Registrar Nuevo Técnico'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitError && (
              <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Nombre <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('nombre', {
                      required: 'El nombre es obligatorio',
                      minLength: { value: 2, message: 'Mínimo 2 letras' },
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+$/,
                        message: 'Solo se permiten letras'
                      }
                    })}
                    placeholder="Ej. Juan José"
                    className={`w-full bg-slate-800 border rounded-lg p-2 text-slate-200 focus:outline-none transition ${
                      errors.nombre ? 'border-red-500 bg-red-500/5 focus:border-red-500' : 'border-slate-700 focus:border-amber-500'
                    }`}
                  />
                  {errors.nombre && (
                    <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.nombre.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Apellido <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('apellido', {
                      required: 'El apellido es obligatorio',
                      minLength: { value: 2, message: 'Mínimo 2 letras' },
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+$/,
                        message: 'Solo se permiten letras'
                      }
                    })}
                    placeholder="Ej. López Pérez"
                    className={`w-full bg-slate-800 border rounded-lg p-2 text-slate-200 focus:outline-none transition ${
                      errors.apellido ? 'border-red-500 bg-red-500/5 focus:border-red-500' : 'border-slate-700 focus:border-amber-500'
                    }`}
                  />
                  {errors.apellido && (
                    <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.apellido.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Documento DPI <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('DPI', {
                      required: 'El DPI es obligatorio',
                      pattern: {
                        value: /^\d{4}\s?\d{5}\s?\d{4}$|^\d{13}$/,
                        message: 'Formato: 13 dígitos numéricos (ej. 2489 12345 0101)'
                      }
                    })}
                    placeholder="2489 12345 0101"
                    className={`w-full bg-slate-800 border rounded-lg p-2 font-mono text-slate-200 focus:outline-none transition ${
                      errors.DPI ? 'border-red-500 bg-red-500/5 focus:border-red-500' : 'border-slate-700 focus:border-amber-500'
                    }`}
                  />
                  {errors.DPI && (
                    <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.DPI.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Teléfono <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('telefono', {
                      required: 'El teléfono es obligatorio',
                      pattern: {
                        value: /^(\+?502\s?)?[2-8]\d{3}[-\s]?\d{4}$|^[+]?[\d\s-]{8,15}$/,
                        message: 'Teléfono inválido (ej: +502 5544-1122)'
                      }
                    })}
                    placeholder="+502 5544-1122"
                    className={`w-full bg-slate-800 border rounded-lg p-2 text-slate-200 focus:outline-none transition ${
                      errors.telefono ? 'border-red-500 bg-red-500/5 focus:border-red-500' : 'border-slate-700 focus:border-amber-500'
                    }`}
                  />
                  {errors.telefono && (
                    <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.telefono.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Correo Electrónico <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  {...register('correo', {
                    required: 'El correo electrónico es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Ingrese un formato de correo válido'
                    }
                  })}
                  placeholder="ejemplo@prodimagt.com"
                  className={`w-full bg-slate-800 border rounded-lg p-2 text-slate-200 focus:outline-none transition ${
                    errors.correo ? 'border-red-500 bg-red-500/5 focus:border-red-500' : 'border-slate-700 focus:border-amber-500'
                  }`}
                />
                {errors.correo && (
                  <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.correo.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Especialidad <span className="text-amber-400">*</span>
                  </label>
                  <select
                    {...register('especialidad', { required: 'Seleccione una especialidad' })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Soldadura TIG (GTAW)">Soldadura TIG (GTAW)</option>
                    <option value="Soldadura MIG/MAG (GMAW)">Soldadura MIG/MAG (GMAW)</option>
                    <option value="Soldadura Arco Eléctrico (SMAW)">Soldadura Arco Eléctrico (SMAW)</option>
                    <option value="Soldadura Tubular (FCAW)">Soldadura Tubular (FCAW)</option>
                    <option value="Soldadura Arco Sumergido (SAW)">Soldadura Arco Sumergido (SAW)</option>
                    <option value="Soldadura Oxigas / Corte">Soldadura Oxigas / Corte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Puesto Operativo <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('puesto', {
                      required: 'El puesto es obligatorio',
                      minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                    })}
                    placeholder="Especialista TIG"
                    className={`w-full bg-slate-800 border rounded-lg p-2 text-slate-200 focus:outline-none transition ${
                      errors.puesto ? 'border-red-500 bg-red-500/5 focus:border-red-500' : 'border-slate-700 focus:border-amber-500'
                    }`}
                  />
                  {errors.puesto && (
                    <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.puesto.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Fecha de Ingreso <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('fecha_ingreso', { required: 'La fecha es obligatoria' })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Estado <span className="text-amber-400">*</span>
                  </label>
                  <select
                    {...register('estado', { required: 'Seleccione un estado' })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Vincular a Usuario de Cuenta (Opcional)</label>
                <select
                  {...register('usuario_id')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Sin usuario vinculado</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} {u.apellido} ({u.username} - {u.rol})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">Permite asociar al técnico con un usuario con acceso al sistema.</p>
              </div>

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
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg transition shadow-md shadow-amber-500/10 flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Guardando...' : (editingTecnico ? 'Guardar Cambios' : 'Registrar Técnico')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
