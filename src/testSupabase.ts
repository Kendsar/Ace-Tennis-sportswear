import { supabase } from "./lib/supabase"

export async function testConnection() {
  const { data, error } = await supabase
    .from("products")
    .select("*")

  console.log("SUPABASE DATA:", data)
  console.log("SUPABASE ERROR:", error)
}
