
import React, { useState } from 'react';

interface RatingScreenProps {
  onFinish: () => void;
  driverId?: string;
  rideId?: string;
}

const RatingScreen: React.FC<RatingScreenProps> = ({ onFinish, driverId = "D-123", rideId = "R-992" }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    
    // Simulación de Evento: ride.rating.completed
    console.log("Emitiendo evento: ride.rating.completed", {
      driverId,
      rideId,
      ratingValue: rating,
      comment
    });

    // Acciones lógicas del sistema:
    // 1. Guardar calificación en el perfil del motorizado
    // 2. set Ride[rideId].status = "completed"
    // 3. set Driver[driverId].status = "available"
    // 4. trigger MatchingService.updateAvailability(driverId)

    setTimeout(() => {
      setIsSubmitting(false);
      setShowThankYou(true);
      
      // Notificar al motorizado el re-direccionamiento (simulado)
      console.log("Emitiendo a motorizado: ui.redirect", {
        screen: "home",
        message: "Esperando nueva solicitud de viaje"
      });

      setTimeout(() => {
        onFinish();
      }, 2000);
    }, 1500);
  };

  if (showThankYou) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 bg-white animate-fadeIn text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <i className="fa-solid fa-heart text-4xl text-blue-600"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">¡Gracias por tu apoyo!</h2>
        <p className="text-slate-400 font-medium">Tu opinión nos ayuda a que MotoYa sea cada vez mejor para ti.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white p-8 animate-fadeIn">
      <div className="flex-1 flex flex-col">
        <div className="text-center mt-10 mb-12">
          <h1 className="text-3xl font-black text-slate-900">Califica tu experiencia</h1>
          <p className="text-slate-400 mt-2 font-medium">¿Qué tal estuvo tu viaje con Juan?</p>
        </div>

        <div className="flex flex-col items-center mb-12">
          <img 
            src="https://picsum.photos/id/64/200/200" 
            className="w-24 h-24 rounded-3xl object-cover shadow-2xl border-4 border-white mb-6" 
            alt="Driver" 
          />
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90 focus:outline-none"
              >
                <i className={`fa-solid fa-star text-4xl ${star <= rating ? 'text-yellow-400' : 'text-slate-100'}`}></i>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm font-black text-blue-600 mt-4 uppercase tracking-widest animate-fadeIn">
              {rating === 5 ? '¡Excelente!' : rating >= 3 ? '¡Muy bueno!' : 'Podemos mejorar'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Comentario (opcional)</label>
          <textarea
            placeholder="Escribe aquí tu experiencia..."
            className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium resize-none transition-all"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={rating === 0 || isSubmitting}
        className={`w-full py-5 rounded-3xl font-black text-xl transition-all flex items-center justify-center gap-3 ${
          rating > 0 
            ? 'moto-gradient text-white shadow-xl shadow-blue-100 active:scale-95' 
            : 'bg-slate-100 text-slate-300'
        }`}
      >
        {isSubmitting ? (
          <i className="fa-solid fa-circle-notch animate-spin"></i>
        ) : (
          'Enviar calificación'
        )}
      </button>
    </div>
  );
};

export default RatingScreen;
