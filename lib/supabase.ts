import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to hardcoded values if needed
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vmampcokfrfqgmlhfwez.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtYW1wY29rZnJmcWdtbGhmd2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NTA4NjMsImV4cCI6MjA1NjQyNjg2M30.8cLq5eFqFCCLXIvnRR590EYxTMPRnnaxKNufUTwouTY';

// Make sure we have a URL before creating the client
if (!supabaseUrl) {
  throw new Error('Supabase URL is required. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 