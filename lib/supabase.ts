import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for client-side operations
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin client for server-side operations (with service role key)
// Fallback to anon key if service role key is not provided
const adminKey = supabaseServiceKey || supabaseAnonKey;
export const supabaseAdmin = supabaseUrl && adminKey
  ? createClient(supabaseUrl, adminKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Get bucket name from environment
export const BUCKET_NAME = process.env.BUCKET_NAME || process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || 'images';
export const BUCKET_ENDPOINT = process.env.BUCKET_END_POINT || process.env.NEXT_PUBLIC_SUPABASE_BUCKET_ENDPOINT || '';

