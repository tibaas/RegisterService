import { createClient } from '@supabase/supabase-js';
// import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
//was like a <Database> thing before, removed it and testing 
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
