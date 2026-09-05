import React, { useState, useMemo } from 'react';
import { RolUsuario, Usuario } from '../types';
import { ProdimaLogo } from './ProdimaLogo';
import {
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Shield,
  HardHat,
  AlertCircle
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (usr: string, pass: string) => Promise<void>;
  loading?: boolean;
}

interface UserAccount {
  correo: string;
  username: string;
  nombre: string;
  apellido: string;
  rol: RolUsuario;
  defaultPass: string;
}

const REGISTERED_USERS: UserAccount[] = [
  {
    correo: 'admin@prodima.gt',
    username: 'admin',
    nombre: 'Admin',
    apellido: 'PRODIMA',
    rol: 'Administrador',
    defaultPass: 'Admin2026!'
  },
  {
    correo: 'ohernandez@prodima.gt',
    username: 'ohernandez',
    nombre: 'Osmar',
    apellido: 'Hernández',
    rol: 'Supervisor',
    defaultPass: 'Super2026!'
  },
  {
    correo: 'lclaveria@prodima.gt',
    username: 'lclaveria',
    nombre: 'Luis',
    apellido: 'Claveria',
    rol: 'Supervisor',
    defaultPass: 'Super2026!'
  },
  {
    correo: 'iguatemalam@miumg.edu.gt',
    username: 'iguatemala',
    nombre: 'Ilsser',
    apellido: 'Guatemala',
    rol: 'Técnico',
    defaultPass: 'Tec2026!'
  },
  {
    correo: 'dlopez@prodima.gt',
    username: 'dlopez',
    nombre: 'David',
    apellido: 'López',
    rol: 'Técnico',
    defaultPass: 'Tec2026!'
  }
];

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, loading = false }) => {
  const [email, setEmail] = useState<string>('iguatemalam@miumg.edu.gt');
  const [password, setPassword] = useState<string>('Tec2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Automatically resolve the user and their predetermined role from the entered email/username
  const detectedUser = useMemo(() => {
    const term = email.trim().toLowerCase();
    if (!term) return null;
    return (
      REGISTERED_USERS.find(
        u => u.correo.toLowerCase() === term || u.username.toLowerCase() === term
      ) || null
    );
  }, [email]);

  const handleEmailChange = (newVal: string) => {
    setEmail(newVal);
    setErrorMessage(null);

    // If matches a known account and password hasn't been manually altered, sync default pass
    const term = newVal.trim().toLowerCase();
    const match = REGISTERED_USERS.find(
      u => u.correo.toLowerCase() === term || u.username.toLowerCase() === term
    );
    if (match) {
      setPassword(match.defaultPass);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Por favor ingrese su correo corporativo.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await onLogin(cleanEmail, password || 'password123');
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Credenciales inválidas o correo no registrado en el sistema.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-10 relative overflow-hidden font-sans">
      {/* Background Decorative Glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between py-2 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-1 bg-white/95 dark:bg-slate-800/90 rounded-xl shadow-md border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center">
            <ProdimaLogo size="sm" className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-amber-500 dark:text-amber-400 tracking-wider">
                PRODIMA <span className="text-slate-900 dark:text-slate-100 font-semibold text-sm">GUATEMALA</span>
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-black uppercase tracking-wider">
                30 Años
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Soldadura Industrial & Control de Maquinaria</p>
          </div>
        </div>
      </header>

      {/* Main Centered Login Card */}
      <main className="max-w-md w-full mx-auto my-auto py-8 relative z-10">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 p-2.5 bg-white/95 dark:bg-slate-800/90 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 inline-flex items-center justify-center">
              <ProdimaLogo size="lg" className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-2 border border-slate-700">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Acceso al Sistema ERP</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
              Iniciar Sesión
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-sm">
              Ingrese sus credenciales para acceder al sistema.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Correo */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  list="registered-emails"
                  placeholder="ej. iguatemalam@miumg.edu.gt"
                  value={email}
                  onChange={e => handleEmailChange(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-700/80 text-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>

              {/* Native suggestions dropdown for convenience */}
              <datalist id="registered-emails">
                {REGISTERED_USERS.map(u => (
                  <option key={u.correo} value={u.correo}>
                    {u.nombre} {u.apellido} - {u.rol}
                  </option>
                ))}
              </datalist>

              {/* AUTOMATIC ROLE DETECTION: Single, immutable role badge */}
              {detectedUser && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="text-[11px] text-slate-300 font-semibold truncate">
                      {detectedUser.nombre} {detectedUser.apellido}
                    </div>
                  </div>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border shrink-0 ${
                      detectedUser.rol === 'Administrador'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : detectedUser.rol === 'Supervisor'
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    {detectedUser.rol}
                  </span>
                </div>
              )}
            </div>

            {/* Input Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full bg-slate-950/90 border border-slate-700/80 text-slate-100 rounded-xl pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {submitting || loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Validando permisos...</span>
                </>
              ) : (
                <>
                  <span>
                    Iniciar Sesión {detectedUser ? `como ${detectedUser.rol}` : ''}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} PRODIMA Guatemala • Sistema de Trazabilidad y Control Industrial</p>
      </footer>
    </div>
  );
};
