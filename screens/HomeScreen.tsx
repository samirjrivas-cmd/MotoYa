
import React, { useState, useEffect } from 'react';

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
  const [destination, setDestination] = useState<LocationData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifyingDriver, setIsVerifyingDriver] = useState(false);
  
  const userLocation = { x: 50, y: 70 };

  const handleStartRequest = () => {
    setIsRequesting(true);
    // Simulación de matching en tiempo real
    setTimeout(() => {
      setIsRequesting(false);
      setIsVerifyingDriver(true);
    }, 4000);
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

      {/* HEADER FLOTANTE */}
      {!isRequesting && !isVerifyingDriver && (
        <div className="relative z-30 p-6 pt-14">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <button onClick={onGoToHistory} className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                  <i className="fa-solid fa-bars text-slate-800 text-lg"></i>
                </button>
                <div className="flex-1 bg-white rounded-2xl h-14 shadow-2xl flex items-center px-5 gap-3">
                   <i className="fa-solid fa-magnifying-glass text-blue-600"></i>
                   <input 
                     type="text" 
                     placeholder="¿A dónde vamos?" 
                     className="bg-transparent flex-1 outline-none text-sm font-bold text-black"
                     value={searchQuery}
                     onFocus={() => setIsSearching(true)}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
             </div>
             
             {isSearching && (
               <div className="bg-white rounded-3xl shadow-2xl p-2 animate-fadeIn max-h-72 overflow-y-auto border border-slate-50">
                  {MEJIA_MAPS_DATA.map((loc, i) => (
                    <button 
                      key={i} 
                      onClick={() => { setDestination(loc); setSearchQuery(loc.address); setIsSearching(false); }} 
                      className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 transition-colors rounded-2xl text-left"
                    >
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

      {/* PANEL INFERIOR */}
      <div className="mt-auto relative z-40 p-6">
        <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-white animate-slideUp">
          <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mb-8"></div>
          
          {isRequesting ? (
            <div className="py-6 flex flex-col items-center text-center">
               <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-[6px] border-blue-50 rounded-full"></div>
                  <div className="absolute inset-0 border-[6px] border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <i className="fa-solid fa-motorcycle text-blue-600 text-4xl absolute inset-0 flex items-center justify-center"></i>
               </div>
               <h3 className="text-2xl font-black text-slate-900">Buscando el mejor piloto</h3>
               <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-tighter animate-pulse">Analizando motorizados cercanos...</p>
            </div>
          ) : isVerifyingDriver ? (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-8">
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 leading-none mb-2">¡Asignado!</h3>
                   <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">Juan está en camino</span>
                 </div>
                 <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                   <i className="fa-solid fa-check-double text-2xl"></i>
                 </div>
              </div>
              <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-[32px] mb-8">
                 <img src="https://picsum.photos/id/64/150/150" className="w-20 h-20 rounded-2xl object-cover shadow-xl border-4 border-white" alt="Driver" />
                 <div className="flex-1">
                    <h4 className="font-black text-slate-900 text-xl leading-none">Juan Pérez</h4>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Honda CB125 • ABC-123</p>
                    <div className="flex items-center gap-1 mt-2">
                      <i className="fa-solid fa-star text-yellow-400 text-xs"></i>
                      <span className="text-sm font-black text-slate-900">4.9</span>
                    </div>
                 </div>
              </div>
              <button onClick={onRequestTrip} className="w-full py-5 moto-gradient text-white font-black rounded-[24px] shadow-2xl active:scale-95 transition-all text-lg">Ver Seguimiento</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-slate-900 leading-none">Tu Destino</h3>
                 {destination && (
                   <p className="text-2xl font-black text-blue-600 leading-none">S/ 4.50</p>
                 )}
              </div>
              
              <div className={`flex items-center gap-5 p-5 rounded-[28px] border-2 transition-all ${destination ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 opacity-60'}`}>
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${destination ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-300'}`}>
                    <i className="fa-solid fa-motorcycle text-2xl"></i>
                 </div>
                 <div className="flex-1">
                    <p className="text-base font-black text-slate-900 leading-none mb-1">MotoYa Económica</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">La forma más rápida de moverte</p>
                 </div>
              </div>

              <button 
                onClick={handleStartRequest} 
                disabled={!destination} 
                className={`w-full py-6 rounded-[28px] font-black text-xl transition-all ${destination ? 'moto-gradient text-white shadow-2xl shadow-blue-100 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
              >
                {destination ? 'Solicitar Ahora' : 'Ingresa un destino'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
