import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verify that the environment variables are set and not placeholder values
const isConfigured = 
  supabaseUrl && 
  supabaseUrl !== 'https://your-project-url.supabase.co' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'your-supabase-public-anon-key-here';

if (isConfigured) {
  console.log('%c⚡ Aura Wear: Connected to Supabase DB!', 'color: #248a52; font-weight: bold;', supabaseUrl);
} else {
  console.warn('⚠️ Aura Wear: Supabase API credentials are unset or still set to placeholders. Running in offline/localStorage mock fallback mode.');
}

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
