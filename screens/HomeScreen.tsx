
import React, { useState, useEffect, useMemo } from 'react';

interface HomeScreenProps {
  onGoToPayments: () => void;
  onGoToHistory: () => void;
  onRequestTrip: () => void;
}

interface LocationData {
  address: string;
  vicinity: string;
  type: 'historic' | 'business' | 'transport' | 'nature' | 'health';
  x: number;
  y: number;
}

interface OnlineDriver {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

const MEJIA_MAPS_DATA: LocationData[] = [
  { address: "Plaza Bolívar de San Antonio", vicinity: "Calle Bolívar, Centro", type: 'historic', x: 48, y: 35 },
  { address: "Muelle Turístico de San Antonio", vicinity: "Av. Costanera, San Antonio del Golfo", type: 'transport', x: 42, y: 28 },
  { address: "Balneario Cachamaure", vicinity: "Troncal 9, Sector Cachamaure", type: 'nature', x: 75, y: 55 },
  { address: "Hospital General", vicinity: "Sector Las Marías", type: 'health', x: 38, y: 45 },
  { address: "Alcaldía de Mejía", vicinity: "Calle Principal", type: 'business', x: 47, y: 38 }
];

const HomeScreen: React.FC<HomeScreenProps> = ({ onGoToPayments, onGoToHistory, onRequestTrip }) => {
  const [destination, setDestination] = useState<LocationData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifyingDriver, setIsVerifyingDriver] = useState(false);
  
  // Simulación de conductores online moviéndose
  const [drivers, setDrivers] = useState<OnlineDriver[]>([
    { id: 1, x: 30, y: 40, rotation: 45 },
    { id: 2, x: 60, y: 25, rotation: 120 },
    { id: 3, x: 20, y: 75, rotation: 10 },
    { id: 4, x: 80, y: 60, rotation: 240 },
    { id: 5, x: 45, y: 50, rotation: 180 }
  ]);

  const userLocation = { x: 50, y: 70 };

