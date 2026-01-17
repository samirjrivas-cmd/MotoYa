
import React, { useState, useEffect } from 'react';

interface DriverDashboardProps {
  onLogout: () => void;
  onAcceptRide?: () => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ onLogout, onAcceptRide }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRide, setIncomingRide] = useState<any>(null);
  const [earnings, setEarnings] = useState(125.50);

  // Simulación de recibir una solicitud cuando se pone Online
  useEffect(() => {
    let timeout: any;
    if (isOnline) {
      timeout = setTimeout(() => {
        setIncomingRide({
          id: 'R-992',
          user: 'Maria Garcia',
          distance: '0.8 km',
          price: 5.20,
          origin: 'Plaza Bolívar',
          destination: 'Hospital Central',
          userPos: { x: 50, y: 70 }
        });
      }, 5000);
    } else {
      setIncomingRide(null);
    }
    return () => clearTimeout(timeout);
  }, [isOnline]);

  const handleAccept = () => {
    if (!incomingRide) return;
    
    // Simulación de Evento: ride.accepted
    console.log("Emitiendo: ride.accepted", { rideId: incomingRide.id });
    
    // Aquí se "obtendría" la ubicación real y se "notificaría" al usuario
    // simulando el flujo pedido
    if (onAcceptRide) onAcceptRide();
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 animate-fadeIn">
      {/* Header */}
      <div className="p-6 bg-white shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/id/64/100/100" className="w-10 h-10 rounded-full border-2 border-blue-500" alt="Driver" />
          <div>
            <h1 className="font-black text-slate-900 leading-none">Juan Pérez</h1>
            <div className="flex items-center gap-1 mt-1">
              <i className="fa-solid fa-star text-yellow-400 text-[10px]"></i>
              <span className="text-[10px] font-bold text-slate-500">4.9 • MotoYa Gold</span>
            </div>
          </div>
        </div>
        <button onClick={onLogout} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Earnings Card */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Ganancias de Hoy</p>
            <h2 className="text-4xl font-black mb-6">S/ {earnings.toFixed(2)}</h2>
            <div className="flex gap-4">
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Viajes</p>
                <p className="text-lg font-black">12</p>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Horas</p>
                <p className="text-lg font-black">4.5</p>
              </div>
            </div>
          </div>
          <i className="fa-solid fa-chart-line absolute -right-4 -bottom-4 text-9xl opacity-10"></i>
        </div>

        {/* Status Toggle */}
        <div className={`p-6 rounded-[32px] flex items-center justify-between transition-all shadow-lg ${isOnline ? 'bg-green-500 text-white' : 'bg-white text-slate-900'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isOnline ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
              <i className={`fa-solid ${isOnline ? 'fa-signal' : 'fa-moon'} text-xl`}></i>
            </div>
            <div>
              <p className="font-black text-lg leading-none">{isOnline ? 'En Línea' : 'Desconectado'}</p>
              <p className={`text-[10px] font-bold uppercase mt-1 ${isOnline ? 'text-white/70' : 'text-slate-400'}`}>
                {isOnline ? 'Recibiendo solicitudes' : 'No visible para usuarios'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-14 h-8 rounded-full relative transition-colors ${isOnline ? 'bg-white' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-6 h-6 rounded-full transition-all ${isOnline ? 'right-1 bg-green-500' : 'left-1 bg-slate-400'}`}></div>
          </button>
        </div>

        {/* Requirements / Stats */}
        {!isOnline && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Tu Documentación</h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center text-center gap-2">
                  <i className="fa-solid fa-id-card text-blue-500 text-xl"></i>
                  <span className="text-[10px] font-black uppercase">Licencia</span>
                  <span className="text-[8px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">Verificada</span>
               </div>
               <div className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center text-center gap-2">
                  <i className="fa-solid fa-motorcycle text-blue-500 text-xl"></i>
                  <span className="text-[10px] font-black uppercase">Vehículo</span>
                  <span className="text-[8px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">Verificado</span>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Incoming Ride Modal */}
      {incomingRide && (
        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-end p-6">
           <div className="w-full bg-white rounded-[45px] p-8 shadow-2xl animate-slideUp">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Nueva Solicitud</span>
                    <h3 className="text-3xl font-black text-slate-900 mt-2">{incomingRide.user}</h3>
                 </div>
                 <div className="text-right">
                    <p className="text-2xl font-black text-blue-600">S/ {incomingRide.price.toFixed(2)}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{incomingRide.distance} de distancia</p>
                 </div>
              </div>
              
              <div className="space-y-4 mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm font-bold text-slate-600">{incomingRide.origin}</p>
                 </div>
                 <div className="w-[2px] h-4 bg-slate-100 ml-[3px]"></div>
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-sm font-black text-slate-900">{incomingRide.destination}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                  onClick={() => setIncomingRide(null)}
                  className="py-5 bg-slate-100 text-slate-400 font-black rounded-3xl active:scale-95 transition-all"
                 >
                   Rechazar
                 </button>
                 <button 
                  onClick={handleAccept}
                  className="py-5 moto-gradient text-white font-black rounded-3xl shadow-xl shadow-blue-200 active:scale-95 transition-all"
                 >
                   Aceptar Viaje
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
