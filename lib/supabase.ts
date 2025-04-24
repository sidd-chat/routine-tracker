import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// createBrowserClient or createServerClient options study and apply if applicable
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;