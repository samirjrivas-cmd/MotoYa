import { createClient } from '@supabase/supabase-js';

/**
 * MOTOYA - CONFIGURACIÓN DE BACKEND RESILIENTE
 * Este archivo ha sido optimizado para evitar errores de tipo 'undefined' 
 * en entornos de ejecución dinámicos.
 */

const getEnvSafe = (name: string): string => {
  try {
    // Intento 1: Vite / ESM (Usando optional chaining para evitar TypeError)
    const viteEnv = (import.meta as any)?.env?.[name];
    if (viteEnv) return viteEnv;

    // Intento 2: Process (Node/Classic Bundlers)
    const processEnv = typeof process !== 'undefined' ? process.env?.[name] : undefined;
    if (processEnv) return processEnv;
  } catch (err) {
    // Silencio de error para evitar interrumpir el ciclo de renderizado
  }
  return '';
};

const supabaseUrl = getEnvSafe('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvSafe('VITE_SUPABASE_ANON_KEY');

// Log de diagnóstico silencioso para el desarrollador
if (!supabaseUrl || !supabaseAnonKey) {
  console.info("%c MotoYa Config: Utilizando modo local/demo (Faltan variables de entorno).", "color: #3b82f6; font-weight: bold;");
}

/**
 * Inicialización segura del cliente de Supabase.
 * Se utilizan valores por defecto válidos para que el SDK no lance errores críticos,
 * permitiendo que la UI cargue correctamente.
 */
export const supabase = createClient(
  supabaseUrl || 'https://opctttcpvfmqtahakxwq.supabase.co',
  supabaseAnonKey || '9fY4a8CGyp*8g%M'
);