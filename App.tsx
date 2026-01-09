
import React, { useState } from 'react';
import { AppScreen } from './types';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PaymentScreen from './screens/PaymentScreen';
import HistoryScreen from './screens/HistoryScreen';
import TripActiveScreen from './screens/TripActiveScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);

  const navigateTo = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative overflow-hidden shadow-2xl">
      {currentScreen === AppScreen.LOGIN && (
        <LoginScreen onLogin={() => navigateTo(AppScreen.HOME)} />
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
        <HistoryScreen onBack={() => navigateTo(AppScreen.HOME)} />
      )}
      {currentScreen === AppScreen.TRIP_ACTIVE && (
        <TripActiveScreen onCancel={() => navigateTo(AppScreen.HOME)} />
      )}
    </div>
  );
};

export default App;
