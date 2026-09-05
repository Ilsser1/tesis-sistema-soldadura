import React from 'react';
import { TabType } from './Sidebar';
import { RolUsuario } from '../types';
import {
  LayoutDashboard,
  Cpu,
  Link2,
  Wrench,
  Menu,
  Bell,
  UserCheck,
  FileText,
  BarChart3
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  userRole: RolUsuario;
  unreadAlertsCount: number;
  onOpenMobileDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  userRole,
  unreadAlertsCount,
  onOpenMobileDrawer
}) => {
  return (
    <nav
      aria-label="Navegación móvil"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 px-1 py-1.5 md:hidden shadow-2xl flex items-center justify-around"
    >
      {/* 1. Dashboard */}
      <button
        onClick={() => onTabChange('dashboard')}
        className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition min-h-[44px] ${
          activeTab === 'dashboard'
            ? 'text-amber-400 font-bold bg-amber-500/10'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Inicio</span>
      </button>

      {/* 2. Máquinas */}
      <button
        onClick={() => onTabChange('maquinas')}
        className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition min-h-[44px] ${
          activeTab === 'maquinas'
            ? 'text-amber-400 font-bold bg-amber-500/10'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Cpu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Máquinas</span>
      </button>

      {/* 3. Asignaciones */}
      <button
        onClick={() => onTabChange('asignaciones')}
        className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition min-h-[44px] ${
          activeTab === 'asignaciones'
            ? 'text-amber-400 font-bold bg-amber-500/10'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Link2 className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Asignadas</span>
      </button>

      {/* 4. Mantenimientos */}
      <button
        onClick={() => onTabChange('mantenimientos')}
        className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition min-h-[44px] ${
          activeTab === 'mantenimientos'
            ? 'text-amber-400 font-bold bg-amber-500/10'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Wrench className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Mantenim.</span>
      </button>

      {/* 5. Menú Completo / Más */}
      <button
        onClick={onOpenMobileDrawer}
        className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition text-slate-400 hover:text-slate-200 relative min-h-[44px]"
      >
        <div className="relative">
          <Menu className="w-5 h-5 mb-0.5 text-slate-300" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] leading-tight">Menú</span>
      </button>
    </nav>
  );
};
