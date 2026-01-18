import { createClient } from '@supabase/supabase-js'

// En lugar de usar import.meta.env, pega tus llaves aquí directamente entre comillas
const supabaseUrl = "https://opctttcpvfmqtahakxwq.supabase.co"
const supabaseAnonKey = "9fY4a8CGyp*8g%M" 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)