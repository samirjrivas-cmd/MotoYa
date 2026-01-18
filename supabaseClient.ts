
import { createClient } from '@supabase/supabase-js';

/**
 * World-class senior frontend engineer note:
 * Accessing environment variables can vary between Vite (import.meta.env) 
 * and other bundlers (process.env). 
 * We use a defensive approach to avoid "Cannot read properties of undefined" errors.
 */

const getEnv = (key: string): string => {
  // Check for import.meta.env (Vite standard)
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[key] || '';
  }
  // Check for process.env (Webpack/CRA standard)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase configuration missing: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is undefined. " +
    "Authentication features will not work until environment variables are configured."
  );
}

// We provide empty strings as fallback to prevent the library from throwing an initialization error,
// but keeping the warnings clear for the developer.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
