import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';


const supabaseUrl = 'https://fdcujcfodivdypvnbvix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkY3VqY2ZvZGl2ZHlwdm5idml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NjAwMzgsImV4cCI6MjA0OTMzNjAzOH0.rRTEKHGafn-zBP8khow2j7f3O0Zhejc3mylHKraqkGM';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
