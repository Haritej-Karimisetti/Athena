import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these with your actual Supabase project URL and Anon Key.
// It is recommended to store these in environment variables for production.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase credentials are not set. Please update .env with your project details to enable check-in functionality.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
