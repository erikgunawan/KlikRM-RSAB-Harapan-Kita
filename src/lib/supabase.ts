import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://xyzcompanysupabase.supabase.co';
const supabaseKey = 'your-supabase-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);