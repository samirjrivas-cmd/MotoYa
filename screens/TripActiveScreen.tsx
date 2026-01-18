import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../types';
import L from 'leaflet';

interface TripActiveScreenProps {
  onCancel: () => void;
  onGoToPay?: () => void;
  role?: UserRole;
}

type TripStep = 'TRACKING' | 'ARRIVED_NOTICE' | 'PAYMENT_SELECTION' | 'CONFIRMING_PAYMENT' | 'IN_TRIP' | 'COMPLETED';

const TripActiveScreen: React.FC<TripActiveScreenProps> = ({ onCancel, onGoToPay, role = 'USER' }) => {
  const [tripStep, setTripStep] = useState<TripStep>('TRACKING');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOBILE_PAY' | null>(null);
  const [copied, setCopied] = useState(false);
  const [eta, setEta] = useState({ min: 5, km: 1.5 });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDriver = role === 'DRIVER';

  // Coordenadas Reales (San Antonio del Golfo, Mejía)
  const userLocation: [number, number] = [10.4447, -63.9161];
  const destinationLocation: [number, number] = [10.4485, -63.9225];
  const [motorCoords, setMotorCoords] = useState<[number, number]>([10.4400, -63.9100]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const motorMarkerRef = useRef<L.Marker | null>(null);

  const driver = {
    name: "Juan Pérez",
    vehicle: "Honda CB125 • ABC-123",
    payment: {
      bank: "0102 - Banco de Venezuela",
      phone: "0414-1234567",
      id: "V-12.345.678"
    }
  };

  const passenger = {
    name: "Maria G.",
    avatar: "https://picsum.photos/id/1027/150/150"
  };

  // Inicialización del Mapa
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(userLocation, 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);

      // Marcador Usuario
      const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-8 h-8 bg-white rounded-full flex items-center justify-center border-4 border-blue-600 shadow-xl"><div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      L.marker(userLocation, { icon: userIcon }).addTo(mapRef.current);

      // Marcador Destino
      const destIcon = L.divIcon({
        className: 'dest-div-icon',
        html: `<div class="w-8 h-8 bg-white rounded-full flex items-center justify-center border-4 border-red-600 shadow-xl"><i class="fa-solid fa-location-dot text-red-600 text-xs"></i></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      L.marker(destinationLocation, { icon: destIcon }).addTo(mapRef.current);

      // Marcador Motorizado
      const motorIcon = L.divIcon({
        className: 'motor-div-icon',
        html: `<div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-slate-900 shadow-2xl overflow-hidden"><i class="fa-solid fa-motorcycle text-slate-900 text-xl"></i></div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });
      motorMarkerRef.current = L.marker(motorCoords, { icon: motorIcon }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Lógica de Movimiento Automático
  useEffect(() => {
    if (tripStep === 'COMPLETED' || tripStep === 'ARRIVED_NOTICE' || tripStep === 'PAYMENT_SELECTION' || tripStep === 'CONFIRMING_PAYMENT') return;

    let target = tripStep === 'IN_TRIP' ? destinationLocation : userLocation;

    const moveInterval = setInterval(() => {
      setMotorCoords(prev => {
        const dLat = target[0] - prev[0];
        const dLng = target[1] - prev[1];
        const distance = Math.sqrt(dLat * dLat + dLng * dLng);

        if (distance < 0.0001) {
          clearInterval(moveInterval);
          if (tripStep === 'TRACKING') {
            setTripStep('ARRIVED_NOTICE');
          } else if (tripStep === 'IN_TRIP') {
            setTripStep('COMPLETED');
          }
          return target;
        }

        const step = tripStep === 'IN_TRIP' ? 0.00025 : 0.00015;
        const nextCoords: [number, number] = [
          prev[0] + (dLat / distance) * step,
          prev[1] + (dLng / distance) * step
        ];

        if (motorMarkerRef.current) {
          motorMarkerRef.current.setLatLng(nextCoords);
          if (mapRef.current) {
            mapRef.current.panTo(nextCoords);
          }
        }

        const distKm = (distance * 111).toFixed(1);
        setEta({
          min: Math.max(1, Math.ceil(parseFloat(distKm) * 2)),
          km: parseFloat(distKm)
        });

        return nextCoords;
      });
    }, 1000);

    return () => clearInterval(moveInterval);
  }, [tripStep]);

  useEffect(() => {
    if (tripStep === 'CONFIRMING_PAYMENT') {
      const timer = setTimeout(() => {
        setTripStep('IN_TRIP');
      }, 3000);
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
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/90 to-transparent pointer-events-none z-10" />

      <div className="relative z-50 flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar pointer-events-none">
        <div className="pointer-events-auto mt-auto">
          
          {/* 0. TRACKING */}
          {tripStep === 'TRACKING' && (
            <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 animate-slideUp">
               <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-black leading-none">{isDriver ? 'Yendo al cliente' : 'Tu piloto viene'}</h3>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Síguelo en el mapa</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-black leading-none">{eta.min} <span className="text-xs text-slate-400">min</span></p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">{eta.km} km</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <img src={isDriver ? passenger.avatar : "https://picsum.photos/id/64/100/100"} className="w-12 h-12 rounded-xl object-cover" alt="Avatar" />
                  <div className="flex-1">
                    <p className="font-black text-black leading-none">{isDriver ? `Pasajero: ${passenger.name}` : driver.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{isDriver ? 'Destino: Hospital Central' : driver.vehicle}</p>
                  </div>
                  <button className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                    <i className="fa-solid fa-phone"></i>
                  </button>
               </div>
            </div>
          )}

          {/* 1. LLEGADA (CASO A y B) */}
          {tripStep === 'ARRIVED_NOTICE' && (
            <>
              {isDriver ? (
                /* VISTA DEL MOTORIZADO */
                <div className="bg-white rounded-[40px] p-8 shadow-2xl border-t-8 border-slate-900 animate-slideUp">
                   <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="fa-solid fa-location-dot text-slate-900 text-3xl"></i>
                   </div>
                   <h2 className="text-2xl font-black text-black text-center mb-2 leading-tight">Has llegado al punto de recogida</h2>
                   <p className="text-slate-500 font-medium text-center mb-8 px-4">
                     Espera a que el pasajero confirme el encuentro y el método de pago.
                   </p>
                   <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={() => { setPaymentMethod('MOBILE_PAY'); setTripStep('PAYMENT_SELECTION'); }}
                        className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
                      >
                        <i className="fa-solid fa-mobile-screen"></i>
                        Cliente a bordo (P. Móvil)
                      </button>
                      <button 
                        onClick={() => { setPaymentMethod('CASH'); setTripStep('IN_TRIP'); }}
                        className="w-full py-5 bg-green-600 text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
                      >
                        <i className="fa-solid fa-money-bill-wave"></i>
                        Cliente a bordo (Efectivo)
                      </button>
                   </div>
                </div>
              ) : (
                /* VISTA DEL PASAJERO */
                <div className="bg-white rounded-[40px] p-8 shadow-2xl border-t-8 border-blue-600 animate-slideUp text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <i className="fa-solid fa-motorcycle text-blue-600 text-4xl"></i>
                  </div>
                  <h2 className="text-3xl font-black text-black mb-2 leading-tight">¡Llegamos por ti!</h2>
                  <p className="text-slate-500 font-medium mb-8">
                    {driver.name} ya está en el sitio. Sube a la unidad y confirma el pago.
                  </p>
                  <button 
                    onClick={() => setTripStep('PAYMENT_SELECTION')}
                    className="w-full py-5 moto-gradient text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all text-xl"
                  >
                    Estoy con el piloto
                  </button>
                </div>
              )}
            </>
          )}

          {/* 2. PAGO */}
          {tripStep === 'PAYMENT_SELECTION' && (
            <div className="bg-white rounded-[40px] p-8 shadow-2xl animate-slideUp">
              <h2 className="text-2xl font-black text-black mb-1">{isDriver ? 'Verificando Pago Móvil' : 'Confirmar Pago'}</h2>
              <p className="text-slate-500 font-medium mb-6">{isDriver ? 'Espera a que el cliente reporte el pago' : 'Indica cómo cancelarás este viaje'}</p>
              
              {!isDriver ? (
                <>
                  <div className="space-y-4 mb-8">
                    <button onClick={() => setPaymentMethod('MOBILE_PAY')} className={`w-full p-5 rounded-[28px] border-2 transition-all flex items-center gap-4 ${paymentMethod === 'MOBILE_PAY' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-slate-50'}`}>
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-100">
                        <i className="fa-solid fa-mobile-screen"></i>
                      </div>
                      <div className="text-left font-black text-black">Pago Móvil</div>
                    </button>
                    <button onClick={() => setPaymentMethod('CASH')} className={`w-full p-5 rounded-[28px] border-2 transition-all flex items-center gap-4 ${paymentMethod === 'CASH' ? 'border-green-600 bg-green-50' : 'border-slate-100 bg-slate-50'}`}>
                      <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-green-100">
                        <i className="fa-solid fa-money-bill-1-wave"></i>
                      </div>
                      <div className="text-left font-black text-black">Efectivo</div>
                    </button>
                  </div>
                  {paymentMethod === 'MOBILE_PAY' && (
                    <div className="bg-slate-900 rounded-3xl p-6 mb-6 text-white animate-fadeIn">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Datos para transferencia</p>
                      <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                        <p className="font-black text-lg">{driver.payment.phone}</p>
                        <button onClick={() => handleCopy(driver.payment.phone)} className={`p-2 rounded-lg ${copied ? 'bg-green-500' : 'bg-blue-600'}`}>
                          <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                        </button>
                      </div>
                    </div>
                  )}
                  <button onClick={() => setTripStep('CONFIRMING_PAYMENT')} disabled={!paymentMethod} className={`w-full py-5 font-black rounded-3xl shadow-xl transition-all text-xl ${paymentMethod ? 'moto-gradient text-white active:scale-95' : 'bg-slate-100 text-slate-300'}`}>
                    Ya realicé el pago
                  </button>
                </>
              ) : (
                <div className="space-y-6">
                   <div className="p-6 bg-blue-50 border border-blue-100 rounded-[32px] text-center">
                      <i className="fa-solid fa-hourglass-half text-blue-600 text-4xl mb-4 animate-spin-slow"></i>
                      <p className="font-bold text-blue-900">Validando con el cliente...</p>
                      <p className="text-xs text-blue-400 mt-2">Te avisaremos cuando se confirme la transacción.</p>
                   </div>
                   <button onClick={() => setTripStep('IN_TRIP')} className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl">Simular Confirmación Recibida</button>
                </div>
              )}
            </div>
          )}

          {/* 3. VALIDACIÓN */}
          {tripStep === 'CONFIRMING_PAYMENT' && (
            <div className="mb-10 mx-auto bg-white rounded-[45px] p-10 shadow-2xl flex flex-col items-center animate-fadeIn max-w-sm border border-slate-100">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-[6px] border-blue-50 rounded-full"></div>
                <div className="absolute inset-0 border-[6px] border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <i className="fa-solid fa-shield-check text-blue-600 text-4xl absolute inset-0 flex items-center justify-center"></i>
              </div>
              <h2 className="text-2xl font-black text-black text-center mb-2">Verificando...</h2>
              <p className="text-slate-500 text-center font-medium italic">El motorizado está confirmando el recibo en su dispositivo.</p>
            </div>
          )}

          {/* 4. EN RUTA */}
          {tripStep === 'IN_TRIP' && (
            <div className="space-y-4 animate-slideUp">
              <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                     <i className="fa-solid fa-route text-2xl"></i>
                  </div>
                  <div>
                     <p className="text-2xl font-black text-black leading-none">{eta.min} <span className="text-sm text-slate-400">min</span></p>
                     <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Hacia el destino final</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-black leading-none">{eta.km} <span className="text-xs text-slate-400">km</span></p>
                </div>
              </div>
              <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100">
                <div className="flex items-center gap-4 mb-2">
                  <img src={isDriver ? passenger.avatar : "https://picsum.photos/id/64/150/150"} className="w-12 h-12 rounded-2xl object-cover" alt="User" />
                  <div className="flex-1">
                     <h4 className="font-black text-black text-lg leading-none">{isDriver ? passenger.name : driver.name}</h4>
                     <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">{isDriver ? 'Pago: ' + (paymentMethod || 'Efectivo') : driver.vehicle}</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                   <div className="h-full bg-blue-600 animate-pulse w-full origin-left transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          )}

          {/* 5. COMPLETADO (NUEVA LÓGICA DE CALIFICACIÓN PARA AMBOS) */}
          {tripStep === 'COMPLETED' && (
            <div className="bg-white rounded-[45px] p-8 shadow-2xl animate-slideUp text-center border-t-8 border-green-500">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <i className="fa-solid fa-location-check text-green-600 text-3xl"></i>
              </div>
              <h2 className="text-3xl font-black text-black mb-1 leading-tight">¡Llegamos!</h2>
              <p className="text-slate-500 font-medium mb-8 italic">
                {isDriver ? 'Has finalizado el trayecto. Por favor, califica al usuario.' : 'Esperamos que hayas tenido un excelente viaje.'}
              </p>
              
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 mb-6">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                   Califica a {isDriver ? passenger.name : driver.name}
                 </p>
                 <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)} className="transition-all hover:scale-125 p-1">
                        <i className={`fa-solid fa-star text-4xl ${star <= rating ? 'text-yellow-400 drop-shadow-md' : 'text-slate-200'}`}></i>
                      </button>
                    ))}
                 </div>
              </div>

              {isDriver && (
                <div className="bg-blue-50 p-6 rounded-[32px] mb-6 border border-blue-100">
                   <p className="text-blue-900 font-black text-lg leading-none">Ganancia del viaje</p>
                   <p className="text-blue-600 text-3xl font-black mt-2">S/ 4.50</p>
                </div>
              )}

              <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                placeholder={isDriver ? "¿Cómo fue el trato del usuario?" : "¿Algo que destacar?"} 
                className="w-full h-24 p-5 bg-slate-50 border border-slate-100 rounded-[28px] text-black font-medium text-sm mb-6 resize-none" 
              />

              <button 
                onClick={handleFinalize} 
                disabled={rating === 0 || isSubmitting} 
                className={`w-full py-5 font-black rounded-3xl shadow-xl transition-all text-xl ${rating > 0 ? 'moto-gradient text-white active:scale-95' : 'bg-slate-100 text-slate-300'}`}
              >
                {isSubmitting ? <i className="fa-solid fa-circle-notch animate-spin"></i> : (isDriver ? 'Nueva Solicitud' : 'Finalizar y salir')}
              </button>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0, 0, 0.2, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        .leaflet-div-icon { background: transparent !important; border: none !important; }
      `}</style>
    </div>
  );
};

export default TripActiveScreen;