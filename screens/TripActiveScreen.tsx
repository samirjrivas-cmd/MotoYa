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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {
        setUserCoords({ x: 50, y: 70 });
      });
    }
  }, []);

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
        const nextPos = {
          x: prev.x + (dx / distance) * step,
          y: prev.y + (dy / distance) * step
        };

        return nextPos;
      });

      setEtaSeconds(prev => Math.max(0, prev - 1));
      setDistanceKm(prev => Math.max(0, prev - 0.01));
    }, 1000);

    return () => clearInterval(moveInterval);
  }, [stage, userCoords]);

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

    setTimeout(() => {
      const reply: Message = {
        id: Math.random().toString(36).substr(2, 9),
        senderId: receiverId,
        content: role === 'USER' ? '¡Entendido! Ya casi llego.' : 'Perfecto, te espero.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, reply]);
      if (!isChatOpen) setHasNewMessages(true);
    }, 2000);
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0 bg-slate-200">
        <img src="https://picsum.photos/seed/mejia_ride/1200/1800" className="w-full h-full object-cover opacity-60 grayscale-[0.3]" alt="Map" />
        
        {['PICKUP', 'EN_ROUTE'].includes(stage) && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 w-[90%] bg-white/90 backdrop-blur-md rounded-[28px] p-5 shadow-2xl border border-white/50 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                  <i className="fa-solid fa-bolt text-lg"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Llegada en</p>
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

        <div className="absolute -ml-4 -mt-4 z-10" style={{ left: `${userCoords.x}%`, top: `${userCoords.y}%` }}>
           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-4 border-blue-600 shadow-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
           </div>
        </div>

        {stage === 'EN_ROUTE' && (
          <div className="absolute -ml-5 -mt-10 z-10" style={{ left: `${destinationCoords.x}%`, top: `${destinationCoords.y}%` }}>
             <i className="fa-solid fa-location-dot text-red-600 text-4xl drop-shadow-2xl"></i>
          </div>
        )}

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
           <path 
             d={`M ${motorCoords.x}% ${motorCoords.y}% L ${stage === 'PICKUP' ? userCoords.x : destinationCoords.x}% ${stage === 'PICKUP' ? userCoords.y : destinationCoords.y}%`} 
             stroke="#3b82f6" 
             strokeWidth="4" 
             strokeDasharray="8, 8" 
             strokeLinecap="round" 
             fill="transparent" 
             className="opacity-60 transition-all duration-1000"
           />
        </svg>

        <div className="absolute -ml-8 -mt-8 z-20 transition-all duration-1000 ease-linear" style={{ left: `${motorCoords.x}%`, top: `${motorCoords.y}%` }}>
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border-4 border-blue-600 shadow-2xl relative">
             <i className="fa-solid fa-motorcycle text-blue-600 text-2xl animate-bounce-slow"></i>
             <div className="absolute -top-12 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap border border-slate-700">
                {role === 'DRIVER' ? 'TU UBICACIÓN' : (stage === 'PICKUP' ? 'RECOGIÉNDOTE' : 'EN CAMINO')}
             </div>
          </div>
        </div>
      </div>

      {stage === 'WAITING_FOR_CLIENT' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
           <div className="bg-white rounded-[40px] p-8 w-full max-sm shadow-2xl animate-bounceIn text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <i className="fa-solid fa-handshake-angle text-blue-600 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{role === 'DRIVER' ? '¡Llegaste!' : '¡Tu piloto llegó!'}</h3>
              <p className="text-slate-400 font-medium mb-8">
                {role === 'DRIVER' ? 'Espera a que el cliente suba para iniciar el viaje.' : 'Juan está esperando en tu ubicación actual.'}
              </p>
              {role === 'DRIVER' && (
                <button 
                  onClick={handleStartTrip}
                  className="w-full py-5 moto-gradient text-white font-black rounded-3xl shadow-xl shadow-blue-200 active:scale-95 transition-all text-xl"
                >
                  Iniciar Viaje
                </button>
              )}
           </div>
        </div>
      )}

      {isChatOpen && (
        <div className="absolute inset-0 z-[60] bg-white flex flex-col animate-slideUp">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <button onClick={() => { setIsChatOpen(false); setHasNewMessages(false); }} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                   <i className="fa-solid fa-chevron-down"></i>
                </button>
                <div>
                   <h3 className="font-black text-slate-900 leading-none">{role === 'USER' ? 'Juan (Motorizado)' : 'Maria (Cliente)'}</h3>
                   <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">En línea</span>
                </div>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
             {messages.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
                  <i className="fa-solid fa-comments text-6xl mb-4"></i>
                  <p className="text-sm font-bold">Inicia una conversación para coordinar la recogida.</p>
               </div>
             )}
             {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.senderId === myId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${
                    msg.senderId === myId 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.content}
                    <p className={`text-[8px] mt-1 font-black uppercase opacity-50 ${msg.senderId === myId ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
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
                  className="w-12 h-12 moto-gradient text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
             </div>
          </div>
        </div>
      )}

      <div className="mt-auto relative z-30 bg-white rounded-t-[45px] shadow-[0_-20px_60px_rgba(0,0,0,0.3)] p-8">
        <div className="w-14 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
        
        {stage === 'ARRIVED' ? (
          <div className="py-4 text-center animate-fadeIn">
             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-check text-green-600 text-4xl"></i>
             </div>
             <h3 className="text-3xl font-black text-slate-900">¡Llegamos!</h3>
             <p className="text-slate-400 font-bold mt-2">Tarifa final: <span className="text-blue-600">S/ 4.50</span></p>
             <div className="grid grid-cols-1 gap-4 mt-8">
                <button 
                  onClick={() => onGoToPay ? onGoToPay() : null} 
                  className="py-5 moto-gradient text-white font-black rounded-2xl shadow-xl shadow-blue-100 text-lg"
                >
                  {role === 'DRIVER' ? 'Esperar que Usuario Pague' : 'Pagar Servicio'}
                </button>
             </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-8">
               <img src={`https://picsum.photos/id/${role === 'DRIVER' ? '12' : '64'}/150/150`} className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="Avatar" />
               <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-lg leading-none">{role === 'DRIVER' ? 'Maria G.' : 'Juan Pérez'}</h4>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
                    {role === 'DRIVER' ? 'CLIENTE' : 'HONDA CB125 • ABC-123'}
                  </p>
               </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
               <button className="flex flex-col items-center gap-1 py-4 bg-slate-50 rounded-2xl text-slate-500 hover:bg-slate-100 transition-colors">
                  <i className="fa-solid fa-phone text-blue-600 text-lg"></i>
                  <span className="text-[9px] font-black uppercase">Llamar</span>
               </button>
               <button 
                onClick={() => { setIsChatOpen(true); setHasNewMessages(false); }}
                className="flex flex-col items-center gap-1 py-4 bg-slate-50 rounded-2xl text-slate-500 relative hover:bg-slate-100 transition-colors"
               >
                  <i className="fa-solid fa-message text-blue-600 text-lg"></i>
                  <span className="text-[9px] font-black uppercase">Chat</span>
                  {hasNewMessages && (
                    <div className="absolute top-2 right-6 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
               </button>
               <button onClick={onCancel} className="flex flex-col items-center gap-1 py-4 bg-red-50 rounded-2xl text-red-500 hover:bg-red-100 transition-colors">
                  <i className="fa-solid fa-circle-xmark text-lg"></i>
                  <span className="text-[9px] font-black uppercase">Cancelar</span>
               </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0, 0, 0.2, 1); }
      `}</style>
    </div>
  );
};

export default TripActiveScreen;