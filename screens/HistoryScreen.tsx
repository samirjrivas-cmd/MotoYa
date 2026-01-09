
import React from 'react';

interface HistoryScreenProps {
  onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 animate-fadeIn overflow-hidden">
      <div className="p-6 bg-white shadow-sm flex items-center sticky top-0 z-20">
        <button onClick={onBack} className="text-gray-800 text-xl">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg">Historial de Viajes</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-10 space-y-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md shadow-blue-200">Todos</button>
          <button className="bg-white border border-gray-100 px-6 py-2 rounded-full text-sm font-bold text-gray-500">Esta Semana</button>
          <button className="bg-white border border-gray-100 px-6 py-2 rounded-full text-sm font-bold text-gray-500">Mes Pasado</button>
        </div>

        {/* Section: HOY */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase px-2">Hoy</h3>
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-3">
                <img src="https://picsum.photos/id/64/100/100" className="w-12 h-12 rounded-full object-cover" alt="Driver" />
                <div>
                  <h4 className="font-bold text-gray-900">Juan P.</h4>
                  <div className="flex items-center gap-1 text-[10px]">
                    <i className="fa-solid fa-star text-yellow-400"></i>
                    <span className="text-gray-900 font-bold">4.9</span>
                    <span className="text-gray-400 ml-1">• Moto Honda Roja</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-600 font-black text-lg">S/ 8.00</p>
                <span className="text-green-500 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold">Finalizado</span>
              </div>
            </div>

            <div className="relative pl-6 space-y-4">
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>
              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-gray-200 bg-white"></div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">10:30 AM</p>
                <p className="text-sm text-gray-600 font-medium">Av. Larco 123, Miraflores</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-blue-500 bg-blue-500"></div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">10:45 AM</p>
                <p className="text-sm text-gray-900 font-bold">Plaza de Armas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: AYER */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase px-2">Ayer</h3>
          
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-3">
                <img src="https://picsum.photos/id/91/100/100" className="w-12 h-12 rounded-full object-cover" alt="Driver" />
                <div>
                  <h4 className="font-bold text-gray-900">Carlos M.</h4>
                  <div className="flex items-center gap-1 text-[10px]">
                    <i className="fa-solid fa-star text-yellow-400"></i>
                    <span className="text-gray-900 font-bold">5.0</span>
                    <span className="text-gray-400 ml-1">• Bajaj Torito Azul</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-600 font-black text-lg">S/ 12.50</p>
                <span className="text-green-500 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold">Finalizado</span>
              </div>
            </div>

            <div className="relative pl-6 space-y-4">
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>
              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-gray-200 bg-white"></div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">08:15 PM</p>
                <p className="text-sm text-gray-600 font-medium">Calle Los Pinos 450</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-blue-500 bg-blue-500"></div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">08:40 PM</p>
                <p className="text-sm text-gray-900 font-bold">Mall Aventura Plaza</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
            <div className="flex justify-between items-start mb-6 opacity-60">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                  <i className="fa-solid fa-user-slash text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sin Conductor</h4>
                  <p className="text-gray-400 text-[10px] font-medium">Cancelado por usuario</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 line-through font-black text-lg">S/ 5.00</p>
                <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold">Cancelado</span>
              </div>
            </div>
            
            <div className="relative pl-6 space-y-4 opacity-60">
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>
              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-gray-200 bg-white"></div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">06:30 PM</p>
                <p className="text-sm text-gray-600 font-medium">Mercado Central</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-gray-300 bg-gray-300"></div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">--:--</p>
                <p className="text-sm text-gray-900 font-bold">Av. España 200</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: SEMANA PASADA */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase px-2">Semana Pasada</h3>
          
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-3">
                <img src="https://picsum.photos/id/65/100/100" className="w-12 h-12 rounded-full object-cover" alt="Driver" />
                <div>
                  <h4 className="font-bold text-gray-900">Maria S.</h4>
                  <div className="flex items-center gap-1 text-[10px]">
                    <i className="fa-solid fa-star text-yellow-400"></i>
                    <span className="text-gray-900 font-bold">4.8</span>
                    <span className="text-gray-400 ml-1">• Moto TVS King</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-600 font-black text-lg">S/ 6.50</p>
                <span className="text-green-500 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold">Finalizado</span>
              </div>
            </div>

            <div className="relative pl-6 space-y-4 mb-6">
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>
              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-gray-200 bg-white"></div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">15 Oct • 2:00 PM</p>
                <p className="text-sm text-gray-600 font-medium">Universidad Nacional</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-blue-500 bg-blue-500"></div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">15 Oct • 2:15 PM</p>
                <p className="text-sm text-gray-900 font-bold">Residencial San Felipe</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Tu Calificación:</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => <i key={star} className="fa-solid fa-star text-yellow-400 text-sm"></i>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryScreen;
