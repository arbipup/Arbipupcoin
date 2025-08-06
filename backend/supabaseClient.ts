import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const SUPABASE_URL = 'https://iwshxkqeqidrlkvraekj.supabase.co'
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
