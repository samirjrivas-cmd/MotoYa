import { createClient } from '@supabase/supabase-js';

/**
 * ARQUITECTURA DE CLIENTE SEGURO - MOTODEV
 * Esta implementación garantiza que la app no rompa si las variables de entorno faltan,
 * pero notifica claramente al desarrollador.
 */

// Extraemos las variables de entorno de forma segura para Vite
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Diagnóstico de salud de la conexión
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ ERROR DE CONFIGURACIÓN:\n" +
    "No se detectaron las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.\n" +
    "Asegúrate de configurar tu archivo .env o las variables de entorno en tu proveedor de hosting."
  );
} else {
  console.log("✅ Supabase Client: Configuración detectada correctamente.");
}

// Inicialización del cliente con fallbacks para evitar errores de tipo 'undefined' en el constructor
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
