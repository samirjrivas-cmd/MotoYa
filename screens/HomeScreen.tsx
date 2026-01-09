
import React, { useState, useEffect, useRef } from 'react';

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

const MEJIA_MAPS_DATA: LocationData[] = [
  { address: "Plaza Bolívar de San Antonio", vicinity: "Calle Bolívar, Centro", type: 'historic', x: 48, y: 35 },
  { address: "Muelle Turístico de San Antonio", vicinity: "Av. Costanera, San Antonio del Golfo", type: 'transport', x: 42, y: 28 },
  { address: "Balneario Cachamaure", vicinity: "Troncal 9, Sector Cachamaure", type: 'nature', x: 75, y: 55 },
  { address: "Hospital General", vicinity: "Sector Las Marías", type: 'health', x: 38, y: 45 },
  { address: "Alcaldía de Mejía", vicinity: "Calle Principal", type: 'business', x: 47, y: 38 }
];

const HomeScreen: React.FC<HomeScreenProps> = ({ onGoToPayments, onGoToHistory, onRequestTrip }) => {
  const [selectedService, setSelectedService] = useState<'standard' | 'cargo'>('standard');
  const [destination, setDestination] = useState<LocationData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifyingDriver, setIsVerifyingDriver] = useState(false);
  
  const userLocation = { x: 50, y: 70 };

  const handleStartRequest = () => {
    setIsRequesting(true);
    // Simular búsqueda de 3 segundos
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
    <div className="h-screen flex flex-col relative bg-slate-100 overflow-hidden">
      {/* Mapa Background */}
      <div className="absolute inset-0 z-0 bg-slate-200">
        <img src="https://picsum.photos/seed/mejia_map/1200/1800" className="w-full h-full object-cover opacity-70 grayscale-[0.2]" alt="Map" />
        
        {/* User Marker */}
        <div className="absolute w-10 h-10 -ml-5 -mt-5 flex items-center justify-center z-10" style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}>
          <div className="absolute w-14 h-14 bg-blue-500/20 rounded-full animate-ping"></div>
          <div className="w-6 h-6 bg-white rounded-full border-[6px] border-blue-600 shadow-xl"></div>
        </div>

        {/* Destination Marker */}
        {destination && (
          <div className="absolute -ml-5 -mt-12 flex flex-col items-center z-20 animate-bounce" style={{ left: `${destination.x}%`, top: `${destination.y}%` }}>
            <i className="fa-solid fa-location-dot text-red-600 text-4xl drop-shadow-xl"></i>
          </div>
        )}
      </div>

      {/* Header / Search */}
      {!isRequesting && !isVerifyingDriver && (
        <div className="relative z-20 p-6 pt-12">
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-3">
                <button onClick={onGoToHistory} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <i className="fa-solid fa-bars text-slate-800"></i>
                </button>
                <div className="flex-1 bg-white rounded-2xl h-12 shadow-xl flex items-center px-4 gap-3 border border-gray-50">
                   <i className="fa-solid fa-magnifying-glass text-blue-600"></i>
                   <input 
                     type="text" 
                     placeholder="¿A dónde vamos?" 
                     className="bg-transparent flex-1 outline-none text-sm font-bold"
                     value={searchQuery}
                     onChange={(e) => {
                       setSearchQuery(e.target.value);
                       setIsSearching(true);
                     }}
                   />
                </div>
             </div>
             
             {isSearching && searchQuery && (
               <div className="bg-white rounded-3xl shadow-2xl p-2 animate-fadeIn max-h-60 overflow-y-auto">
                  {MEJIA_MAPS_DATA.map((loc, i) => (
                    <button key={i} onClick={() => { setDestination(loc); setSearchQuery(loc.address); setIsSearching(false); }} className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-2xl text-left border-b border-gray-50 last:border-0">
                       <i className={`fa-solid ${getIcon(loc.type)}`}></i>
                       <div>
                         <p className="text-xs font-black text-slate-900">{loc.address}</p>
                         <p className="text-[10px] text-slate-400">{loc.vicinity}</p>
                       </div>
                    </button>
                  ))}
               </div>
             )}
          </div>
        </div>
      )}

      {/* Bottom Panel */}
      <div className="mt-auto relative z-30 bg-white rounded-t-[45px] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] p-8">
        <div className="w-14 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
        
        {isRequesting ? (
          <div className="py-10 flex flex-col items-center animate-fadeIn text-center">
             <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <i className="fa-solid fa-motorcycle text-blue-600 text-3xl"></i>
                </div>
             </div>
             <h3 className="text-xl font-black text-slate-900">Buscando Motorizado</h3>
             <p className="text-slate-400 text-sm mt-2">Conectando con pilotos cercanos en Mejía...</p>
          </div>
        ) : isVerifyingDriver ? (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-black text-slate-900">Piloto Encontrado</h3>
               <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">Cerca de ti</span>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-[30px] border border-slate-100 mb-8">
               <img src="https://picsum.photos/id/64/150/150" className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="Driver" />
               <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-lg">Juan Pérez</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Honda CB125 • <span className="text-blue-600">ABC-123</span></p>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(s => <i key={s} className="fa-solid fa-star text-yellow-400 text-[10px]"></i>)}
                    <span className="text-[10px] font-black text-slate-900 ml-1">4.9</span>
                  </div>
               </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsVerifyingDriver(false)} className="flex-1 py-4 bg-slate-100 text-slate-400 font-black rounded-2xl active:scale-95 transition-all">Rechazar</button>
              <button onClick={onRequestTrip} className="flex-[2] py-4 moto-gradient text-white font-black rounded-2xl shadow-xl shadow-blue-100 active:scale-95 transition-all">Aceptar Viaje</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-900">Detalles del viaje</h3>
               {destination && <span className="text-blue-600 font-black text-lg">S/ 4.50</span>}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <i className="fa-solid fa-motorcycle text-blue-600"></i>
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-black text-slate-900">MotoYa Clásico</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Viaje rápido y económico</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-black text-slate-900">3 min</p>
                    <p className="text-[10px] text-green-500 font-bold uppercase">Disponible</p>
                 </div>
              </div>
            </div>

            <button 
              onClick={handleStartRequest} 
              disabled={!destination} 
              className={`w-full py-5 rounded-[25px] font-black text-lg transition-all ${destination ? 'moto-gradient text-white shadow-2xl active:scale-95' : 'bg-slate-100 text-slate-300'}`}
            >
              Pedir MotoYa
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default HomeScreen;
