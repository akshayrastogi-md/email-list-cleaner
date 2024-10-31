import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://klqegframowlsdkprznw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtscWVnZnJhbW93bHNka3Byem53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMTM3MjEsImV4cCI6MjA0NTg4OTcyMX0.T3ASwPenNmIdGKbAIkNpoynhE3Xn4c6AePQcTLRCV2E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize the lists table
export const initializeDatabase = async () => {
  const { error } = await supabase.from('email_lists').select('id').limit(1);
  
  if (error?.code === '42P01') {
    await supabase.rpc('init_email_lists');
  }
};

// Save email list
export interface EmailList {
  id?: number;
  name: string;
  total_emails: number;
  valid_emails: number;
  invalid_emails: number;
  created_at?: string;
  user_id: string;
  results: any[];
}

export const saveEmailList = async (list: EmailList) => {
  const { data, error } = await supabase
    .from('email_lists')
    .insert([list])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getEmailLists = async (userId: string) => {
  const { data, error } = await supabase
    .from('email_lists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getEmailList = async (id: number) => {
  const { data, error } = await supabase
    .from('email_lists')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};