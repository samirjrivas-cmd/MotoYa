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
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError('');
    setSuccessMsg('');
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Determinamos el rol (En una app real, esto vendría de una tabla 'profiles')
      // Para la demo, usamos el dominio como indicador de rol
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
    setSuccessMsg('');
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            bank_info: bank,
          },
        },
      });

      if (signUpError) throw signUpError;
      setSuccessMsg('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccessMsg('');
    if (!email) {
      setError('Ingresa tu email para continuar.');
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;
      setSuccessMsg('Se ha enviado un enlace de recuperación a tu correo.');
      setTimeout(() => setShowReset(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 animate-fadeIn bg-white overflow-y-auto no-scrollbar">
      <div className="flex items-center mb-10">
        <button onClick={() => { setIsRegister(false); setShowReset(false); }} className="text-gray-800 text-xl">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-gray-900">
          {showReset ? 'Recuperar Acceso' : isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h1>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 moto-gradient rounded-3xl flex items-center justify-center shadow-lg mb-4">
          <i className="fa-solid fa-motorcycle text-white text-3xl"></i>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">MotoYa</h2>
      </div>

      <div className="space-y-6 pb-10">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800">
            {showReset ? '¿Olvidaste tu clave?' : isRegister ? 'Únete a la red más rápida' : '¡Hola de nuevo! 👋'}
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            {showReset ? 'Te enviaremos un link a tu correo' : 'Completa los datos para continuar'}
          </p>
        </div>

        <div className="space-y-4">
          {isRegister && !showReset && (
             <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Juan Pérez" 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-black" 
                  />
                </div>
                
                <div className="p-4 bg-blue-50 rounded-3xl space-y-4 border border-blue-100">
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] text-center">Datos de Pago</p>
                   <div className="space-y-1">
                      <select 
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="w-full p-4 bg-white border border-blue-100 rounded-2xl outline-none font-bold text-black appearance-none"
                      >
                        <option value="">Selecciona tu banco</option>
                        <option value="0102">0102 - Banco de Venezuela</option>
                        <option value="0134">0134 - Banesco</option>
                      </select>
                   </div>
                </div>
             </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com" 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-black transition-colors" 
            />
          </div>

          {!showReset && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-black transition-colors" 
              />
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-xs font-bold text-center animate-shake">{error}</p>}
        {successMsg && <p className="text-green-600 text-xs font-bold text-center bg-green-50 p-3 rounded-xl border border-green-100">{successMsg}</p>}

        {!showReset ? (
          <button 
            onClick={isRegister ? handleRegister : handleLogin}
            disabled={loading}
            className="w-full py-5 moto-gradient text-white font-black rounded-3xl shadow-xl active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2"
          >
            {loading && <i className="fa-solid fa-circle-notch animate-spin"></i>}
            {isRegister ? 'Registrarme' : 'Entrar'}
          </button>
        ) : (
          <button 
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2"
          >
            {loading && <i className="fa-solid fa-circle-notch animate-spin"></i>}
            Enviar Enlace
          </button>
        )}

        {!isRegister && !showReset && (
          <button onClick={() => setShowReset(true)} className="w-full text-center text-blue-600 text-xs font-bold uppercase tracking-widest">
            ¿Olvidaste tu contraseña?
          </button>
        )}

        <p className="text-center text-gray-500 text-sm">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes una cuenta?'} 
          <button onClick={() => setIsRegister(!isRegister)} className="text-blue-600 font-black ml-1 uppercase text-xs tracking-widest">
            {isRegister ? 'Inicia Sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;