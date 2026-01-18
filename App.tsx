
import React, { useState } from 'react';
import { AppScreen, UserRole } from './types';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PaymentScreen from './screens/PaymentScreen';
import HistoryScreen from './screens/HistoryScreen';
import TripActiveScreen from './screens/TripActiveScreen';
import MegasoftPaymentScreen from './screens/MegasoftPaymentScreen';
import RatingScreen from './screens/RatingScreen';
import DriverDashboard from './screens/DriverDashboard';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.ROLE_SELECTOR);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const navigateTo = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const selectRole = (role: UserRole) => {
    setUserRole(role);
    navigateTo(AppScreen.LOGIN);
  };

  const handleLoginSuccess = (role: UserRole) => {
    setUserRole(role);
    navigateTo(role === 'DRIVER' ? AppScreen.DRIVER_DASHBOARD : AppScreen.HOME);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative overflow-hidden shadow-2xl">
      {currentScreen === AppScreen.ROLE_SELECTOR && (
        <div className="h-screen flex flex-col p-8 justify-center animate-fadeIn">
          <div className="text-center mb-12">
            <div className="w-24 h-24 moto-gradient rounded-[32px] flex items-center justify-center shadow-2xl mx-auto mb-6">
              <i className="fa-solid fa-motorcycle text-white text-5xl"></i>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">MotoYa</h1>
            <p className="text-slate-400 font-medium mt-2">¿Cómo deseas ingresar hoy?</p>
          </div>
          <div className="space-y-4">
            <button 
              onClick={() => selectRole('USER')}
              className="w-full p-6 bg-white border-2 border-slate-100 rounded-[32px] flex items-center gap-5 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <i className="fa-solid fa-user text-2xl"></i>
              </div>
              <div className="text-left">
                <p className="font-black text-slate-900 text-lg">Soy Usuario</p>
                <p className="text-slate-400 text-xs font-medium">Quiero solicitar un viaje rápido</p>
              </div>
            </button>
            <button 
              onClick={() => selectRole('DRIVER')}
              className="w-full p-6 bg-white border-2 border-slate-100 rounded-[32px] flex items-center gap-5 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <i className="fa-solid fa-helmet-safety text-2xl"></i>
              </div>
              <div className="text-left">
                <p className="font-black text-slate-900 text-lg">Soy Motorizado</p>
                <p className="text-slate-400 text-xs font-medium">Quiero generar ingresos</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {currentScreen === AppScreen.LOGIN && (
        <LoginScreen onLogin={handleLoginSuccess} />
      )}

      {currentScreen === AppScreen.DRIVER_DASHBOARD && (
        <DriverDashboard 
          onLogout={() => navigateTo(AppScreen.ROLE_SELECTOR)} 
          onAcceptRide={() => navigateTo(AppScreen.TRIP_ACTIVE)}
        />
      )}

      {currentScreen === AppScreen.HOME && (
        <HomeScreen 
          onGoToPayments={() => navigateTo(AppScreen.PAYMENTS)} 
          onGoToHistory={() => navigateTo(AppScreen.HISTORY)}
          onRequestTrip={() => navigateTo(AppScreen.TRIP_ACTIVE)}
        />
      )}

      {currentScreen === AppScreen.PAYMENTS && (
        <PaymentScreen onBack={() => navigateTo(AppScreen.HOME)} onGoToHistory={() => navigateTo(AppScreen.HISTORY)} />
      )}

      {currentScreen === AppScreen.HISTORY && (
        <HistoryScreen onBack={() => navigateTo(userRole === 'DRIVER' ? AppScreen.DRIVER_DASHBOARD : AppScreen.HOME)} />
      )}

      {currentScreen === AppScreen.TRIP_ACTIVE && (
        <TripActiveScreen 
          role={userRole || 'USER'}
          onCancel={() => navigateTo(userRole === 'DRIVER' ? AppScreen.DRIVER_DASHBOARD : AppScreen.HOME)} 
          onGoToPay={() => navigateTo(AppScreen.MEGASOFT_PAYMENT)}
        />
      )}

      {currentScreen === AppScreen.MEGASOFT_PAYMENT && (
        <MegasoftPaymentScreen 
          onSuccess={() => navigateTo(AppScreen.RATING)} 
          onCancel={() => navigateTo(AppScreen.TRIP_ACTIVE)} 
        />
      )}

      {currentScreen === AppScreen.RATING && (
        <RatingScreen onFinish={() => navigateTo(AppScreen.HOME)} />
      )}
    </div>
  );
};

export default App;
