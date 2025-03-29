import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifbomlakeeqnnkutueph.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYm9tbGFrZWVxbm5rdXR1ZXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NTM2NDIsImV4cCI6MjA1NDEyOTY0Mn0.QFePLKMeeNXemR7udsJ5YBAUWwNngVIf44QNHfOvubw';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;