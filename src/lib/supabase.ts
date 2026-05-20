import { createClient } from '@supabase/supabase-js';

const supabaseUrl = typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL
  ? process.env.VITE_SUPABASE_URL
  : (typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_SUPABASE_URL
    : '');

const supabaseAnonKey = typeof process !== 'undefined' && process.env.VITE_SUPABASE_ANON_KEY
  ? process.env.VITE_SUPABASE_ANON_KEY
  : (typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_SUPABASE_ANON_KEY
    : '');

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseUrl.includes('missing-url')) {
  console.error(
    'Supabase environment variables are missing or incorrect.\n' +
    'On Vercel, please add:\n' +
    '1. VITE_SUPABASE_URL\n' +
    '2. VITE_SUPABASE_ANON_KEY\n' +
    'to your "Environment Variables" in the project settings.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://missing-url-error.supabase.co',
  supabaseAnonKey || 'missing-key-error'
);
