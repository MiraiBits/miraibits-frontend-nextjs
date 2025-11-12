import { Buffer } from 'node:buffer';
import { createClient } from '@supabase/supabase-js';

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + padding, 'base64').toString('utf8');
}

function deriveSupabaseUrl(anonKey?: string | null, providedUrl?: string | null) {
  if (providedUrl && providedUrl.trim().length > 0) {
    return providedUrl.trim();
  }
  if (!anonKey) return null;
  const segments = anonKey.split('.');
  if (segments.length < 2) return null;
  try {
    const payloadJson = base64UrlDecode(segments[1]);
    const payload = JSON.parse(payloadJson) as { ref?: string };
    if (payload?.ref) {
      return `https://${payload.ref}.supabase.co`;
    }
  } catch (error) {
    console.warn('[supabase] Failed to derive Supabase URL from anon key payload.', error);
  }
  return null;
}

const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseUrl = deriveSupabaseUrl(
  supabaseAnonKey,
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
);

if (!supabaseUrl) {
  throw new Error(
    'Missing SUPABASE_URL environment variable and could not derive project URL from SUPABASE_ANON_KEY.'
  );
}

if (!supabaseAnonKey) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable.');
}

export const supabaseServerClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});
