import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';

interface TripActiveScreenProps {
  onCancel: () => void;
  onGoToPay?: () => void;
  role?: UserRole;
}

// Añadimos 'TRACKING' para el trayecto del conductor hacia el usuario
type TripStep = 'TRACKING' | 'ARRIVED_NOTICE' | 'PAYMENT_SELECTION' | 'CONFIRMING_PAYMENT' | 'IN_TRIP' | 'COMPLETED';

const TripActiveScreen: React.FC<TripActiveScreenProps> = ({ onCancel, onGoToPay, role = 'USER' }) => {
  const [tripStep, setTripStep] = useState<TripStep>('TRACKING');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOBILE_PAY' | null>(null);
  const [copied, setCopied] = useState(false);
  const [eta, setEta] = useState({ min: 3, km: 1.2 }); // ETA inicial hacia el usuario
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coordenadas para simulación
  const [motorCoords, setMotorCoords] = useState({ x: 10, y: 10 });
  const userLocation = { x: 50, y: 70 };
  const destinationLocation = { x: 25, y: 25 };

  const driver = {
    name: "Juan Pérez",
    vehicle: "Honda CB125 • ABC-123",
    payment: {
      bank: "0102 - Banco de Venezuela",
      phone: "0414-1234567",
      id: "V-12.345.678"
    }
  };

  // Simulación de movimiento y actualización de ETA
  useEffect(() => {
    let target = userLocation;
    
    if (tripStep === 'TRACKING' || tripStep === 'ARRIVED_NOTICE' || tripStep === 'PAYMENT_SELECTION') {
      target = userLocation;
    } else {
      target = destinationLocation;
    }

    const moveInterval = setInterval(() => {
      setMotorCoords(prev => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Si llegó al objetivo
        if (dist < 1) {
          if (tripStep === 'TRACKING') {
            setTripStep('ARRIVED_NOTICE');
          }
          return target;
        }

        // Actualizar ETA y KM basados en la distancia restante al target
        if (tripStep === 'TRACKING' || tripStep === 'IN_TRIP') {
            setEta(prevEta => ({
                min: Math.max(0, Math.ceil(dist / 5)), // Simulación simple
                km: Math.max(0, Number((dist / 10).toFixed(1)))
            }));
        }

        const step = 1.2; // Velocidad de simulación
        return {
          x: prev.x + (dx / dist) * step,
          y: prev.y + (dy / dist) * step
        };
      });
    }, 800);

    return () => clearInterval(moveInterval);
  }, [tripStep]);

  // Manejo de validación de pago
  useEffect(() => {
    if (tripStep === 'CONFIRMING_PAYMENT') {
      const timer = setTimeout(() => {
        setTripStep('IN_TRIP');
        setEta({ min: 12, km: 4.5 }); 
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [tripStep]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalize = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onCancel(); 
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col relative bg-slate-50 overflow-hidden">
      {/* MAPA INTERACTIVO (SIMULADO) */}
      <div className="absolute inset-0 z-0 bg-slate-200">
        <img 
          src="https://picsum.photos/seed/motoya_full_map/1200/1800" 
          className="w-full h-full object-cover opacity-60 grayscale-[0.2]" 
          alt="Mapa"
        />
        
        {/* Usuario */}
        <div className="absolute z-10 -ml-4 -mt-4" style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}>
           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-4 border-blue-600 shadow-xl">
              <div className="w-2 bg-blue-600 h-2 rounded-full animate-pulse"></div>
           </div>
        </div>

        {/* Destino */}
        {(tripStep === 'IN_TRIP' || tripStep === 'COMPLETED') && (
          <div className="absolute z-10 -ml-4 -mt-10 animate-bounce" style={{ left: `${destinationLocation.x}%`, top: `${destinationLocation.y}%` }}>
             <i className="fa-solid fa-location-dot text-red-600 text-3xl drop-shadow-lg"></i>
          </div>
        )}

        {/* Motorizado */}
        <div className="absolute z-20 -ml-6 -mt-6 transition-all duration-700 ease-linear" style={{ left: `${motorCoords.x}%`, top: `${motorCoords.y}%` }}>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-slate-900 shadow-2xl overflow-hidden">
             <i className="fa-solid fa-motorcycle text-slate-900 text-xl"></i>
          </div>
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-full whitespace-nowrap uppercase tracking-widest shadow-lg">
            {driver.name}
          </div>
        </div>

        {/* Ruta */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20">
          <line 
            x1={`${userLocation.x}%`} y1={`${userLocation.y}%`} 
            x2={`${destinationLocation.x}%`} y2={`${destinationLocation.y}%`} 
            stroke="#2563eb" strokeWidth="4" strokeDasharray="8,8"
          />
        </svg>
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar pointer-events-none">
        <div className="pointer-events-auto mt-auto">
          
          {/* ESTADO 0: TRACKING (Hacia el usuario) */}
          {tripStep === 'TRACKING' && (
            <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 animate-slideUp">
               <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-black leading-none">Tu piloto viene</h3>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Síguelo en tiempo real</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-black leading-none">{eta.min} <span className="text-xs text-slate-400">min</span></p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">{eta.km} km</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <img src="https://picsum.photos/id/64/100/100" className="w-12 h-12 rounded-xl object-cover" alt="Driver" />
                  <div className="flex-1">
                    <p className="font-black text-black leading-none">{driver.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">{driver.vehicle}</p>
                  </div>
                  <button className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                    <i className="fa-solid fa-phone"></i>
                  </button>
               </div>
            </div>
          )}

          {/* ESTADO 1: LLEGADA */}
          {tripStep === 'ARRIVED_NOTICE' && (
            <div className="bg-white rounded-[40px] p-8 shadow-2xl border-t-8 border-blue-600 animate-slideUp">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <i className="fa-solid fa-motorcycle text-blue-600 text-4xl"></i>
              </div>
              <h2 className="text-3xl font-black text-center text-black mb-2 leading-tight">¡Tu MotoYa ha llegado!</h2>
              <p className="text-center text-slate-500 font-medium mb-8">
                {driver.name} te espera afuera. Identifícalo por su {driver.vehicle}.
              </p>
              <button 
                onClick={() => setTripStep('PAYMENT_SELECTION')}
                className="w-full py-5 moto-gradient text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all text-xl"
              >
                Confirmar encuentro
              </button>
            </div>
          )}

          {/* ESTADO 2: PAGO */}
          {tripStep === 'PAYMENT_SELECTION' && (
            <div className="bg-white rounded-[40px] p-8 shadow-2xl animate-slideUp">
              <h2 className="text-2xl font-black text-black mb-1">¿Cómo quieres pagar?</h2>
              <p className="text-slate-500 font-medium mb-6">Selecciona el método para este viaje</p>
              
              <div className="space-y-4 mb-8">
                <button 
                  onClick={() => setPaymentMethod('MOBILE_PAY')}
                  className={`w-full p-5 rounded-[28px] border-2 transition-all flex items-center gap-4 ${paymentMethod === 'MOBILE_PAY' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-slate-50'}`}
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-mobile-screen"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-black">Pago Móvil</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Inmediato</p>
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('CASH')}
                  className={`w-full p-5 rounded-[28px] border-2 transition-all flex items-center gap-4 ${paymentMethod === 'CASH' ? 'border-green-600 bg-green-50' : 'border-slate-100 bg-slate-50'}`}
                >
                  <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-money-bill-1-wave"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-black">Efectivo</p>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Pago manual</p>
                  </div>
                </button>
              </div>

              {paymentMethod === 'MOBILE_PAY' && (
                <div className="bg-slate-900 rounded-3xl p-6 mb-6 animate-fadeIn text-white pointer-events-auto">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Datos Pago Móvil</p>
                  <p className="font-bold text-sm mb-1">{driver.payment.bank}</p>
                  <p className="font-bold text-blue-400 text-xs mb-3">{driver.payment.id}</p>
                  <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/10">
                    <p className="font-black text-lg">{driver.payment.phone}</p>
                    <button onClick={() => handleCopy(driver.payment.phone)} className={`p-2 rounded-lg ${copied ? 'bg-green-500' : 'bg-blue-600'}`}>
                      <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'CASH' && (
                <div className="bg-green-50 border border-green-100 rounded-3xl p-6 mb-6 text-center animate-fadeIn">
                  <p className="text-green-800 font-bold">Por favor entrega el efectivo al piloto al subir.</p>
                </div>
              )}

              <button 
                disabled={!paymentMethod}
                onClick={() => setTripStep('CONFIRMING_PAYMENT')}
                className={`w-full py-5 font-black rounded-3xl shadow-xl transition-all text-xl ${paymentMethod ? 'moto-gradient text-white active:scale-95' : 'bg-slate-100 text-slate-300'}`}
              >
                Confirmar Pago Realizado
              </button>
            </div>
          )}

          {/* ESTADO 3: VALIDACIÓN */}
          {tripStep === 'CONFIRMING_PAYMENT' && (
            <div className="mb-10 mx-auto bg-white rounded-[45px] p-10 shadow-2xl flex flex-col items-center animate-fadeIn max-w-sm border border-slate-100">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-[6px] border-blue-50 rounded-full"></div>
                <div className="absolute inset-0 border-[6px] border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <i className="fa-solid fa-shield-check text-blue-600 text-4xl absolute inset-0 flex items-center justify-center"></i>
              </div>
              <h2 className="text-2xl font-black text-black text-center mb-2">Validando...</h2>
              <p className="text-slate-500 text-center font-medium">El motorista está verificando el pago.</p>
            </div>
          )}

          {/* ESTADO 4: EN RUTA */}
          {tripStep === 'IN_TRIP' && (
            <div className="space-y-4 animate-slideUp">
              <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                     <i className="fa-solid fa-route text-2xl"></i>
                  </div>
                  <div>
                     <p className="text-2xl font-black text-black leading-none">{eta.min} <span className="text-sm text-slate-400">min</span></p>
                     <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Hacia tu destino</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-black leading-none">{eta.km} <span className="text-xs text-slate-400">km</span></p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Distancia</p>
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <img src="https://picsum.photos/id/64/150/150" className="w-14 h-14 rounded-2xl object-cover" alt="Juan" />
                  <div className="flex-1">
                     <h4 className="font-black text-black text-lg leading-none">{driver.name}</h4>
                     <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-tighter">{driver.vehicle}</p>
                  </div>
                </div>
                <button onClick={() => setTripStep('COMPLETED')} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-black transition-all">
                  Simular Llegada a Destino
                </button>
              </div>
            </div>
          )}

          {/* ESTADO 5: CALIFICACIÓN */}
          {tripStep === 'COMPLETED' && (
            <div className="bg-white rounded-[45px] p-8 shadow-2xl animate-slideUp">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-location-check text-green-600 text-2xl"></i>
                </div>
                <h2 className="text-2xl font-black text-black leading-tight">¡Llegaste a destino!</h2>
                <p className="text-slate-500 font-medium">Califica tu viaje con {driver.name}</p>
              </div>
              
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="transition-all hover:scale-110 p-1">
                    <i className={`fa-solid fa-star text-4xl ${star <= rating ? 'text-yellow-400 drop-shadow-md' : 'text-slate-100'}`}></i>
                  </button>
                ))}
              </div>

              <div className="space-y-2 mb-8">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="¿Alguna sugerencia o comentario? (opcional)"
                  className="w-full h-28 p-5 bg-slate-50 border border-slate-100 rounded-[28px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-black font-medium text-sm resize-none transition-all"
                ></textarea>
              </div>

              <button 
                onClick={handleFinalize}
                disabled={rating === 0 || isSubmitting}
                className={`w-full py-5 font-black rounded-3xl shadow-xl transition-all text-xl flex items-center justify-center gap-3 ${rating > 0 ? 'moto-gradient text-white active:scale-95' : 'bg-slate-100 text-slate-300'}`}
              >
                {isSubmitting ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Finalizar Viaje'}
              </button>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0, 0, 0.2, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default TripActiveScreen;