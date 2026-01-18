
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
  type: string;
  lat: number;
  lng: number;
}

const MEJIA_MAPS_DATA: LocationData[] = [
  { address: "Plaza Bolívar", vicinity: "Centro de la Ciudad", type: 'historic', lat: 10.4447, lng: -63.9161 },
  { address: "Muelle Turístico", vicinity: "Frente al Mar", type: 'transport', lat: 10.4465, lng: -63.9180 },
  { address: "Hospital Municipal", vicinity: "Av. Salud", type: 'health', lat: 10.4430, lng: -63.9120 },
  { address: "Cachamaure Resort", vicinity: "Playa Este", type: 'nature', lat: 10.4550, lng: -63.8800 }
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

  const userLocation: [number, number] = [10.4440, -63.9165];

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(userLocation, 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);

      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div class="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center"><div class="w-2 h-2 bg-white rounded-full animate-ping"></div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      userMarkerRef.current = L.marker(userLocation, { icon: userIcon }).addTo(mapRef.current);
    }
  }, []);

  const selectDestination = (loc: LocationData) => {
    setDestination(loc);
    setSearchQuery(loc.address);
    setIsSearching(false);

    if (mapRef.current) {
      if (destMarkerRef.current) destMarkerRef.current.remove();
      
      const destIcon = L.divIcon({
        className: 'dest-marker',
        html: `<div class="flex flex-col items-center"><i class="fa-solid fa-location-dot text-red-600 text-3xl drop-shadow-lg"></i></div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      });
      destMarkerRef.current = L.marker([loc.lat, loc.lng], { icon: destIcon }).addTo(mapRef.current);
      
      const bounds = L.latLngBounds([userLocation, [loc.lat, loc.lng]]);
      mapRef.current.fitBounds(bounds, { padding: [80, 80] });
    }
  };

  const handleStartRequest = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setIsVerifyingDriver(true);
    }, 4000);
  };

  return (
    <div className="h-screen flex flex-col relative bg-white overflow-hidden">
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* SEARCH HEADER */}
      <div className="relative z-20 p-6 pt-12 pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          <div className="flex items-center gap-3">
            <button onClick={onGoToHistory} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100">
              <i className="fa-solid fa-bars text-slate-800"></i>
            </button>
            <div className="flex-1 bg-white rounded-2xl h-12 shadow-lg flex items-center px-4 gap-3 border border-slate-100">
              <i className="fa-solid fa-location-arrow text-blue-500"></i>
              <input 
                type="text" 
                placeholder="¿A dónde vas hoy?" 
                className="bg-transparent flex-1 outline-none text-sm font-bold text-slate-900"
                value={searchQuery}
                onFocus={() => setIsSearching(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isSearching && (
            <div className="bg-white rounded-[24px] shadow-2xl p-2 animate-fadeIn max-h-60 overflow-y-auto border border-slate-100">
              {MEJIA_MAPS_DATA.map((loc, i) => (
                <button key={i} onClick={() => selectDestination(loc)} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl text-left">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center"><i className="fa-solid fa-clock-rotate-left text-slate-400 text-xs"></i></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{loc.address}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{loc.vicinity}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ACTION PANEL */}
      <div className="mt-auto relative z-30 p-6 pointer-events-none">
        <div className="bg-white rounded-[32px] shadow-2xl p-6 border border-slate-100 animate-slideUp pointer-events-auto">
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
          
          {isRequesting ? (
            <div className="py-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-black text-slate-900">Buscando piloto...</h3>
              <p className="text-slate-400 text-xs font-bold uppercase mt-2">MotoYa está cerca de ti</p>
            </div>
          ) : isVerifyingDriver ? (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                 <div>
                   <h3 className="text-xl font-black text-slate-900">¡Conductor listo!</h3>
                   <p className="text-green-500 text-[10px] font-black uppercase tracking-widest mt-1">Juan está en camino</p>
                 </div>
                 <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                   <i className="fa-solid fa-check-double text-xl"></i>
                 </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl mb-6">
                 <img src="https://picsum.photos/id/64/100/100" className="w-12 h-12 rounded-xl object-cover" alt="Juan" />
                 <div className="flex-1">
                    <p className="font-bold text-slate-900 leading-none">Juan Pérez</p>
                    <p className="text-slate-400 text-[10px] font-bold mt-1">Honda CB125 • ABC-123</p>
                 </div>
                 <div className="flex items-center gap-1">
                    <i className="fa-solid fa-star text-yellow-400 text-[10px]"></i>
                    <span className="text-xs font-black">4.9</span>
                 </div>
              </div>
              <button onClick={onRequestTrip} className="w-full py-4 moto-gradient text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all">Ver Seguimiento</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-black text-slate-900">{destination ? 'Servicios disponibles' : 'A dónde quieres ir?'}</h3>
                {destination && <span className="text-blue-600 font-black text-lg">S/ 4.50</span>}
              </div>

              <div className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${destination ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${destination ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <i className="fa-solid fa-motorcycle text-xl"></i>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">MotoYa Económica</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Llega rápido, paga poco</p>
                </div>
              </div>

              <button 
                onClick={handleStartRequest} 
                disabled={!destination}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${destination ? 'moto-gradient text-white shadow-lg active:scale-95' : 'bg-slate-100 text-slate-300'}`}
              >
                {destination ? 'Solicitar MotoYa' : 'Selecciona un destino'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
