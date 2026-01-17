
import React, { useState, useEffect } from 'react';

interface MegasoftPaymentScreenProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const MegasoftPaymentScreen: React.FC<MegasoftPaymentScreenProps> = ({ onSuccess, onCancel }) => {
  const [status, setStatus] = useState<'IDLE' | 'AUTH' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [reference, setReference] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Datos simulados del pago
  const paymentData = {
    telefono: "04141234567",
    banco: "0102",
    monto: 4.50
  };

  const processPayment = async () => {
    try {
      // 1. Fase de Autenticación (Simulando obtención de JWT)
      setStatus('AUTH');
      await new Promise(r => setTimeout(r, 1500));
      const fakeJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake_token";

      // 2. Fase de Envío al API Megasoft
      setStatus('SENDING');
      
      // En un entorno real, este fetch llamaría al endpoint de Megasoft
      // const response = await fetch('https://api.megasoft.com.ve/pago-movil', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${fakeJwt}`
      //   },
      //   body: JSON.stringify(paymentData)
      // });
      // const result = await response.json();

      // Simulación de respuesta exitosa de Megasoft
      await new Promise(r => setTimeout(r, 2000));
      const mockResult = { status: 'success', referencia: 'MS-' + Math.floor(Math.random() * 900000 + 100000) };

      if (mockResult.status === 'success') {
        setReference(mockResult.referencia);
        setStatus('SUCCESS');
      } else {
        throw new Error("Transacción rechazada por el banco.");
      }

    } catch (error: any) {
      setErrorMessage(error.message || "Error de conexión con Megasoft");
      setStatus('ERROR');
    }
  };

  useEffect(() => {
    processPayment();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white p-8 animate-fadeIn">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {status === 'AUTH' || status === 'SENDING' ? (
          <div className="space-y-8 animate-pulse">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
              <i className="fa-solid fa-shield-halved text-4xl text-blue-600"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {status === 'AUTH' ? 'Autenticando...' : 'Procesando Pago'}
              </h2>
              <p className="text-slate-400 font-medium mt-2">
                {status === 'AUTH' ? 'Conectando con Megasoft Secure Hub' : 'Validando transacción con tu banco'}
              </p>
            </div>
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ) : status === 'SUCCESS' ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100">
              <i className="fa-solid fa-check text-4xl text-white"></i>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900">Pago Exitoso</h2>
              <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">Megasoft Gateway</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold">Referencia:</span>
                <span className="text-slate-900 font-black">{reference}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold">Monto:</span>
                <span className="text-blue-600 font-black">S/ {paymentData.monto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold">Método:</span>
                <span className="text-slate-900 font-black">Pago Móvil</span>
              </div>
            </div>
            <button 
              onClick={onSuccess}
              className="w-full py-5 moto-gradient text-white font-black rounded-3xl shadow-xl shadow-blue-100 mt-4"
            >
              Volver al inicio
            </button>
          </div>
        ) : status === 'ERROR' ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <i className="fa-solid fa-circle-exclamation text-4xl text-red-600"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Error en el Pago</h2>
              <p className="text-red-500 font-medium mt-2">{errorMessage}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button onClick={onCancel} className="py-4 bg-slate-100 text-slate-500 font-black rounded-2xl">Cancelar</button>
              <button onClick={processPayment} className="py-4 bg-slate-900 text-white font-black rounded-2xl">Reintentar</button>
            </div>
          </div>
        ) : null}
      </div>
      
      <div className="py-6 flex flex-col items-center gap-2 border-t border-slate-50">
        <div className="flex items-center gap-2 opacity-40">
           <img src="https://www.megasoft.com.ve/wp-content/uploads/2021/05/Logo-Megasoft-2021.png" className="h-4 grayscale" alt="Megasoft Logo" />
           <span className="text-[10px] font-black uppercase tracking-tighter">Powered by Megasoft</span>
        </div>
      </div>
    </div>
  );
};

export default MegasoftPaymentScreen;
