import { createClient } from '@supabase/supabase-js'

// En Vite se accede así a las variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Las variables de Supabase no están cargadas. Revisa tu .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)