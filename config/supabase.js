import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.SUPABASE_URL);
console.log(process.env.SUPABASE_KEY?.substring(0, 20));

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);