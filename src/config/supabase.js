import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Environment variables check:');
  console.error('SUPABASE_URL:', supabaseUrl);
  console.error('SUPABASE_ANON_KEY:', supabaseKey ? 'Present' : 'Missing');
  throw new Error('Supabase URL and Key must be provided in environment variables');
}

// Extract the correct Supabase URL if PostgreSQL connection string is provided
let apiUrl = supabaseUrl;
if (supabaseUrl.startsWith('postgresql://')) {
  // Extract project ref from PostgreSQL URL: db.{ref}.supabase.co
  const match = supabaseUrl.match(/db\.([^.]+)\.supabase\.co/);
  if (match) {
    apiUrl = `https://${match[1]}.supabase.co`;
    console.log('Converted PostgreSQL URL to API URL:', apiUrl);
  }
}

export const supabase = createClient(apiUrl, supabaseKey);
