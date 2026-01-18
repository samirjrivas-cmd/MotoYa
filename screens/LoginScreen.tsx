
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface LoginScreenProps {
  onLogin: (role: 'USER' | 'DRIVER') => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [bank, setBank] = useState('Banco de Venezuela');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Formato de email inválido.');
      return false;
    }
    if (password.length < 6) {
      setError('Mínimo 6 caracteres.');
      return false;
    }
    if (isRegister && !fullName) {
      setError('El nombre es obligatorio.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError('');
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      const role = email.includes('chofer') ? 'DRIVER' : 'USER';
      onLogin(role);
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' ? 'Credenciales incorrectas.' : err.message);
    } finally {
      setLoading(false);
    }
  };
   
  const handleRegister = async () => {
    setError('');
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            bank_name: bank
          }
        }
      });
      if (authError) throw authError;
      if (data?.user) {
        setSuccessMsg('¡Cuenta creada!');
        const role = email.includes('chofer') ? 'DRIVER' : 'USER';
        setTimeout(() => onLogin(role), 1500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-8 bg-slate-50 animate-fadeIn overflow-y-auto">
      {/* Botón Volver */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => { setIsRegister(false); setShowReset(false); setError(''); }} 
          className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors border border-slate-100"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
      </div>

      {/* Cabecera Visual */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-20 h-20 moto-gradient rounded-[28px] flex items-center justify-center shadow-2xl shadow-blue-200 mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <i className="fa-solid fa-motorcycle text-white text-3xl"></i>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">MotoYa</h1>
        <p className="text-slate-400 font-semibold text-xs px-6 tracking-tight">Tu ciudad a un clic de distancia</p>
      </div>

      {/* Tarjeta de Formulario */}
      <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-slate-200 border border-white space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-black text-slate-800">
            {showReset ? 'Recuperar' : isRegister ? 'Únete hoy' : 'Bienvenido'}
          </h3>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            {showReset ? 'Escribe tu correo' : isRegister ? 'Registra tus datos' : 'Ingresa para continuar'}
          </p>
        </div>

        <div className="space-y-4">
          {isRegister && (
  <>
    {/* Campo Nombre Completo */}
    <div className="space-y-1 animate-fadeIn">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
      <input 
        type="text" 
        value={fullName} 
        onChange={(e) => setFullName(e.target.value)} 
        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900" 
      />
    </div>

    {/* Campo del Banco - AQUÍ DEBE IR */}
    <div className="space-y-1 animate-fadeIn">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tu Banco</label>
      <select 
        value={bank} 
        onChange={(e) => setBank(e.target.value)}
        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none"
      >
        <option value="">Selecciona tu banco</option>
        <option value="Banco de Venezuela">0102 - Banco de Venezuela</option>
        <option value="Banesco">0134 - Banesco</option>
        <option value="Mercantil">0105 - Mercantil</option>
      </select>
    </div>
  </>
)}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Correo Electrónico</label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300" 
              />
            </div>
          </div>

          {!showReset && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Contraseña</label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300" 
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 animate-shake">
            <i className="fa-solid fa-circle-exclamation"></i>
            <p className="text-[11px] font-black uppercase tracking-tight">{error}</p>
          </div>
        )}
        
        {successMsg && (
          <div className="bg-green-50 text-green-600 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
            <i className="fa-solid fa-circle-check"></i>
            <p className="text-[11px] font-black uppercase tracking-tight">{successMsg}</p>
          </div>
        )}

        <button 
          onClick={showReset ? () => {} : (isRegister ? handleRegister : handleLogin)}
          disabled={loading}
          className="w-full py-5 moto-gradient text-white font-black rounded-[24px] shadow-xl shadow-blue-200 active:scale-[0.97] transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <i className="fa-solid fa-circle-notch animate-spin text-2xl"></i>
          ) : (
            <>
              <span>{showReset ? 'Enviar Link' : isRegister ? 'Registrarme' : 'Entrar'}</span>
              <i className="fa-solid fa-arrow-right-long opacity-50"></i>
            </>
          )}
        </button>

        <div className="flex flex-col gap-4 pt-2">
          {!isRegister && !showReset && (
            <button 
              onClick={() => { setShowReset(true); setError(''); }} 
              className="text-blue-600 text-[10px] font-black uppercase tracking-[0.15em] hover:text-blue-700 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}
          <button 
            onClick={() => { setIsRegister(!isRegister); setShowReset(false); setError(''); }} 
            className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] hover:text-slate-600 transition-colors"
          >
            {isRegister ? 'Ya tengo cuenta • Entrar' : '¿No tienes cuenta? • Crear una'}
          </button>
        </div>
      </div>
      
      {/* Footer legal */}
      <div className="mt-auto pt-10 text-center pb-4">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
          Protegido por MotoYa Security Hub
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
