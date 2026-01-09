
import React, { useEffect, useState, useMemo } from 'react';

interface TripActiveScreenProps {
  onCancel: () => void;
}

type TripStage = 'PICKUP' | 'EN_ROUTE' | 'ARRIVED' | 'RATING';

const TripActiveScreen: React.FC<TripActiveScreenProps> = ({ onCancel }) => {
  const [stage, setStage] = useState<TripStage>('PICKUP');
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(30); 
  const [rating, setRating] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Coordenadas fijas para la simulación (en %)
  const originPos = { x: 75, y: 80 };
  const destPos = { x: 25, y: 25 };
  const userPos = { x: 50, y: 70 };

  // Distancia total simulada en KM
  const totalKm = stage === 'PICKUP' ? 1.2 : 3.5;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (stage === 'RATING' || stage === 'ARRIVED') return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (stage === 'PICKUP') {
            setStage('EN_ROUTE');
            setProgress(0);
            return 120; // 2 minutos para el viaje al destino
          }
          if (stage === 'EN_ROUTE') {
            setStage('ARRIVED');
            return 0;
          }
        }
        return prev - 1;
      });

      setProgress(prev => Math.min(prev + 0.8, 100));
    }, 500);

    return () => clearInterval(interval);
  }, [stage]);

  // Cálculo de posición del motorizado
  const motorPos = useMemo(() => {
    const start = stage === 'PICKUP' ? originPos : userPos;
    const end = stage === 'PICKUP' ? userPos : destPos;
    
    return {
      x: start.x + (end.x - start.x) * (progress / 100),
      y: start.y + (end.y - start.y) * (progress / 100)
    };
  }, [progress, stage]);

  // Cálculo de Hora de Llegada Estimada (ETA)
  const etaTime = useMemo(() => {
    const eta = new Date(currentTime.getTime() + countdown * 1000);
    return eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [countdown, currentTime]);

  // Kilómetros restantes dinámicos
  const kmRemaining = useMemo(() => {
    return (totalKm * (1 - progress / 100)).toFixed(1);
  }, [progress, totalKm]);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-slate-900">
      {/* Mapa Layer */}
      <div className="absolute inset-0 z-0 bg-slate-200">
        <img src="https://picsum.photos/seed/mejia_ride/1200/1800" className="w-full h-full object-cover opacity-60 grayscale-[0.3]" alt="Map" />
        
        {/* Tarjeta de Telemetría Flotante */}
        {!['ARRIVED', 'RATING'].includes(stage) && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 w-[90%] bg-white/90 backdrop-blur-md rounded-[28px] p-5 shadow-2xl border border-white/50 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <i className="fa-solid fa-clock-rotate-left text-lg"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Llegada</p>
                  <p className="text-xl font-black text-slate-900 leading-none">{etaTime}</p>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Distancia</p>
                <p className="text-xl font-black text-blue-600 leading-none">{kmRemaining} <span className="text-xs font-bold text-slate-400">km</span></p>
              </div>
            </div>
            {/* Barra de progreso sutil en la tarjeta */}
            <div className="mt-4 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {/* Marcadores */}
        <div className="absolute -ml-4 -mt-4 z-10" style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}>
           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-4 border-blue-600 shadow-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
           </div>
        </div>

        <div className="absolute -ml-5 -mt-10 z-10" style={{ left: `${destPos.x}%`, top: `${destPos.y}%` }}>
           <div className="relative">
             <div className="absolute -inset-4 bg-red-500/20 rounded-full animate-ping"></div>
             <i className="fa-solid fa-location-dot text-red-600 text-4xl drop-shadow-2xl"></i>
           </div>
        </div>

        {/* Trayectoria Dinámica SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
           {/* Ruta completa (punteada) */}
           <path 
             d={`M ${stage === 'PICKUP' ? originPos.x : userPos.x}% ${stage === 'PICKUP' ? originPos.y : userPos.y}% L ${stage === 'PICKUP' ? userPos.x : destPos.x}% ${stage === 'PICKUP' ? userPos.y : destPos.y}%`} 
             stroke="#cbd5e1" strokeWidth="6" strokeDasharray="1, 12" strokeLinecap="round" fill="transparent" 
           />
           {/* Ruta recorrida (sólida) */}
           <path 
             d={`M ${stage === 'PICKUP' ? originPos.x : userPos.x}% ${stage === 'PICKUP' ? originPos.y : userPos.y}% L ${motorPos.x}% ${motorPos.y}%`} 
             stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" fill="transparent" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
           />
        </svg>

        {/* El Motorizado Animado */}
        <div 
          className="absolute -ml-8 -mt-8 z-20 flex flex-col items-center transition-all duration-500 ease-linear"
          style={{ left: `${motorPos.x}%`, top: `${motorPos.y}%` }}
        >
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border-4 border-blue-600 shadow-2xl relative">
             <i className="fa-solid fa-motorcycle text-blue-600 text-2xl animate-bounce-slow"></i>
             <div className="absolute -top-10 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap border border-slate-700">
                {stage === 'PICKUP' ? 'RECOGIÉNDOTE' : 'EN RUTA'}
             </div>
          </div>
        </div>
      </div>

      {/* Notificación de Llegada */}
      {countdown === 0 && stage === 'PICKUP' && (
        <div className="absolute top-40 left-4 right-4 z-50 bg-blue-600 text-white shadow-2xl rounded-3xl p-5 border border-blue-400 flex items-center gap-4 animate-bounceIn">
           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <i className="fa-solid fa-bell text-xl"></i>
           </div>
           <div className="flex-1">
              <p className="text-sm font-black">¡Juan ha llegado!</p>
              <p className="text-[11px] opacity-80">Tu MotoYa está esperando en el punto exacto.</p>
           </div>
        </div>
      )}

      {/* Panel Inferior */}
      <div className="mt-auto relative z-30 bg-white rounded-t-[45px] shadow-[0_-20px_60px_rgba(0,0,0,0.3)] p-8 animate-slideUp">
        <div className="w-14 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
        
        {stage === 'ARRIVED' ? (
          <div className="py-4 text-center animate-fadeIn">
             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-check text-green-600 text-4xl"></i>
             </div>
             <h3 className="text-3xl font-black text-slate-900">¡Has llegado!</h3>
             <p className="text-slate-400 font-bold mt-2">Costo final: <span className="text-blue-600">S/ 4.50</span></p>
             <div className="grid grid-cols-2 gap-4 mt-8">
                <button className="py-4 bg-slate-50 text-slate-400 font-black rounded-2xl flex items-center justify-center gap-2">
                   <i className="fa-solid fa-receipt"></i> Recibo
                </button>
                <button onClick={() => setStage('RATING')} className="py-4 moto-gradient text-white font-black rounded-2xl shadow-xl shadow-blue-100">Pagar y Calificar</button>
             </div>
          </div>
        ) : stage === 'RATING' ? (
          <div className="py-4 animate-fadeIn">
             <h3 className="text-2xl font-black text-center text-slate-900 mb-6">¿Cómo estuvo tu viaje?</h3>
             <div className="flex justify-center gap-2 mb-10">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setRating(s)} className="text-4xl transition-transform active:scale-90">
                    <i className={`fa-solid fa-star ${s <= rating ? 'text-yellow-400' : 'text-slate-100'}`}></i>
                  </button>
                ))}
             </div>
             <textarea 
               placeholder="Escribe una reseña sobre Juan..."
               className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none text-sm font-medium mb-8 min-h-[100px] focus:ring-2 focus:ring-blue-500 transition-all"
             />
             <button onClick={onCancel} className="w-full py-5 moto-gradient text-white font-black rounded-[25px] shadow-2xl">Finalizar Experiencia</button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-8">
               <div className="relative">
                  <img src="https://picsum.photos/id/64/150/150" className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white" alt="Driver" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
               </div>
               <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-lg leading-none">Juan Pérez</h4>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                    <i className="fa-solid fa-motorcycle text-blue-600"></i>
                    HONDA CB125 • <span className="text-slate-900">ABC-123</span>
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{countdown >= 60 ? Math.floor(countdown/60) + 'm' : countdown + 's'}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Para llegar</p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
               <button className="flex flex-col items-center gap-1 py-4 bg-slate-50 rounded-2xl text-slate-500 hover:bg-slate-100 transition-colors">
                  <i className="fa-solid fa-phone text-blue-600 text-lg"></i>
                  <span className="text-[9px] font-black uppercase">Llamar</span>
               </button>
               <button className="flex flex-col items-center gap-1 py-4 bg-slate-50 rounded-2xl text-slate-500 hover:bg-slate-100 transition-colors">
                  <i className="fa-solid fa-message text-blue-600 text-lg"></i>
                  <span className="text-[9px] font-black uppercase">Mensaje</span>
               </button>
               <button onClick={onCancel} className="flex flex-col items-center gap-1 py-4 bg-red-50 rounded-2xl text-red-500 hover:bg-red-100 transition-colors">
                  <i className="fa-solid fa-circle-xmark text-lg"></i>
                  <span className="text-[9px] font-black uppercase">Cancelar</span>
               </button>
            </div>
            
            <p className="text-[10px] text-center text-slate-300 font-black uppercase tracking-[0.2em]">Viaje seguro con MotoYa</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes bounceIn { 
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-bounceIn { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-bounce-slow { animation: bounceSlow 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default TripActiveScreen;
