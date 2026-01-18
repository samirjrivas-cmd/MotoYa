
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<'USER' | 'DRIVER'>('USER');

  return (
    <div className="flex flex-col h-screen p-6 animate-fadeIn bg-white overflow-y-auto no-scrollbar">
      <div className="flex items-center mb-10">
        <button onClick={() => setIsRegister(false)} className="text-gray-800 text-xl">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-gray-900">
          {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
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
            {isRegister ? 'Únete a la red más rápida' : '¡Hola de nuevo! 👋'}
          </h3>
          <p className="text-gray-400 text-xs mt-1">Completa los datos para continuar</p>
        </div>

        <div className="space-y-4">
          {isRegister && (
             <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input type="text" placeholder="Juan Pérez" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                </div>
                
                {/* Campos específicos para conductores */}
                <div className="p-4 bg-blue-50 rounded-3xl space-y-4 border border-blue-100">
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] text-center">Datos de Pago (Obligatorio)</p>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Banco (Pago Móvil)</label>
                      <select className="w-full p-4 bg-white border border-blue-100 rounded-2xl outline-none font-bold text-slate-800">
                        <option value="0102">Banco de Venezuela</option>
                        <option value="0105">Mercantil</option>
                        <option value="0108">Provincial</option>
                        <option value="0134">Banesco</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Número Telefónico</label>
                      <input type="tel" placeholder="04141234567" className="w-full p-4 bg-white border border-blue-100 rounded-2xl outline-none font-bold text-slate-800" />
                   </div>
                </div>
             </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
            <input type="email" placeholder="usuario@email.com" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
            <input type="password" placeholder="••••••••" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
          </div>
        </div>

        <button 
          onClick={onLogin}
          className="w-full py-5 moto-gradient text-white font-black rounded-3xl shadow-blue-200 shadow-xl active:scale-[0.98] transition-all text-lg"
        >
          {isRegister ? 'Completar Registro' : 'Entrar'}
        </button>

        <p className="text-center text-gray-500 text-sm mt-8">
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
