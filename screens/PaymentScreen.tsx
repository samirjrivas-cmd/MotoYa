
import React, { useState } from 'react';

interface PaymentScreenProps {
  onBack: () => void;
  onGoToHistory: () => void;
}

type PaymentView = 'LIST' | 'ADD_CARD' | 'ADD_MOBILE' | 'ADD_ZELLE' | 'ADD_PAYPAL';

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onBack, onGoToHistory }) => {
  const [view, setView] = useState<PaymentView>('LIST');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('LIST');
    }, 1500);
  };

  const Header = ({ title }: { title: string }) => (
    <div className="flex items-center mb-8">
      <button onClick={() => setView('LIST')} className="text-gray-800 text-xl w-10 h-10 flex items-center">
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <h1 className="flex-1 text-center font-bold text-lg pr-10 text-gray-900">{title}</h1>
    </div>
  );

  if (view === 'ADD_ZELLE') {
    return (
      <div className="flex flex-col h-screen p-6 bg-white animate-fadeIn">
        <Header title="Configurar Zelle" />
        <div className="space-y-6">
          <div className="bg-purple-600 rounded-[32px] p-8 text-white shadow-xl shadow-purple-100 relative overflow-hidden">
            <i className="fa-solid fa-z absolute -right-4 -top-4 text-9xl opacity-10"></i>
            <h3 className="text-3xl font-black mb-1 italic">Zelle®</h3>
            <p className="text-purple-100 text-xs font-bold uppercase tracking-widest">Pagos Internacionales</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Correo Zelle</label>
              <input type="email" placeholder="ejemplo@email.com" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nombre del Titular</label>
              <input type="text" placeholder="Nombre completo" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 font-bold" />
            </div>
          </div>
          <button onClick={handleSave} disabled={isLoading} className="w-full py-5 bg-purple-600 text-white font-bold rounded-3xl shadow-xl shadow-purple-100 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
            {isLoading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Vincular cuenta Zelle'}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'ADD_PAYPAL') {
    return (
      <div className="flex flex-col h-screen p-6 bg-white animate-fadeIn">
        <Header title="Vincular PayPal" />
        <div className="space-y-6">
          <div className="bg-[#003087] rounded-[32px] p-8 text-white shadow-xl shadow-blue-100 flex flex-col items-center">
            <i className="fa-brands fa-paypal text-6xl mb-4"></i>
            <p className="text-blue-200 text-xs font-black uppercase tracking-[0.3em]">Checkout seguro</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Correo de cuenta PayPal</label>
              <input type="email" placeholder="usuario@paypal.com" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 font-bold" />
            </div>
          </div>
          <button onClick={handleSave} disabled={isLoading} className="w-full py-5 bg-[#0070ba] text-white font-bold rounded-3xl shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
            {isLoading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Autorizar con PayPal'}
          </button>
          <p className="text-center text-[10px] text-gray-400 px-6 italic">Serás redirigido a la plataforma oficial de PayPal para autorizar los pagos automáticos de MotoYa.</p>
        </div>
      </div>
    );
  }

  if (view === 'ADD_MOBILE') {
    return (
      <div className="flex flex-col h-screen p-6 bg-white animate-fadeIn">
        <Header title="Configurar Pago Móvil" />
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-4 border border-blue-100">
            <i className="fa-solid fa-circle-info text-blue-500"></i>
            <p className="text-xs text-blue-700 font-medium">Los datos deben coincidir exactamente con los registrados en su banco.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Banco</label>
              <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-bold text-gray-900">
                <option>Mercantil</option>
                <option>Banesco</option>
                <option>Provincial</option>
                <option>Banco de Venezuela</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Cédula de Identidad</label>
              <div className="flex gap-2">
                <select className="w-20 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none font-bold text-gray-900">
                  <option>V</option>
                  <option>E</option>
                  <option>J</option>
                </select>
                <input type="number" placeholder="20123456" className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-bold placeholder:text-gray-300" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Teléfono asociado</label>
              <input type="tel" placeholder="0414 123 4567" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-bold placeholder:text-gray-300" />
            </div>
          </div>
          <button onClick={handleSave} disabled={isLoading} className="w-full py-5 moto-gradient text-white font-bold rounded-3xl shadow-xl shadow-blue-100 flex items-center justify-center gap-3 mt-8 active:scale-[0.98] transition-all">
            {isLoading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Vincular Pago Móvil'}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'ADD_CARD') {
    return (
      <div className="flex flex-col h-screen p-6 bg-white animate-fadeIn">
        <Header title="Nueva Tarjeta" />
        <div className="space-y-6">
          <div className="aspect-[1.58/1] w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <i className="fa-solid fa-wifi text-4xl rotate-90"></i>
            </div>
            <div className="flex justify-between items-start">
              <div className="w-12 h-10 bg-yellow-400/20 rounded-lg border border-yellow-400/30 flex items-center justify-center">
                <div className="w-8 h-6 bg-yellow-500/50 rounded-sm"></div>
              </div>
              <i className="fa-brands fa-cc-visa text-4xl"></i>
            </div>
            <div className="space-y-4">
              <p className="text-xl tracking-[0.2em] font-medium">•••• •••• •••• ••••</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-white/50 uppercase">Nombre</p>
                  <p className="text-sm font-bold tracking-wider">TU NOMBRE AQUÍ</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/50 uppercase">Vence</p>
                  <p className="text-sm font-bold">MM/AA</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Número de Tarjeta</label>
              <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-bold placeholder:text-gray-300" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Expira</label>
                <input type="text" placeholder="MM/AA" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-bold placeholder:text-gray-300" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">CVV</label>
                <input type="text" placeholder="123" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-bold placeholder:text-gray-300" />
              </div>
            </div>
          </div>
          <button onClick={handleSave} disabled={isLoading} className="w-full py-5 moto-gradient text-white font-bold rounded-3xl shadow-xl shadow-blue-100 flex items-center justify-center gap-3 mt-4 active:scale-[0.98] transition-all">
            {isLoading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Guardar Tarjeta'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-6 bg-white animate-fadeIn">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="text-gray-800 text-xl w-10 h-10 flex items-center">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg pr-10 text-gray-900">Métodos de Pago</h1>
      </div>

      <div className="space-y-8 overflow-y-auto no-scrollbar pb-20">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6 px-1">Nueva opción</h2>
          <div className="grid grid-cols-1 gap-4">
            <button onClick={() => setView('ADD_MOBILE')} className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[32px] p-6 text-white shadow-xl shadow-yellow-100 text-left active:scale-[0.98] transition-all group">
              <div className="relative z-10">
                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Más usado</span>
                <h3 className="text-2xl font-bold mt-2">Pago Móvil</h3>
                <p className="text-white/80 text-sm">Transferencia inmediata</p>
              </div>
              <i className="fa-solid fa-bolt absolute right-[-10px] bottom-[-10px] text-[100px] opacity-10 transform -rotate-12 group-hover:scale-110 transition-transform"></i>
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setView('ADD_ZELLE')} className="bg-purple-700 rounded-[32px] p-6 text-white shadow-lg shadow-purple-100 flex flex-col justify-between h-40 text-left active:scale-[0.98] transition-all relative overflow-hidden group">
                <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-z"></i>
                </div>
                <div>
                  <h3 className="font-bold">Zelle</h3>
                  <p className="text-white/50 text-[10px] uppercase font-bold tracking-tighter italic">Transferencias</p>
                </div>
              </button>
              <button onClick={() => setView('ADD_PAYPAL')} className="bg-[#0070ba] rounded-[32px] p-6 text-white shadow-lg shadow-blue-100 flex flex-col justify-between h-40 text-left active:scale-[0.98] transition-all relative overflow-hidden">
                <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center">
                  <i className="fa-brands fa-paypal"></i>
                </div>
                <div>
                  <h3 className="font-bold">PayPal</h3>
                  <p className="text-white/50 text-[10px] uppercase font-bold tracking-tighter">Billetera Digital</p>
                </div>
              </button>
            </div>
            <button onClick={() => setView('ADD_CARD')} className="w-full bg-slate-900 rounded-[32px] p-6 text-white shadow-lg shadow-gray-200 flex items-center gap-4 text-left active:scale-[0.98] transition-all">
                <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <i className="fa-solid fa-credit-card text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold">Tarjeta Internacional</h3>
                  <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest">Visa / Mastercard</p>
                </div>
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6 px-1">
            <h2 className="text-2xl font-black text-gray-900">Guardados</h2>
            <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">Gestionar</span>
          </div>
          <div className="space-y-4">
            <div className="p-5 border-2 border-blue-500 bg-blue-50 rounded-[32px] flex items-center gap-4 relative overflow-hidden group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                <i className="fa-solid fa-mobile-screen-button text-2xl text-blue-600"></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900">Mercantil</h4>
                  <span className="bg-blue-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Principal</span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">0414 ••• 9382</p>
              </div>
              <i className="fa-solid fa-circle-check text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>

        <button onClick={onGoToHistory} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[32px] flex items-center justify-between hover:bg-slate-100 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
              <i className="fa-solid fa-receipt text-xl"></i>
            </div>
            <div>
              <span className="block font-bold text-gray-800">Facturación</span>
              <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Ver historial</span>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-gray-300"></i>
        </button>
      </div>

      <div className="mt-auto py-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <i className="fa-solid fa-shield-halved"></i>
          <span className="font-medium">Pagos protegidos con encriptación SSL</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
