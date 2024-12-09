import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbrvkbiqjlifyfxmaqqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndicnZrYmlxamxpZnlmeG1hcXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NjQxNzcsImV4cCI6MjA0OTM0MDE3N30.tx9YLRYmTkQ6Oiq91dR9RudAMBAFJvwvSpP8u-NsdBY';


export const supabase = createClient(supabaseUrl, supabaseKey);
