import { createClient } from '@supabase/supabase-js'

// Ponemos los valores directamente para que AI Studio no dependa del .env
const supabaseUrl = "https://opctttcpvfmqtahakxwq.supabase.co"
const supabaseAnonKey = "9fY4a8CGyp*8g%M" 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)