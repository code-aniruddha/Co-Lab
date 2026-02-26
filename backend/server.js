// ============================================================
//  Co-Lab Backend  |  server.js  (Express + Supabase)
// ============================================================
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Supabase Client ─────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ─── Middleware ───────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── GET /api/projects ────────────────────────────────────
// Query params: domain, skill
app.get('/api/projects', async (req, res) => {
  try {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (req.query.domain && req.query.domain !== 'All') {
      query = query.eq('domain', req.query.domain);
    }
    if (req.query.skill) {
      query = query.contains('skills_list', [req.query.skill]);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error('GET /api/projects error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/projects/:id ───────────────────────────────
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*, applications(*)')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// ─── POST /api/projects ──────────────────────────────────
app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, domain, skills_list, owner_id, owner_name } = req.body;
    if (!title || !domain || !owner_id) {
      return res.status(400).json({ success: false, error: 'title, domain and owner_id are required' });
    }
    const { data, error } = await supabase
      .from('projects')
      .insert([{ title, description, domain, skills_list: skills_list || [], owner_id, owner_name: owner_name || 'Anonymous' }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('POST /api/projects error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PATCH /api/projects/:id/status ─────────────────────
app.patch('/api/projects/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from('projects')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/applications ──────────────────────────────
app.post('/api/applications', async (req, res) => {
  try {
    const { project_id, applicant_name, applicant_skills, message } = req.body;
    if (!project_id || !applicant_name) {
      return res.status(400).json({ success: false, error: 'project_id and applicant_name are required' });
    }

    // Insert application
    const { data, error } = await supabase
      .from('applications')
      .insert([{ project_id, applicant_name, applicant_skills: applicant_skills || [], message }])
      .select()
      .single();
    if (error) throw error;

    // Increment interest counter via RPC (or direct update)
    await supabase.rpc('increment_interest', { pid: project_id });

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('POST /api/applications error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/applications/:projectId ───────────────────
app.get('/api/applications/:projectId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('project_id', req.params.projectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Start ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🚀 Co-Lab API server running on http://localhost:${PORT}\n`);
});
