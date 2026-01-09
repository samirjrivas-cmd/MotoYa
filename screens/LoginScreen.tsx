
import React from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col h-screen p-6 animate-fadeIn">
      <div className="flex items-center mb-10">
        <button className="text-gray-800 text-xl">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-gray-900">Iniciar Sesión</h1>
      </div>

      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 moto-gradient rounded-3xl flex items-center justify-center shadow-lg mb-4">
          <i className="fa-solid fa-motorcycle text-white text-4xl"></i>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">MotoYa</h2>
        <p className="text-gray-500 text-sm mt-1">Tu viaje seguro y rápido</p>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800">¡Hola de nuevo! 👋</h3>
          <p className="text-gray-400 text-sm mt-1">Ingresa tus datos para continuar</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Correo o teléfono</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="ej. usuario@email.com"
                className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-400"
              />
              <i className="fa-solid fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Contraseña</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-400"
              />
              <i className="fa-solid fa-eye-slash absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="text-blue-500 text-sm font-medium">¿Olvidaste tu contraseña?</button>
        </div>

        <button 
          onClick={onLogin}
          className="w-full py-4 moto-gradient text-white font-bold rounded-2xl shadow-blue-200 shadow-xl active:scale-[0.98] transition-all"
        >
          Iniciar Sesión
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium">O continúa con</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
            <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-5 h-5" alt="Google" />
            <span className="font-semibold text-gray-700">Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
            <i className="fa-brands fa-apple text-xl text-gray-900"></i>
            <span className="font-semibold text-gray-700">Apple</span>
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          ¿No tienes una cuenta? <button className="text-blue-500 font-bold">Regístrate</button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
