import { createClient } from '@supabase/supabase-js';

// Define types for Vite env variables manually since vite/client types are missing in this environment
declare global {
  interface ImportMeta {
    env: {
      [key: string]: string | undefined;
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
    };
  }
}

// Helper to safely get env vars without crashing if import.meta.env is undefined
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    return (import.meta.env && import.meta.env[key]) || undefined;
  } catch (e) {
    return undefined;
  }
};

// Usamos as variáveis de ambiente se existirem, ou as chaves fornecidas como fallback
const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://jzwblycsmptwaysiedli.supabase.co';
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6d2JseWNzbXB0d2F5c2llZGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxOTgyNDIsImV4cCI6MjA4NDc3NDI0Mn0.sF64l0qp5uFLpECu570Xq_47IL2PaSIqnIW25JZ8AUQ';

// Validação de segurança básica para evitar inicialização com valores corrompidos
const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey) {
  console.warn('⚠️ Configuração Supabase inválida. O analytics não funcionará.');
}

// Configuração de Segurança para evitar problemas com RLS (Row Level Security)
// Em funis de venda públicos, desativamos a persistência de sessão e detecção de URL
// para garantir que o acesso seja sempre tratado como 'anon' (público) e não 
// conflite com parâmetros de URL (UTMs) ou sessões antigas no navegador.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Não salvar sessão no LocalStorage (evita conflitos de RLS)
    autoRefreshToken: false, // Não tentar renovar tokens
    detectSessionInUrl: false // Não interceptar hash/query params da URL (segurança para UTMs)
  }
});