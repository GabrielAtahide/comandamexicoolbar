import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://ympcaarivijpniffzhax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcGNhYXJpdmlqcG5pZmZ6aGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1OTYyODQsImV4cCI6MjA1NjE3MjI4NH0.TUQSMAQvx2888cEMNfaVX3eBTiELc64vHbbE69sYw7M'; // Use sua chave anonpublic

export const supabase = createClient(supabaseUrl, supabaseKey);
