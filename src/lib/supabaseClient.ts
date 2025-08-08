import { createClient } from "@supabase/supabase-js";

// Fully hardcoded — safe for free plan and anon usage
const SUPABASE_URL = "https://iwshxkqeqidrlkvraekj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3c2h4a3FlcWlkcmxrdnJhZWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzQzNTMsImV4cCI6MjA3MDAxMDM1M30.4GwNDe1iAbWhTOhkEjGpBz4vGHbz0yP6sWOYMa6bsOs"; // full key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
