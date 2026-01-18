
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

interface HomeScreenProps {
  onGoToPayments: () => void;
  onGoToHistory: () => void;
  onRequestTrip: () => void;
}

interface LocationData {
  address: string;
  vicinity: string;
  type: 'historic' | 'business' | 'transport' | 'nature' | 'health';
  lat: number;
  lng: number;
}

const MEJIA_MAPS_DATA: LocationData[] = [
  { address: "Plaza Bolívar de San Antonio", vicinity: "Calle Bolívar, Centro", type: 'historic', lat: 10.4447, lng: -63.9161 },
  { address: "Muelle Turístico de San Antonio", vicinity: "Av. Costanera", type: 'transport', lat: 10.4465, lng: -63.9180 },
  { address: "Balneario Cachamaure", vicinity: "Troncal 9, Sector Cachamaure", type: 'nature', lat: 10.4550, lng: -63.8800 },
  { address: "Hospital General", vicinity: "Sector Las Marías", type: 'health', lat: 10.4430, lng: -63.9120 },
  { address: "Alcaldía de Mejía", vicinity: "Calle Principal", type: 'business', lat: 10.4455, lng: -63.9150 }
];

const HomeScreen: React.FC<HomeScreenProps> = ({ onGoToPayments, onGoToHistory, onRequestTrip }) => {
  const [destination, setDestination] = useState<LocationData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifyingDriver, setIsVerifyingDriver] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const onlineDriversRef = useRef<L.Marker[]>([]);

  const userLocation: [number, number] = [10.4440, -63.9165];

  // Inicialización del Mapa
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(userLocation, 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);

      const userIcon = L.divIcon({
        className: 'user-icon',
        html: `<div class="w-8 h-8 bg-white rounded-full border-4 border-blue-600 shadow-xl flex items-center justify-center"><div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      userMarkerRef.current = L.marker(userLocation, { icon: userIcon }).addTo(mapRef.current);
    }
  }, []);

  // Manejar marcadores de pilotos online durante la búsqueda
  useEffect(() => {
    if (isRequesting && mapRef.current) {
      // Crear pilotos ficticios alrededor
      const driverIcon = L.divIcon({
        className: 'driver-online-icon',
        html: `<div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center border-2 border-slate-800 shadow-lg animate-bounce"><i class="fa-solid fa-motorcycle text-slate-800"></i></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const drivers: L.Marker[] = [];
      for (let i = 0; i < 4; i++) {
        const randomLat = userLocation[0] + (Math.random() - 0.5) * 0.01;
        const randomLng = userLocation[1] + (Math.random() - 0.5) * 0.01;
        const marker = L.marker([randomLat, randomLng], { icon: driverIcon }).addTo(mapRef.current);
        drivers.push(marker);
      }
      onlineDriversRef.current = drivers;

      // Simular movimiento de los pilotos hacia el centro
      const moveInterval = setInterval(() => {
        drivers.forEach(d => {
          const curr = d.getLatLng();
          const nextLat = curr.lat + (userLocation[0] - curr.lat) * 0.1;
          const nextLng = curr.lng + (userLocation[1] - curr.lng) * 0.1;
          d.setLatLng([nextLat, nextLng]);
        });
      }, 500);

      return () => {
        clearInterval(moveInterval);
        drivers.forEach(d => d.remove());
        onlineDriversRef.current = [];
      };
    }
  }, [isRequesting]);

  const handleStartRequest = () => {
    setIsSearching(false);
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setIsVerifyingDriver(true);
    }, 5000);
  };

  const selectDestination = (loc: LocationData) => {
    setDestination(loc);
    setSearchQuery(loc.address);
    setIsSearching(false);

    if (mapRef.current) {
      if (destMarkerRef.current) destMarkerRef.current.remove();
      
      const destIcon = L.divIcon({
        className: 'dest-icon',
        html: `<div class="flex flex-col items-center"><div class="bg-white px-2 py-1 rounded-md shadow-lg border text-[8px] font-black mb-1">${loc.address}</div><i class="fa-solid fa-location-dot text-red-600 text-3xl"></i></div>`,
        iconSize: [100, 50],
        iconAnchor: [50, 50]
      });
      destMarkerRef.current = L.marker([loc.lat, loc.lng], { icon: destIcon }).addTo(mapRef.current);
      
      const bounds = L.latLngBounds([userLocation, [loc.lat, loc.lng]]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="h-screen flex flex-col relative bg-slate-50 overflow-hidden">
      {/* MAPA INTERACTIVO */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* HEADER FLOTANTE */}
      <div className="relative z-30 p-6 pt-14 pointer-events-none">
        <div className="flex flex-col gap-4 pointer-events-auto">
           <div className="flex items-center gap-3">
              <button onClick={onGoToHistory} className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 active:scale-95 transition-transform">
                <i className="fa-solid fa-bars text-slate-800 text-lg"></i>
              </button>
              <div className="flex-1 bg-white rounded-2xl h-14 shadow-xl flex items-center px-5 gap-3 border border-slate-100">
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
             <div className="bg-white rounded-[32px] shadow-2xl p-2 animate-fadeIn max-h-72 overflow-y-auto border border-slate-100">
                {MEJIA_MAPS_DATA.map((loc, i) => (
                  <button 
                    key={i} 
                    onClick={() => selectDestination(loc)} 
                    className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 transition-colors rounded-2xl text-left"
                  >
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                        <i className={`fa-solid fa-location-dot text-blue-500`}></i>
                     </div>
                     <div>
                       <p className="text-sm font-black text-slate-900 leading-none mb-1">{loc.address}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">{loc.vicinity}</p>
                     </div>
                  </button>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* PANEL INFERIOR */}
      <div className="mt-auto relative z-40 p-6 pointer-events-none">
        <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-slate-100 animate-slideUp pointer-events-auto">
          <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mb-8"></div>
          
          {isRequesting ? (
            <div className="py-6 flex flex-col items-center text-center">
               <div className="relative w-20 h-20 mb-8">
                  <div className="absolute inset-0 border-[6px] border-blue-50 rounded-full"></div>
                  <div className="absolute inset-0 border-[6px] border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  <i className="fa-solid fa-motorcycle text-blue-600 text-3xl absolute inset-0 flex items-center justify-center"></i>
               </div>
               <h3 className="text-2xl font-black text-slate-900">Buscando pilotos...</h3>
               <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-2 animate-pulse">Conectando con motorizados online</p>
            </div>
          ) : isVerifyingDriver ? (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-8">
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 leading-none mb-2">¡Asignado!</h3>
                   <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">Juan está aceptando el viaje</span>
                 </div>
                 <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                   <i className="fa-solid fa-check-double text-2xl"></i>
                 </div>
              </div>
              <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-[32px] mb-8 border border-slate-100">
                 <img src="https://picsum.photos/id/64/150/150" className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white" alt="Driver" />
                 <div className="flex-1">
                    <h4 className="font-black text-slate-900 text-lg leading-none">Juan Pérez</h4>
                    <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">Honda CB125 • ABC-123</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <i className="fa-solid fa-star text-yellow-400 text-[10px]"></i>
                      <span className="text-xs font-black text-slate-900">4.9</span>
                    </div>
                 </div>
              </div>
              <button onClick={onRequestTrip} className="w-full py-5 moto-gradient text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all text-lg">Ver Seguimiento</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-slate-900 leading-none">{destination ? 'Tu Viaje' : '¿A dónde vas?'}</h3>
                 {destination && (
                   <div className="text-right">
                      <p className="text-2xl font-black text-blue-600 leading-none">S/ 4.50</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Precio estimado</p>
                   </div>
                 )}
              </div>
              
              <div className={`flex items-center gap-5 p-5 rounded-[28px] border-2 transition-all ${destination ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 opacity-60'}`}>
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${destination ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-300'}`}>
                    <i className="fa-solid fa-motorcycle text-2xl"></i>
                 </div>
                 <div className="flex-1">
                    <p className="text-base font-black text-slate-900 leading-none mb-1">MotoYa Económica</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Llega más rápido por menos</p>
                 </div>
              </div>

              <button 
                onClick={handleStartRequest} 
                disabled={!destination} 
                className={`w-full py-6 rounded-[28px] font-black text-xl transition-all ${destination ? 'moto-gradient text-white shadow-xl active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
              >
                {destination ? 'Solicitar Ahora' : 'Ingresa un destino'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0, 0, 0.2, 1); }
      `}</style>
    </div>
  );
};

export default HomeScreen;
