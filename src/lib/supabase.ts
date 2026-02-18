import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signUp = async (
  email: string,
  password: string,
  fullName?: string
) => {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { fullName },
    },
  })
}


