
export enum AppScreen {
  ROLE_SELECTOR = 'ROLE_SELECTOR',
  LOGIN = 'LOGIN',
  HOME = 'HOME', // Home de Usuario
  DRIVER_DASHBOARD = 'DRIVER_DASHBOARD', // Home de Motorizado
  PAYMENTS = 'PAYMENTS',
  HISTORY = 'HISTORY',
  TRIP_ACTIVE = 'TRIP_ACTIVE',
  MEGASOFT_PAYMENT = 'MEGASOFT_PAYMENT',
  RATING = 'RATING'
}

export type UserRole = 'USER' | 'DRIVER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
}

export interface Driver extends User {
  vehicleModel: string;
  plate: string;
  rating: number;
  isVerified: boolean;
  isOnline: boolean;
  paymentInfo: {
    bankCode: string;
    phoneNumber: string;
  };
  currentLocation?: { lat: number; lng: number };
}

export interface RideRequest {
  id: string;
  userId: string;
  origin: { x: number; y: number; address: string };
  destination: { x: number; y: number; address: string };
  price: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'canceled';
  driverId?: string;
}
