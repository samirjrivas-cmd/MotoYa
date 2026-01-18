
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
  const [bank, setBank] = useState('');
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
          bank: bank, // Aquí guardamos el dato de pago que solicitas
        }
      }
    });
    if (authError) throw authError;
    if (data.user)
    setSuccessMsg('¡Cuenta creada! Revisa tu correo para confirmar.');
      const role = email.includes('chofer') ? 'DRIVER' : 'USER';
      onLogin(role)
    setIsRegister(false);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col h-screen p-8 animate-fadeIn bg-slate-50 overflow-y-auto no-scrollbar">
      <div className="flex items-center mb-8">
        <button onClick={() => { setIsRegister(false); setShowReset(false); }} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-800">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
      </div>

      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-20 h-20 moto-gradient rounded-[28px] flex items-center justify-center shadow-xl mb-4 rotate-3">
          <i className="fa-solid fa-motorcycle text-white text-3xl"></i>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">MotoYa</h1>
        <p className="text-slate-400 font-medium text-sm">Tu ciudad a un clic de distancia</p>
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 space-y-5">
        <h3 className="text-xl font-extrabold text-slate-800 text-center">
          {showReset ? 'Recuperar Cuenta' : isRegister ? 'Únete hoy' : 'Bienvenido'}
        </h3>

        <div className="space-y-4">
          {isRegister && (
            <div className="space-y-1 animate-fadeIn">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Juan Pérez" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900" 
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com" 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900 transition-all" 
            />
          </div>

          {!showReset && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900" 
              />
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-[10px] font-black text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}
        {successMsg && <p className="text-green-600 text-[10px] font-black text-center bg-green-50 p-2 rounded-lg border border-green-100">{successMsg}</p>}

        <button 
  onClick={showReset ? () => {} : (isRegister ? handleRegister : handleLogin)} // <-- Cambio aquí
  disabled={loading}
  className="w-full py-5 moto-gradient text-white font-black rounded-2xl shadow-lg active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2"
>
  {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : (showReset ? 'Enviar Link' : isRegister ? 'Registrarme' : 'Entrar')}
</button>

        <div className="flex flex-col gap-3">
          {!isRegister && !showReset && (
            <button onClick={() => setShowReset(true)} className="text-blue-600 text-[10px] font-black uppercase tracking-widest">
              ¿Olvidaste tu contraseña?
            </button>
          )}
          <button onClick={() => setIsRegister(!isRegister)} className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            {isRegister ? 'Ya tengo cuenta' : 'Crear nueva cuenta'}
          </button>
        </div>
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Al continuar, aceptas nuestros términos</p>
      </div>
    </div>
  );
};

export default LoginScreen;
