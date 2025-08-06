import { createClient } from "@supabase/supabase-js";

// TEMPORARY fallback for Vercel free plan deployment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iwshxkqeqidrlkvraekj.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3c2h4a3FlcWlkcmxrdnJhZWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzQzNTMsImV4cCI6MjA3MDAxMDM1M30.4GwNDe1iAbWhTOhkEjGpBz4vGHbz0yP6sWOYMa6bsOs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
