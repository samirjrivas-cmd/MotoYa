
import React, { useEffect, useState, useRef } from 'react';
import { UserRole } from '../types';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

interface TripActiveScreenProps {
  onCancel: () => void;
  onGoToPay?: () => void;
  role?: UserRole;
}

type TripStage = 'PICKUP' | 'WAITING_FOR_CLIENT' | 'EN_ROUTE' | 'ARRIVED' | 'RATING';

const TripActiveScreen: React.FC<TripActiveScreenProps> = ({ onCancel, onGoToPay, role = 'USER' }) => {
  const [stage, setStage] = useState<TripStage>('PICKUP');
  const [userCoords, setUserCoords] = useState({ x: 50, y: 70 });
  const [motorCoords, setMotorCoords] = useState({ x: 10, y: 10 });
  const [etaSeconds, setEtaSeconds] = useState(120);
  const [distanceKm, setDistanceKm] = useState(1.5);
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOBILE_PAY' | null>(null);
  const [copied, setCopied] = useState(false);

  // Simulación de datos del conductor asignado
  const assignedDriver = {
    name: "Juan Pérez",
    paymentInfo: {
      bankCode: "0102 - Banco de Venezuela",
      phoneNumber: "0414-1234567"
    }
  };

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const destinationCoords = { x: 25, y: 25 };
  const userId = 'USER_123';
  const driverId = 'DRIVER_456';
  const myId = role === 'USER' ? userId : driverId;
  const receiverId = role === 'USER' ? driverId : userId;

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  useEffect(() => {
    if (stage === 'ARRIVED') {
      setShowPaymentModal(true);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'ARRIVED' || stage === 'RATING') return;

    const moveInterval = setInterval(() => {
      setMotorCoords(prev => {
        const target = stage === 'PICKUP' ? userCoords : destinationCoords;
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 2) {
          if (stage === 'PICKUP') setStage('WAITING_FOR_CLIENT');
          if (stage === 'EN_ROUTE') setStage('ARRIVED');
          return target;
        }

        const step = 0.5;
        return {
          x: prev.x + (dx / distance) * step,
          y: prev.y + (dy / distance) * step
        };
      });

      setEtaSeconds(prev => Math.max(0, prev - 1));
      setDistanceKm(prev => Math.max(0, prev - 0.01));
    }, 1000);

    return () => clearInterval(moveInterval);
  }, [stage, userCoords]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartTrip = () => {
    setStage('EN_ROUTE');
    setEtaSeconds(300);
    setDistanceKm(3.2);
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || stage === 'ARRIVED') return;
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: myId,
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-slate-900">
      {/* Background Map View */}
      <div className="absolute inset-0 z-0 bg-slate-200">
        <img src="https://picsum.photos/seed/mejia_ride/1200/1800" className="w-full h-full object-cover opacity-60 grayscale-[0.3]" alt="Map" />
        
        {/* Indicators Overlay */}
        {['PICKUP', 'EN_ROUTE'].includes(stage) && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 w-[90%] bg-white/90 backdrop-blur-md rounded-[28px] p-5 shadow-2xl border border-white/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                  <i className="fa-solid fa-bolt text-lg"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tiempo</p>
                  <p className="text-xl font-black text-slate-900 leading-none">
                    {Math.floor(etaSeconds / 60)}:{(etaSeconds % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Distancia</p>
                <p className="text-xl font-black text-blue-600 leading-none">{distanceKm.toFixed(1)} <span className="text-xs font-bold text-slate-400">km</span></p>
              </div>
            </div>
          </div>
        )}

        {/* User Marker */}
        <div className="absolute -ml-4 -mt-4 z-10" style={{ left: `${userCoords.x}%`, top: `${userCoords.y}%` }}>
           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-4 border-blue-600 shadow-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
           </div>
        </div>

        {/* Motorcycle Marker */}
        <div className="absolute -ml-8 -mt-8 z-20 transition-all duration-1000 ease-linear" style={{ left: `${motorCoords.x}%`, top: `${motorCoords.y}%` }}>
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border-4 border-blue-600 shadow-2xl relative">
             <i className="fa-solid fa-motorcycle text-blue-600 text-2xl"></i>
          </div>
        </div>
      </div>

      {/* Payment Selection Modal (Triggered on ARRIVED) */}
      {showPaymentModal && role === 'USER' && (
        <div className="absolute inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[45px] p-8 shadow-2xl transform animate-slideUp">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-wallet text-blue-600 text-3xl"></i>
              </div>
              <h2 className="text-2xl font-black text-slate-900">Finalizar Viaje</h2>
              <p className="text-slate-400 font-medium mt-1">Selecciona tu método de pago</p>
              <div className="text-3xl font-black text-blue-600 mt-4">S/ 4.50</div>
            </div>

            {!paymentMethod ? (
              <div className="space-y-4">
                <button 
                  onClick={() => setPaymentMethod('CASH')}
                  className="w-full flex items-center gap-4 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <i className="fa-solid fa-money-bill-1-wave text-xl"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-slate-900">Efectivo</p>
                    <p className="text-xs text-slate-400 font-bold uppercase">Pago directo al piloto</p>
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('MOBILE_PAY')}
                  className="w-full flex items-center gap-4 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <i className="fa-solid fa-mobile-screen-button text-xl"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-slate-900">Pago Móvil</p>
                    <p className="text-xs text-slate-400 font-bold uppercase">Transferencia inmediata</p>
                  </div>
                </button>
              </div>
            ) : paymentMethod === 'CASH' ? (
              <div className="text-center py-6 animate-fadeIn">
                <p className="text-slate-600 font-medium mb-8">Por favor, entrega el monto acordado al conductor para finalizar el servicio.</p>
                <button 
                  onClick={() => onGoToPay?.()}
                  className="w-full py-5 moto-gradient text-white font-black rounded-2xl shadow-xl shadow-blue-100"
                >
                  Confirmar Entrega
                </button>
                <button onClick={() => setPaymentMethod(null)} className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Cambiar método</button>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="bg-slate-50 rounded-3xl p-6 mb-6 space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Banco del Piloto</p>
                    <p className="font-black text-slate-900">{assignedDriver.paymentInfo.bankCode}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Teléfono Destino</p>
                      <p className="font-black text-slate-900 text-lg">{assignedDriver.paymentInfo.phoneNumber}</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(assignedDriver.paymentInfo.phoneNumber)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-blue-600 shadow-sm'}`}
                    >
                      <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => onGoToPay?.()}
                  className="w-full py-5 moto-gradient text-white font-black rounded-2xl shadow-xl shadow-blue-100"
                >
                  Ya realicé el pago
                </button>
                <button onClick={() => setPaymentMethod(null)} className="w-full mt-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Cambiar método</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Driver Arrived State */}
      {stage === 'WAITING_FOR_CLIENT' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
           <div className="bg-white rounded-[40px] p-8 w-full max-sm shadow-2xl animate-bounceIn text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <i className="fa-solid fa-handshake-angle text-blue-600 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{role === 'DRIVER' ? '¡Llegaste!' : '¡Tu piloto llegó!'}</h3>
              <p className="text-slate-400 font-medium mb-8">
                {role === 'DRIVER' ? 'Espera a que el cliente suba para iniciar el viaje.' : assignedDriver.name + ' está esperando en tu ubicación.'}
              </p>
              {role === 'DRIVER' && (
                <button 
                  onClick={handleStartTrip}
                  className="w-full py-5 moto-gradient text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all text-xl"
                >
                  Iniciar Viaje
                </button>
              )}
           </div>
        </div>
      )}

      {/* Chat View (Internal component for cohesion) */}
      {isChatOpen && (
        <div className="absolute inset-0 z-[150] bg-white flex flex-col animate-slideUp">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <button onClick={() => { setIsChatOpen(false); setHasNewMessages(false); }} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                   <i className="fa-solid fa-chevron-down"></i>
                </button>
                <h3 className="font-black text-slate-900">Chat con el Piloto</h3>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
             {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.senderId === myId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${
                    msg.senderId === myId 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
               </div>
             ))}
             <div ref={chatEndRef} />
          </div>
          <div className="p-6 border-t border-slate-50 pb-10">
             <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-[28px]">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-transparent px-4 py-3 outline-none text-sm font-bold text-slate-900"
                />
                <button 
                  onClick={sendMessage}
                  className="w-12 h-12 moto-gradient text-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Action Tray */}
      <div className="mt-auto relative z-30 bg-white rounded-t-[45px] shadow-[0_-20px_60px_rgba(0,0,0,0.3)] p-8">
        <div className="w-14 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
        <div className="flex items-center gap-4 mb-8">
           <img src="https://picsum.photos/id/64/150/150" className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="Avatar" />
           <div className="flex-1">
              <h4 className="font-black text-slate-900 text-lg leading-none">{assignedDriver.name}</h4>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">HONDA CB125 • ABC-123</p>
           </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
           <button className="flex flex-col items-center gap-1 py-4 bg-slate-50 rounded-2xl text-slate-500">
              <i className="fa-solid fa-phone text-blue-600"></i>
              <span className="text-[9px] font-black uppercase">Llamar</span>
           </button>
           <button 
            onClick={() => setIsChatOpen(true)}
            className="flex flex-col items-center gap-1 py-4 bg-slate-50 rounded-2xl text-slate-500 relative"
           >
              <i className="fa-solid fa-message text-blue-600"></i>
              <span className="text-[9px] font-black uppercase">Chat</span>
              {hasNewMessages && <div className="absolute top-2 right-6 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>}
           </button>
           <button onClick={onCancel} className="flex flex-col items-center gap-1 py-4 bg-red-50 rounded-2xl text-red-500">
              <i className="fa-solid fa-circle-xmark"></i>
              <span className="text-[9px] font-black uppercase">Cancelar</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default TripActiveScreen;
