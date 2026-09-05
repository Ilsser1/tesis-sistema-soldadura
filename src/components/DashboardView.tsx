import React from 'react';
import { DashboardStats, Alerta } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  HardHat,
  Cpu,
  CheckCircle2,
  Link2,
  Wrench,
  AlertOctagon,
  Clock,
  FileCheck,
  FileWarning,
  FileX,
  Bell,
  BarChart2,
  TrendingUp,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend
} from 'recharts';

interface DashboardViewProps {
  stats: DashboardStats | null;
  alertas: Alerta[];
  onNavigate: (tab: any) => void;
  onRefresh: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  alertas: _alertas,
  onNavigate,
  onRefresh: _onRefresh
}) => {
  const { activeTheme } = useTheme();

  if (!stats) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        Cargando indicadores y métricas del sistema industrial...
      </div>
    );
  }

  // Colors for machine states
  const estadoColorMap: Record<string, string> = {
    'Disponible': '#10b981', // emerald
    'Asignada': '#06b6d4', // cyan
    'En mantenimiento': '#f59e0b', // amber
    'Fuera de servicio': '#ef4444', // red
    'Reparación': '#f43f5e', // rose
    'Baja': '#64748b' // slate
  };

  const isDark = activeTheme === 'dark';
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  // Custom tooltip for Mantenimientos por Mes
  const CustomMesTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            color: tooltipText
          }}
          className="p-3 rounded-xl border shadow-xl text-xs space-y-1 z-50"
        >
          <div className="font-bold text-amber-500">Mes: {label}</div>
          <div className="font-semibold text-slate-200">
            Mantenimientos: <span className="font-bold text-amber-400">{payload[0].value}</span>
          </div>
          <p className="text-[10px] text-slate-400">Órdenes de taller y calibraciones</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for Estados de Máquinas
  const CustomEstadoTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const color = estadoColorMap[data.estado] || '#f59e0b';
      return (
        <div
          style={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            color: tooltipText
          }}
          className="p-3 rounded-xl border shadow-xl text-xs space-y-1 z-50"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-bold">{data.estado}</span>
          </div>
          <div className="font-semibold text-slate-200">
            Total equipos: <span className="font-bold" style={{ color }}>{data.cantidad}</span>
          </div>
          <p className="text-[10px] text-slate-400">
            {Math.round((data.cantidad / (stats.totalMaquinas || 1)) * 100)}% del parque de soldadoras
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* METRIC CARDS GRID (11 Indicadores Requeridos) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        
        {/* Total Técnicos */}
        <div onClick={() => onNavigate('tecnicos')} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Técnicos</span>
            <HardHat className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.totalTecnicos}</div>
          <div className="text-[10px] text-slate-500 mt-1">Personal calificado</div>
        </div>

        {/* Total Máquinas */}
        <div onClick={() => onNavigate('maquinas')} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Total Máquinas</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.totalMaquinas}</div>
          <div className="text-[10px] text-slate-500 mt-1">Equipos en catálogo</div>
        </div>

        {/* Disponibles */}
        <div onClick={() => onNavigate('maquinas')} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Disponibles</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.maquinasDisponibles}</div>
          <div className="text-[10px] text-slate-500 mt-1">Listas para asignación</div>
        </div>

        {/* Asignadas */}
        <div onClick={() => onNavigate('asignaciones')} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Asignadas</span>
            <Link2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400">{stats.maquinasAsignadas}</div>
          <div className="text-[10px] text-slate-500 mt-1">En trabajo operativo</div>
        </div>

        {/* En Mantenimiento */}
        <div onClick={() => onNavigate('mantenimientos')} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Mantenimiento</span>
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{stats.maquinasEnMantenimiento}</div>
          <div className="text-[10px] text-slate-500 mt-1">Preventivo/Correctivo</div>
        </div>

        {/* Fuera de Servicio */}
        <div onClick={() => onNavigate('maquinas')} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-red-500/40 cursor-pointer transition shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Fuera Servicio</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.maquinasFueraDeServicio}</div>
          <div className="text-[10px] text-slate-500 mt-1">Inactivas / Reparación</div>
        </div>

        {/* Mantenimientos Pendientes */}
        <div onClick={() => onNavigate('mantenimientos')} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Maint. Pendientes</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400">{stats.mantenimientosPendientes}</div>
          <div className="text-[10px] text-slate-500 mt-1">Programados o en proceso</div>
        </div>

        {/* Contratos Vigentes */}
        <div onClick={() => onNavigate('contratos')} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Ctrs. Vigentes</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.contratosVigentes}</div>
          <div className="text-[10px] text-slate-500 mt-1">Garantía activa</div>
        </div>

        {/* Contratos Próximos a Vencer */}
        <div onClick={() => onNavigate('contratos')} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-amber-500/40 cursor-pointer transition shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Ctrs. Prox. Vencer</span>
            <FileWarning className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{stats.contratosProximosVencer}</div>
          <div className="text-[10px] text-slate-500 mt-1">Expiración cercana</div>
        </div>

        {/* Contratos Vencidos */}
        <div onClick={() => onNavigate('contratos')} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-red-500/40 cursor-pointer transition shadow">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Ctrs. Vencidos</span>
            <FileX className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.contratosVencidos}</div>
          <div className="text-[10px] text-slate-500 mt-1">Requieren renovación</div>
        </div>

        {/* Alertas Pendientes */}
        <div onClick={() => onNavigate('alertas')} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-red-500/40 cursor-pointer transition shadow col-span-2">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Alertas de Sistema Sin Leer</span>
            <Bell className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-red-400">{stats.alertasPendientes}</span>
            <span className="text-xs text-slate-400">alertas críticas y advertencias</span>
          </div>
          <div className="text-[10px] text-amber-400 mt-1 font-medium">
            Ver Centro de Alertas →
          </div>
        </div>

      </div>

      {/* RECHARTS SECTION: Mantenimientos por Mes & Distribución de Estados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. GRÁFICA DE BARRAS: Mantenimientos Realizados por Mes */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Mantenimientos Realizados por Mes</h3>
                <p className="text-[11px] text-slate-400">Volumen histórico y preventivo anual</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('mantenimientos')}
              className="text-xs font-semibold text-amber-400 hover:underline"
            >
              Ver Taller →
            </button>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.mantenimientosPorMes}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} vertical={false} />
                <XAxis
                  dataKey="mes"
                  stroke={axisColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: gridColor }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke={axisColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: gridColor }}
                />
                <Tooltip content={<CustomMesTooltip />} />
                <Bar
                  dataKey="cantidad"
                  name="Mantenimientos"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Total registradas en el ciclo:</span>
            <span className="font-bold text-amber-400">
              {stats.mantenimientosPorMes.reduce((acc, curr) => acc + curr.cantidad, 0)} intervenciones
            </span>
          </div>
        </div>

        {/* 2. GRÁFICA DE BARRAS: Distribución de Estados de las Máquinas */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Distribución de Estados de Máquinas</h3>
                <p className="text-[11px] text-slate-400">Estado operativo actual del parque de soldadoras</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('maquinas')}
              className="text-xs font-semibold text-blue-400 hover:underline"
            >
              Ver Catálogo →
            </button>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.maquinasPorEstado}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} vertical={false} />
                <XAxis
                  dataKey="estado"
                  stroke={axisColor}
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  axisLine={{ stroke: gridColor }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke={axisColor}
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: gridColor }}
                />
                <Tooltip content={<CustomEstadoTooltip />} />
                <Bar
                  dataKey="cantidad"
                  name="Máquinas"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                >
                  {stats.maquinasPorEstado.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={estadoColorMap[entry.estado] || '#6366f1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Total equipos monitoreados:</span>
            <span className="font-bold text-slate-200">
              {stats.totalMaquinas} máquinas ({stats.maquinasDisponibles} disp. / {stats.maquinasAsignadas} asig.)
            </span>
          </div>
        </div>

      </div>

      {/* Máquinas Asignadas por Técnico */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
          <span>Máquinas Asignadas por Técnico</span>
          <span className="text-xs text-slate-500 font-normal">Carga operativa activa en planta y taller</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stats.maquinasPorTecnico.length === 0 ? (
            <p className="text-xs text-slate-500 col-span-full">No hay máquinas asignadas actualmente.</p>
          ) : (
            stats.maquinasPorTecnico.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                <span className="text-xs font-semibold text-slate-200">{item.tecnico}</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {item.cantidad} equipo(s)
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