  // Efecto para simular movimiento de conductores
  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(prev => prev.map(d => ({
        ...d,
        x: d.x + (Math.random() - 0.5) * 0.5,
        y: d.y + (Math.random() - 0.5) * 0.5,
        rotation: d.rotation + (Math.random() - 0.5) * 10
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStartRequest = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setIsVerifyingDriver(true);
    }, 3500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'historic': return 'fa-monument text-amber-500';
      case 'business': return 'fa-store text-blue-500';
      case 'transport': return 'fa-anchor text-cyan-500';
      case 'health': return 'fa-hospital text-red-500';
      case 'nature': return 'fa-tree text-green-500';
      default: return 'fa-location-dot text-gray-400';
    }
  };

  return (
    <div className="h-screen flex flex-col relative bg-slate-900 overflow-hidden">
      {/* MAPA FULLSCREEN */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/mejia_city_map/1200/1800" 
          className="w-full h-full object-cover opacity-80" 
          alt="Map" 
        />
        
        {/* CONDUCTORES ONLINE (MOTOS) */}
        {!isRequesting && !isVerifyingDriver && drivers.map(driver => (
          <div 
            key={driver.id}
            className="absolute transition-all duration-[2000ms] ease-linear z-10"
            style={{ left: `${driver.x}%`, top: `${driver.y}%`, transform: `rotate(${driver.rotation}deg)` }}
          >
            <div className="relative group">
               <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-sm"></div>
               <div className="bg-white p-1.5 rounded-lg shadow-lg border border-blue-100 flex items-center justify-center">
                  <i className="fa-solid fa-motorcycle text-blue-600 text-[10px]"></i>
               </div>
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[7px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-black uppercase">
                  Online
               </div>
            </div>
          </div>
        ))}

        {/* User Marker */}
        <div className="absolute w-12 h-12 -ml-6 -mt-6 flex items-center justify-center z-20" style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}>
          <div className="absolute w-16 h-16 bg-blue-500/30 rounded-full animate-ping"></div>
          <div className="w-8 h-8 bg-white rounded-full border-[6px] border-blue-600 shadow-2xl flex items-center justify-center">
             <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>

        {/* Destination Marker */}
        {destination && (
          <div className="absolute -ml-5 -mt-12 flex flex-col items-center z-20 animate-bounce" style={{ left: `${destination.x}%`, top: `${destination.y}%` }}>
            <div className="bg-white px-3 py-1 rounded-full shadow-2xl mb-1 border border-red-50">
               <p className="text-[10px] font-black text-slate-900 whitespace-nowrap">{destination.address}</p>
            </div>
            <i className="fa-solid fa-location-dot text-red-600 text-4xl drop-shadow-2xl"></i>
          </div>
        )}
      </div>

      {/* INTERFAZ FLOTANTE - TOP */}
      {!isRequesting && !isVerifyingDriver && (
        <div className="relative z-30 p-6 pt-14 pointer-events-none">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3 pointer-events-auto">
                <button onClick={onGoToHistory} className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/50">
                  <i className="fa-solid fa-bars text-slate-800 text-lg"></i>
                </button>
                <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl h-14 shadow-2xl flex items-center px-5 gap-3 border border-white/50">
                   <i className="fa-solid fa-magnifying-glass text-blue-600"></i>
                   <input 
                     type="text" 
                     placeholder="¿A dónde vas en San Antonio?" 
                     className="bg-transparent flex-1 outline-none text-sm font-bold text-black"
                     value={searchQuery}
                     onFocus={() => setIsSearching(true)}
                     onChange={(e) => {
                       setSearchQuery(e.target.value);
                       setIsSearching(true);
                     }}
                   />
                </div>
             </div>
             
             {isSearching && searchQuery && (
               <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-2 animate-fadeIn max-h-72 overflow-y-auto pointer-events-auto border border-white/50">
                  <div className="px-4 py-2 border-b border-slate-50">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destinos Sugeridos</p>
                  </div>
                  {MEJIA_MAPS_DATA.map((loc, i) => (
                    <button key={i} onClick={() => { setDestination(loc); setSearchQuery(loc.address); setIsSearching(false); }} className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 transition-colors rounded-2xl text-left">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                          <i className={`fa-solid ${getIcon(loc.type)} text-lg`}></i>
                       </div>
                       <div>
                         <p className="text-sm font-black text-slate-900 leading-none mb-1">{loc.address}</p>
                         <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{loc.vicinity}</p>
                       </div>
                    </button>
                  ))}
               </div>
             )}
          </div>
        </div>
      )}

      {/* PANEL INFERIOR FLOTANTE */}
      <div className="mt-auto relative z-40 p-6 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-8 pointer-events-auto border border-white/50 animate-slideUp">
          <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mb-8"></div>
          
          {isRequesting ? (
            <div className="py-6 flex flex-col items-center animate-fadeIn text-center">
               <div className="relative w-28 h-28 mb-8">
                  <div className="absolute inset-0 border-[6px] border-blue-50 rounded-full"></div>
                  <div className="absolute inset-0 border-[6px] border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <i className="fa-solid fa-motorcycle text-blue-600 text-4xl"></i>
                  </div>
               </div>
               <h3 className="text-2xl font-black text-slate-900">Buscando Pilotos</h3>
               <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-tighter">Buscando la mejor ruta para ti...</p>
            </div>
          ) : isVerifyingDriver ? (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-8">
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 leading-none mb-2">¡Piloto Listo!</h3>
                   <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">A solo 2 minutos de distancia</span>
                 </div>
                 <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                   <i className="fa-solid fa-check-double text-2xl"></i>
                 </div>
              </div>
              <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-[32px] border border-slate-100 mb-8 shadow-inner">
                 <img src="https://picsum.photos/id/64/150/150" className="w-20 h-20 rounded-2xl object-cover shadow-2xl border-4 border-white" alt="Driver" />
                 <div className="flex-1">
                    <h4 className="font-black text-slate-900 text-xl leading-none mb-1">Juan Pérez</h4>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Honda CB125 • <span className="text-blue-600 font-black">ABC-123</span></p>
                    <div className="flex items-center gap-1 mt-3">
                      <i className="fa-solid fa-star text-yellow-400 text-sm"></i>
                      <span className="text-sm font-black text-slate-900">4.9</span>
                      <span className="text-slate-300 text-[10px] ml-1 uppercase font-bold">(500+ viajes)</span>
                    </div>
                 </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsVerifyingDriver(false)} className="flex-1 py-5 bg-slate-100 text-slate-400 font-black rounded-[24px] hover:bg-slate-200 transition-colors">Rechazar</button>
                <button onClick={onRequestTrip} className="flex-[2] py-5 moto-gradient text-white font-black rounded-[24px] shadow-2xl shadow-blue-200 active:scale-95 transition-all">Aceptar Viaje</button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-2xl font-black text-slate-900 leading-none">Tu Destino</h3>
                 {destination && (
                   <div className="text-right">
                     <p className="text-2xl font-black text-blue-600 leading-none">S/ 4.50</p>
                     <p className="text-[10px] font-black text-slate-300 uppercase mt-1">Estimado</p>
                   </div>
                 )}
              </div>
              
              <div className="space-y-4">
                <div className={`flex items-center gap-5 p-5 rounded-[28px] border-2 transition-all ${destination ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 bg-slate-50/30 opacity-60'}`}>
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${destination ? 'bg-blue-600 text-white' : 'bg-white text-slate-300'}`}>
                      <i className="fa-solid fa-motorcycle text-2xl"></i>
                   </div>
                   <div className="flex-1">
                      <p className="text-base font-black text-slate-900 leading-none mb-1">MotoYa Clásico</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">La opción más rápida en Mejía</p>
                   </div>
                   {destination && (
                     <div className="text-right">
                        <p className="text-sm font-black text-slate-900">3 min</p>
                        <i className="fa-solid fa-bolt text-yellow-400 text-xs"></i>
                     </div>
                   )}
                </div>
              </div>

              <button 
                onClick={handleStartRequest} 
                disabled={!destination} 
                className={`w-full py-6 rounded-[28px] font-black text-xl transition-all ${destination ? 'moto-gradient text-white shadow-2xl shadow-blue-200 active:scale-95' : 'bg-slate-100 text-slate-300'}`}
              >
                {destination ? 'Solicitar MotoYa' : 'Elige un destino'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default HomeScreen;
