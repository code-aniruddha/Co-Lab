// ============================================================
//  src/lib/supabaseClient.js
//  Central Supabase configuration — import from here everywhere
// ============================================================
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.warn(
    '[Co-Lab] Supabase env vars missing — using mock mode.\n' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(
  SUPABASE_URL  || 'https://placeholder.supabase.co',
  SUPABASE_ANON || 'placeholder-key',
  {
    realtime: { params: { eventsPerSecond: 10 } },
  }
);

// ─── Typed helpers ──────────────────────────────────────
export const projectsTable    = () => supabase.from('projects');
export const applicationsTable = () => supabase.from('applications');
