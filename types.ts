
export enum AppScreen {
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  PAYMENTS = 'PAYMENTS',
  HISTORY = 'HISTORY',
  TRIP_ACTIVE = 'TRIP_ACTIVE'
}

export interface Trip {
  id: string;
  driverName: string;
  driverRating: number;
  vehicle: string;
  price: string;
  status: 'Finalizado' | 'Cancelado';
  origin: string;
  destination: string;
  time: string;
  date: string;
  driverImg: string;
}

export interface PaymentMethod {
  id: string;
  type: 'Pago Móvil' | 'Tarjeta' | 'Zelle' | 'Otros';
  detail: string;
  isDefault?: boolean;
  bank?: string;
  icon: string;
}
