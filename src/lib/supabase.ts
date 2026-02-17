import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signUp = async (email: string, password: string, fullName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Sign-up error:', error.message);
    return { error };
  }

  return { data };
};

console.log("SUPABASE URL =", import.meta.env.VITE_SUPABASE_URL)
console.log("SUPABASE KEY =", import.meta.env.VITE_SUPABASE_ANON_KEY)

