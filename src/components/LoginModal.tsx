import React, { useState, useMemo } from 'react';
import { ShieldCheck, KeyRound, Mail, X, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { RolUsuario } from '../types';
import { ProdimaLogo } from './ProdimaLogo';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (usr: string, pass: string) => Promise<void>;
}

const MODAL_ACCOUNTS = [
  {
    correo: 'admin@prodima.gt',
    username: 'admin',
    nombre: 'Admin PRODIMA',
    rol: 'Administrador' as RolUsuario,
    pass: 'Admin2026!'
  },
  {
    correo: 'ohernandez@prodima.gt',
    username: 'ohernandez',
    nombre: 'Osmar Hernández',
    rol: 'Supervisor' as RolUsuario,
    pass: 'Super2026!'
  },
  {
    correo: 'lclaveria@prodima.gt',
    username: 'lclaveria',
    nombre: 'Luis Claveria',
    rol: 'Supervisor' as RolUsuario,
    pass: 'Super2026!'
  },
  {
    correo: 'iguatemalam@miumg.edu.gt',
    username: 'iguatemala',
    nombre: 'Ilsser Guatemala',
    rol: 'Técnico' as RolUsuario,
    pass: 'Tec2026!'
  },
  {
    correo: 'dlopez@prodima.gt',
    username: 'dlopez',
    nombre: 'David López',
    rol: 'Técnico' as RolUsuario,
    pass: 'Tec2026!'
  }
];

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [emailOrUser, setEmailOrUser] = useState('iguatemalam@miumg.edu.gt');
  const [password, setPassword] = useState('Tec2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matchedAccount = useMemo(() => {
    const term = emailOrUser.trim().toLowerCase();
    if (!term) return null;
    return (
      MODAL_ACCOUNTS.find(
        a => a.correo.toLowerCase() === term || a.username.toLowerCase() === term
      ) || null
    );
  }, [emailOrUser]);

  const handleEmailChange = (val: string) => {
    setEmailOrUser(val);
    setError(null);
    const term = val.trim().toLowerCase();
    const match = MODAL_ACCOUNTS.find(
      a => a.correo.toLowerCase() === term || a.username.toLowerCase() === term
    );
    if (match) {
      setPassword(match.pass);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUser.trim()) {
      setError('Por favor ingrese su correo corporativo.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onLogin(emailOrUser.trim(), password || 'password123');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con las credenciales ingresadas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1 bg-white/95 dark:bg-slate-800/90 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center">
              <ProdimaLogo size="sm" className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-100 text-sm">PRODIMA Guatemala</h3>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">30 Años</span>
              </div>
              <p className="text-[10px] text-slate-400">Iniciar Sesión</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                list="modal-emails"
                placeholder="ej. iguatemalam@miumg.edu.gt"
                value={emailOrUser}
                onChange={e => handleEmailChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl pl-9 pr-3 py-2 font-mono focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <datalist id="modal-emails">
              {MODAL_ACCOUNTS.map(u => (
                <option key={u.correo} value={u.correo}>
                  {u.nombre} - {u.rol}
                </option>
              ))}
            </datalist>

            {matchedAccount && (
              <div className="mt-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {matchedAccount.nombre}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    matchedAccount.rol === 'Administrador'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : matchedAccount.rol === 'Supervisor'
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}
                >
                  {matchedAccount.rol}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">
              Contraseña
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Accediendo...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
