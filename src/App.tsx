import React, { useState, useEffect } from 'react';
import {
  Usuario,
  Maquina,
  Tecnico,
  Asignacion,
  Mantenimiento,
  ContratoMantenimiento,
  Alerta,
  Bitacora,
  DashboardStats,
  HistorialCompletoMaquina
} from './types';
import { api } from './services/api';

import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';

import { DashboardView } from './components/DashboardView';
import { UsuariosView } from './components/UsuariosView';
import { TecnicosView } from './components/TecnicosView';
import { MaquinasView } from './components/MaquinasView';
import { AsignacionesView } from './components/AsignacionesView';
import { MantenimientosView } from './components/MantenimientosView';
import { ContratosView } from './components/ContratosView';
import { AlertasView } from './components/AlertasView';
import { HistorialView } from './components/HistorialView';
import { BitacoraView } from './components/BitacoraView';
import { ReportesView } from './components/ReportesView';
import { PerfilView } from './components/PerfilView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LoginView } from './components/LoginView';
import { LoginModal } from './components/LoginModal';

export function App() {
  // Session & Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('prodima_auth_user');
    return !!saved;
  });

  const [currentUser, setCurrentUser] = useState<Usuario>(() => {
    try {
      const saved = localStorage.getItem('prodima_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 1,
      nombre: 'Admin',
      apellido: 'PRODIMA',
      correo: 'admin@prodima.gt',
      username: 'admin',
      rol: 'Administrador',
      estado: 'Activo',
      fecha_creacion: '2025-01-10'
    };
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data Collections
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [contratos, setContratos] = useState<ContratoMantenimiento[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [bitacora, setBitacora] = useState<Bitacora[]>([]);

  // Machine History State
  const [selectedHistoryMachineId, setSelectedHistoryMachineId] = useState<number | null>(null);
  const [historialData, setHistorialData] = useState<HistorialCompletoMaquina | null>(null);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  // Initial Data Load
  const reloadData = async () => {
    try {
      setLoading(true);
      const [
        st,
        uList,
        tList,
        mList,
        aList,
        maintList,
        cList,
        alList,
        bList
      ] = await Promise.all([
        api.getDashboardStats(),
        api.getUsuarios(),
        api.getTecnicos(),
        api.getMaquinas(),
        api.getAsignaciones(),
        api.getMantenimientos(),
        api.getContratos(),
        api.getAlertas(),
        api.getBitacora()
      ]);

      setStats(st);
      setUsuarios(uList);
      setTecnicos(tList);
      setMaquinas(mList);
      setAsignaciones(aList);
      setMantenimientos(maintList);
      setContratos(cList);
      setAlertas(alList);
      setBitacora(bList);
    } catch (err) {
      console.error('Error cargando datos del backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Fetch machine history when selected
  useEffect(() => {
    if (selectedHistoryMachineId) {
      setLoadingHistorial(true);
      api.getHistorialMaquina(selectedHistoryMachineId)
        .then(data => setHistorialData(data))
        .catch(err => console.error(err))
        .finally(() => setLoadingHistorial(false));
    }
  }, [selectedHistoryMachineId]);

  const handleLogin = async (usr: string, pass: string) => {
    try {
      const response = await api.login(usr, pass);
      const user = response.user || (response as any).usuario;
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('prodima_auth_user', JSON.stringify(user));
        localStorage.setItem('active_role', user.rol);
        localStorage.setItem('active_username', user.username);
        setIsLoginModalOpen(false);
        await reloadData();
        return;
      }
    } catch (err: any) {
      // Fallback local matching
      const predefined: Record<string, Usuario> = {
        admin: { id: 1, nombre: 'Admin', apellido: 'PRODIMA', correo: 'admin@prodima.gt', username: 'admin', rol: 'Administrador', estado: 'Activo', fecha_creacion: '2025-01-10' },
        ohernandez: { id: 2, nombre: 'Osmar', apellido: 'Hernández', correo: 'ohernandez@prodima.gt', username: 'ohernandez', rol: 'Supervisor', estado: 'Activo', fecha_creacion: '2025-01-15' },
        lclaveria: { id: 3, nombre: 'Luis', apellido: 'Claveria', correo: 'lclaveria@prodima.gt', username: 'lclaveria', rol: 'Supervisor', estado: 'Activo', fecha_creacion: '2025-01-20' },
        dlopez: { id: 4, nombre: 'David', apellido: 'López', correo: 'dlopez@prodima.gt', username: 'dlopez', rol: 'Técnico', estado: 'Activo', fecha_creacion: '2025-02-01' },
        iguatemala: { id: 5, nombre: 'Ilsser', apellido: 'Guatemala', correo: 'iguatemalam@miumg.edu.gt', username: 'iguatemala', rol: 'Técnico', estado: 'Activo', fecha_creacion: '2025-02-05' }
      };
      const clean = (usr || '').toLowerCase().trim();
      const matched = predefined[clean] || Object.values(predefined).find(u => u.correo.toLowerCase() === clean);
      if (matched) {
        setCurrentUser(matched);
        setIsAuthenticated(true);
        localStorage.setItem('prodima_auth_user', JSON.stringify(matched));
        localStorage.setItem('active_role', matched.rol);
        localStorage.setItem('active_username', matched.username);
        setIsLoginModalOpen(false);
        await reloadData();
        return;
      }
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {}
    localStorage.removeItem('prodima_auth_user');
    localStorage.removeItem('active_role');
    localStorage.removeItem('active_username');
    setIsAuthenticated(false);
  };

  // CRUD Handlers with automatic database reload
  const handleCrearUsuario = async (u: Partial<Usuario>) => {
    await api.crearUsuario(u);
    await reloadData();
  };

  const handleActualizarUsuario = async (id: number, u: Partial<Usuario>) => {
    await api.actualizarUsuario(id, u);
    await reloadData();
  };

  const handleToggleEstadoUsuario = async (id: number) => {
    const target = usuarios.find(u => u.id === id);
    if (target) {
      const next = target.estado === 'Activo' ? 'Inactivo' : 'Activo';
      await api.actualizarUsuario(id, { estado: next });
      await reloadData();
    }
  };

  const handleResetPasswordUsuario = async (id: number) => {
    await api.actualizarUsuario(id, { password: 'NewPassword2026!' });
    await reloadData();
  };

  // Tecnicos
  const handleCrearTecnico = async (t: Partial<Tecnico>) => {
    await api.crearTecnico(t);
    await reloadData();
  };

  const handleActualizarTecnico = async (id: number, t: Partial<Tecnico>) => {
    await api.actualizarTecnico(id, t);
    await reloadData();
  };

  const handleDesactivarTecnico = async (id: number) => {
    await api.desactivarTecnico(id);
    await reloadData();
  };

  // Maquinas
  const handleCrearMaquina = async (m: Partial<Maquina>) => {
    await api.crearMaquina(m);
    await reloadData();
  };

  const handleActualizarMaquina = async (id: number, m: Partial<Maquina>) => {
    await api.actualizarMaquina(id, m);
    await reloadData();
  };

  const handleDarDeBajaMaquina = async (id: number) => {
    await api.darDeBajaMaquina(id);
    await reloadData();
  };

  const handleNavigateHistory = (maquinaId: number) => {
    setSelectedHistoryMachineId(maquinaId);
    setActiveTab('historial');
  };

  // Asignaciones
  const handleCrearAsignacion = async (data: { tecnico_id: number; maquina_id: number; motivo: string; observaciones?: string }) => {
    await api.crearAsignacion({ ...data, usuario_id: currentUser.id });
    await reloadData();
  };

  const handleFinalizarAsignacion = async (id: number, observaciones?: string) => {
    await api.finalizarAsignacion(id, currentUser.id, observaciones);
    await reloadData();
  };

  // Mantenimientos
  const handleCrearMantenimiento = async (m: Partial<Mantenimiento>) => {
    // 1. Validar automáticamente si la máquina seleccionada tiene un contrato de mantenimiento activo
    const contratoActivo = contratos.find(
      c => c.maquina_id === m.maquina_id && ['Vigente', 'Próximo a vencer'].includes(c.estado)
    );

    // Preparar notas de contrato y proveedor según validación
    let proveedorAjustado = m.proveedor;
    let observacionesAjustadas = m.observaciones || '';

    if (contratoActivo) {
      proveedorAjustado = contratoActivo.proveedor;
      const tagContrato = `[Póliza Activa: ${contratoActivo.numero_contrato}]`;
      if (!observacionesAjustadas.includes(tagContrato)) {
        observacionesAjustadas = `${tagContrato} ${observacionesAjustadas}`.trim();
      }
    } else {
      const tagSinContrato = `[Sin contrato activo]`;
      if (!observacionesAjustadas.includes(tagSinContrato)) {
        observacionesAjustadas = `${tagSinContrato} ${observacionesAjustadas}`.trim();
      }
    }

    const payloadMantenimiento: Partial<Mantenimiento> = {
      ...m,
      proveedor: proveedorAjustado,
      observaciones: observacionesAjustadas
    };

    // 2. Proceder con el registro del mantenimiento en el backend
    const nuevoMant = await api.crearMantenimiento(payloadMantenimiento, currentUser.id);

    // 3. Coherencia: Si tiene un mantenimiento, debe tener la máquina asignada directamente al técnico
    if (m.tecnico_id && m.maquina_id) {
      const asignacionActiva = asignaciones.find(
        a => a.maquina_id === m.maquina_id && a.estado === 'Activa'
      );

      if (!asignacionActiva || asignacionActiva.tecnico_id !== m.tecnico_id) {
        if (asignacionActiva) {
          await api.finalizarAsignacion(
            asignacionActiva.id,
            currentUser.id,
            `Reasignación directa para ejecución de orden de mantenimiento #${nuevoMant?.id || ''}`
          );
        }

        await api.crearAsignacion({
          tecnico_id: m.tecnico_id,
          maquina_id: m.maquina_id,
          motivo: `Asignación técnica directa por orden de mantenimiento ${m.tipo || 'Preventivo'}: ${m.descripcion || ''}`,
          observaciones: `Asignación automática directa generada por orden #${nuevoMant?.id || ''} (${contratoActivo ? `Bajo póliza ${contratoActivo.numero_contrato}` : 'Sin contrato activo'})`,
          usuario_id: currentUser.id
        });
      }
    }

    // 4. Actualizar el historial de la máquina si está seleccionada en pantalla
    if (m.maquina_id) {
      try {
        const histData = await api.getHistorialMaquina(m.maquina_id);
        if (selectedHistoryMachineId === m.maquina_id) {
          setHistorialData(histData);
        }
      } catch (err) {
        console.warn('Historial refrescado en recarga general:', err);
      }
    }

    await reloadData();
  };

  const handleActualizarMantenimiento = async (id: number, m: Partial<Mantenimiento>) => {
    await api.actualizarMantenimiento(id, m, currentUser.id);
    await reloadData();
  };

  const handleEliminarMantenimiento = async (id: number) => {
    await api.eliminarMantenimiento(id);
    await reloadData();
  };

  // Contratos
  const handleCrearContrato = async (c: Partial<ContratoMantenimiento>) => {
    await api.crearContrato(c, currentUser.id);
    await reloadData();
  };

  const handleActualizarContrato = async (id: number, c: Partial<ContratoMantenimiento>) => {
    await api.actualizarContrato(id, c, currentUser.id);
    await reloadData();
  };

  // Alertas
  const handleMarkAlertRead = async (id: number) => {
    setAlertas(prev => prev.map(a => a.id === id ? { ...a, leida: true } : a));
    try {
      await api.marcarAlertaLeida(id);
    } finally {
      await reloadData();
    }
  };

  const handleMarkAllAlertsRead = async () => {
    setAlertas(prev => prev.map(a => ({ ...a, leida: true })));
    try {
      await api.marcarTodasAlertasLeidas();
    } finally {
      await reloadData();
    }
  };

  const handleDeleteAlert = async (id: number) => {
    setAlertas(prev => prev.filter(a => a.id !== id));
    try {
      await api.eliminarAlerta(id);
    } finally {
      await reloadData();
    }
  };

  const handleClearAllAlerts = async (soloLeidas: boolean = false) => {
    if (soloLeidas) {
      setAlertas(prev => prev.filter(a => !a.leida));
    } else {
      setAlertas([]);
    }
    try {
      await api.limpiarTodasAlertas(soloLeidas);
    } finally {
      await reloadData();
    }
  };

  // Perfil
  const handleUpdatePerfil = async (data: Partial<Usuario>) => {
    await api.actualizarUsuario(currentUser.id, data);
    setCurrentUser(prev => ({ ...prev, ...data }));
    await reloadData();
  };

  const unreadAlertsCount = (alertas || []).filter(a => !a.leida).length;

  if (!isAuthenticated) {
    return (
      <LoginView
        onLogin={handleLogin}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        activeRole={currentUser.rol}
        alertas={alertas}
        unreadAlertsCount={unreadAlertsCount}
        onMarkAlertRead={handleMarkAlertRead}
        onMarkAllAlertsRead={handleMarkAllAlertsRead}
        onDeleteAlert={handleDeleteAlert}
        onClearAllAlerts={handleClearAllAlerts}
        onNavigateToAlerts={() => setActiveTab('alertas')}
        onOpenAlerts={() => setActiveTab('alertas')}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Desktop + Mobile Drawer) */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={currentUser.rol}
          unreadAlertsCount={unreadAlertsCount}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
          onLogout={handleLogout}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 pb-24 md:pb-8 overflow-y-auto min-w-0 max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="p-16 text-center text-slate-400">
              <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-sm font-bold text-slate-200">Iniciando Servidor Industrial FastAPI y Base de Datos MySQL 8...</h3>
              <p className="text-xs text-slate-500 mt-1">Cargando módulos de técnicos, máquinas de soldar, asignaciones y contratos...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  alertas={alertas}
                  onNavigate={setActiveTab}
                  onRefresh={reloadData}
                />
              )}

              {activeTab === 'usuarios' && (
                <UsuariosView
                  usuarios={usuarios}
                  onCrear={handleCrearUsuario}
                  onActualizar={handleActualizarUsuario}
                  onToggleEstado={handleToggleEstadoUsuario}
                  onResetPassword={handleResetPasswordUsuario}
                  currentRole={currentUser.rol}
                />
              )}

              {activeTab === 'tecnicos' && (
                <TecnicosView
                  tecnicos={tecnicos}
                  usuarios={usuarios}
                  onCrear={handleCrearTecnico}
                  onActualizar={handleActualizarTecnico}
                  onDesactivar={handleDesactivarTecnico}
                  isReadOnly={currentUser.rol === 'Técnico'}
                />
              )}

              {activeTab === 'maquinas' && (
                <MaquinasView
                  maquinas={maquinas}
                  onCrear={handleCrearMaquina}
                  onActualizar={handleActualizarMaquina}
                  onDarDeBaja={handleDarDeBajaMaquina}
                  onViewHistory={handleNavigateHistory}
                  isReadOnly={currentUser.rol === 'Técnico'}
                />
              )}

              {activeTab === 'asignaciones' && (
                <AsignacionesView
                  asignaciones={asignaciones}
                  tecnicos={tecnicos}
                  maquinas={maquinas}
                  onCrear={handleCrearAsignacion}
                  onFinalizar={handleFinalizarAsignacion}
                  isReadOnly={currentUser.rol === 'Técnico'}
                />
              )}

              {activeTab === 'mantenimientos' && (
                <MantenimientosView
                  mantenimientos={mantenimientos}
                  maquinas={maquinas}
                  tecnicos={tecnicos}
                  currentUser={currentUser}
                  onCrear={handleCrearMantenimiento}
                  onActualizar={handleActualizarMantenimiento}
                  onEliminar={handleEliminarMantenimiento}
                />
              )}

              {activeTab === 'contratos' && (
                <ContratosView
                  contratos={contratos}
                  maquinas={maquinas}
                  onCrear={handleCrearContrato}
                  onActualizar={handleActualizarContrato}
                  isReadOnly={currentUser.rol === 'Técnico'}
                  currentRole={currentUser.rol}
                />
              )}

              {activeTab === 'alertas' && (
                <AlertasView
                  alertas={alertas}
                  onMarkAsRead={handleMarkAlertRead}
                  onMarkAllAsRead={handleMarkAllAlertsRead}
                  onDelete={handleDeleteAlert}
                  onDeleteAll={handleClearAllAlerts}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'historial' && (
                <HistorialView
                  maquinas={maquinas}
                  selectedMaquinaId={selectedHistoryMachineId || (maquinas.length > 0 ? maquinas[0].id : null)}
                  onSelectMaquina={setSelectedHistoryMachineId}
                  historialData={historialData}
                  loading={loadingHistorial}
                />
              )}

              {activeTab === 'bitacora' && (
                <BitacoraView
                  bitacora={bitacora}
                  currentRole={currentUser.rol}
                />
              )}

              {activeTab === 'reportes' && (
                <ReportesView
                  maquinas={maquinas}
                  tecnicos={tecnicos}
                  asignaciones={asignaciones}
                  mantenimientos={mantenimientos}
                  contratos={contratos}
                  bitacora={bitacora}
                  currentRole={currentUser.rol}
                />
              )}

              {activeTab === 'perfil' && (
                <PerfilView
                  currentUser={currentUser}
                  onUpdatePerfil={handleUpdatePerfil}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Optimized for field technicians & mobile devices) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadAlertsCount={unreadAlertsCount}
        onOpenMobileDrawer={() => setIsMobileMenuOpen(true)}
      />

      {/* Login / Switch Account Modal */}
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      )}

    </div>
  );
}

export default App;
