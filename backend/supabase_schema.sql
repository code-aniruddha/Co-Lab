-- =========================================================
--  Co-Lab  |  Supabase SQL Schema + Seed Data
--  Run this in the Supabase Dashboard → SQL Editor
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Projects Table ──────────────────────────────────────
create table if not exists projects (
  id             uuid primary key default uuid_generate_v4(),
  created_at     timestamptz default now(),
  title          text not null,
  description    text,
  domain         text check (domain in ('Startup','Hackathon','Research')) not null,
  skills_list    text[] default '{}',
  owner_id       text not null,
  owner_name     text not null default 'Anonymous',
  status         text check (status in ('open','filled')) default 'open',
  interest_count integer default 0
);

-- ─── Applications Table ──────────────────────────────────
create table if not exists applications (
  id               uuid primary key default uuid_generate_v4(),
  created_at       timestamptz default now(),
  project_id       uuid references projects(id) on delete cascade,
  applicant_name   text not null,
  applicant_skills text[] default '{}',
  message          text,
  status           text check (status in ('pending','accepted','rejected')) default 'pending'
);

-- ─── Hackathon Teams Table ───────────────────────────────
create table if not exists hackathon_teams (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz default now(),
  name          text not null,
  hackathon     text not null,
  project_title text not null,
  status        text check (status in ('forming','active','closed')) default 'forming',
  slots_total   integer default 4,
  slots_filled  integer default 0,
  looking_for   text[] default '{}',
  tech_stack    text[] default '{}',
  owner_id      text not null
);

-- ─── Team Members Table ──────────────────────────────────
create table if not exists team_members (
  id         uuid primary key default uuid_generate_v4(),
  team_id    uuid references hackathon_teams(id) on delete cascade,
  user_name  text not null,
  user_email text,
  role       text not null,
  avatar     text
);

-- ─── Realtime (safe: skip if already added) ──────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'projects'
  ) then
    alter publication supabase_realtime add table projects;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'applications'
  ) then
    alter publication supabase_realtime add table applications;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'hackathon_teams'
  ) then
    alter publication supabase_realtime add table hackathon_teams;
  end if;
end $$;

-- ─── Row Level Security (open for demo) ──────────────────
alter table projects        enable row level security;
alter table applications    enable row level security;
alter table hackathon_teams enable row level security;
alter table team_members    enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename='projects'     and policyname='Public read projects')    then create policy "Public read projects"    on projects    for select using (true); end if;
  if not exists (select 1 from pg_policies where tablename='projects'     and policyname='Public insert projects')  then create policy "Public insert projects"  on projects    for insert with check (true); end if;
  if not exists (select 1 from pg_policies where tablename='projects'     and policyname='Public update projects')  then create policy "Public update projects"  on projects    for update using (true); end if;

  if not exists (select 1 from pg_policies where tablename='applications' and policyname='Public read applications')   then create policy "Public read applications"   on applications for select using (true); end if;
  if not exists (select 1 from pg_policies where tablename='applications' and policyname='Public insert applications') then create policy "Public insert applications" on applications for insert with check (true); end if;

  if not exists (select 1 from pg_policies where tablename='hackathon_teams' and policyname='Public read teams')   then create policy "Public read teams"   on hackathon_teams for select using (true); end if;
  if not exists (select 1 from pg_policies where tablename='hackathon_teams' and policyname='Public insert teams') then create policy "Public insert teams"  on hackathon_teams for insert with check (true); end if;
  if not exists (select 1 from pg_policies where tablename='hackathon_teams' and policyname='Public update teams') then create policy "Public update teams"  on hackathon_teams for update using (true); end if;

  if not exists (select 1 from pg_policies where tablename='team_members' and policyname='Public read members')   then create policy "Public read members"   on team_members for select using (true); end if;
  if not exists (select 1 from pg_policies where tablename='team_members' and policyname='Public insert members') then create policy "Public insert members" on team_members for insert with check (true); end if;
end $$;

-- =========================================================
--  SEED DATA
-- =========================================================

-- ─── Sample Projects ─────────────────────────────────────
insert into projects (title, description, domain, skills_list, owner_id, owner_name, status, interest_count) values
  (
    'AI-Powered Study Buddy',
    'Build an LLM-based tool that generates personalised study plans from syllabus PDFs. We need a full-stack team with AI/ML and frontend expertise.',
    'Startup', ARRAY['Python','LangChain','React','OpenAI'],
    'user_001', 'Aryan Mehta', 'open', 7
  ),
  (
    'Smart Campus Navigator',
    'AR overlay on mobile that guides students across the campus in real-time using indoor positioning and computer vision.',
    'Hackathon', ARRAY['React Native','ARKit','Node.js','Maps API'],
    'user_002', 'Priya Sharma', 'open', 12
  ),
  (
    'Blockchain Credential Vault',
    'Decentralised system for verifying and sharing academic credentials via NFT-backed certificates stored on IPFS.',
    'Research', ARRAY['Solidity','Ethereum','IPFS','React'],
    'user_003', 'Rohan Verma', 'open', 4
  ),
  (
    'Agri-Tech Yield Predictor',
    'ML model that predicts crop yield based on soil and weather data for local farmers in rural Maharashtra.',
    'Research', ARRAY['Python','TensorFlow','FastAPI','GIS'],
    'user_004', 'Sneha Patil', 'open', 9
  ),
  (
    'EcoTrack — Campus Carbon Monitor',
    'Interactive dashboard that monitors and gamifies the carbon footprint of college departments. Uses IoT sensor data.',
    'Startup', ARRAY['React','D3.js','Node.js','PostgreSQL'],
    'user_005', 'Kabir Das', 'open', 6
  ),
  (
    'HackBoard — Live Hackathon Platform',
    'Real-time platform for managing teams, submissions and judging during inter-college hackathons with live leaderboard.',
    'Hackathon', ARRAY['React','Socket.io','Express','Redis'],
    'user_006', 'Anika Singh', 'filled', 15
  ),
  (
    'MediScan — Diagnostic AI Assistant',
    'Deep learning model that analyses chest X-rays and MRI scans to flag potential anomalies, helping doctors in resource-limited clinics.',
    'Research', ARRAY['Python','PyTorch','OpenCV','Flask'],
    'user_007', 'Dev Kapoor', 'open', 11
  ),
  (
    'SkillSwap — Peer-to-Peer Learning',
    'Marketplace where students trade skills — you teach Python, someone else teaches Figma. Smart matching via embedding similarity.',
    'Startup', ARRAY['React','Node.js','PostgreSQL','OpenAI'],
    'user_008', 'Tanya Rao', 'open', 19
  ),
  (
    'InfraWatch — Smart City Dashboard',
    '24-hour hackathon project: real-time dashboard ingesting municipal IoT sensor feeds (traffic, water, power) with anomaly alerts.',
    'Hackathon', ARRAY['React','MQTT','InfluxDB','Grafana'],
    'user_009', 'Ravi Nair', 'open', 8
  ),
  (
    'CodeCollab — Real-time Pair Programming',
    'Browser-based VS Code-like editor with real-time multi-cursor collaboration, video chat, and AI code review suggestions.',
    'Startup', ARRAY['React','WebSockets','Monaco Editor','Node.js'],
    'user_010', 'Ishaan Bose', 'open', 22
  ),
  (
    'SolarSim — Renewable Energy Modeller',
    'Research tool that simulates optimal solar panel placement for Indian campuses using GIS data and weather APIs.',
    'Research', ARRAY['Python','GIS','NumPy','FastAPI'],
    'user_011', 'Pooja Iyer', 'open', 5
  ),
  (
    'EventPulse — College Fest Manager',
    '36-hour hackathon build: end-to-end college event management — registrations, QR check-ins, live schedule, sponsor dashboards.',
    'Hackathon', ARRAY['React','Node.js','QR Code','Tailwind'],
    'user_012', 'Mihir Shah', 'open', 14
  );

-- ─── Sample Hackathon Teams ───────────────────────────────
insert into hackathon_teams (name, hackathon, project_title, status, slots_total, slots_filled, looking_for, tech_stack, owner_id) values
  (
    'ByteForce',
    'Smart India Hackathon 2025',
    'Smart Campus Navigator',
    'active', 4, 3,
    ARRAY['React Native Developer'],
    ARRAY['React Native','Node.js','TensorFlow Lite','ARKit'],
    'user_002'
  ),
  (
    'ChainGuard',
    'ETHIndia 2025',
    'Blockchain Credential Vault',
    'active', 5, 4,
    ARRAY['Solidity Expert'],
    ARRAY['Solidity','Hardhat','React','IPFS','Ethers.js'],
    'user_003'
  ),
  (
    'GreenPulse',
    'NASA Space Apps 2025',
    'SolarSim — Renewable Energy Modeller',
    'forming', 4, 2,
    ARRAY['GIS Specialist','Frontend Developer'],
    ARRAY['Python','QGIS','FastAPI','Leaflet.js'],
    'user_011'
  ),
  (
    'NeuralNexus',
    'Microsoft Imagine Cup 2026',
    'MediScan — Diagnostic AI Assistant',
    'active', 5, 5,
    ARRAY[]::text[],
    ARRAY['PyTorch','FastAPI','React','Docker','Azure'],
    'user_007'
  );

-- ─── Sample Team Members ─────────────────────────────────
-- ByteForce
insert into team_members (team_id, user_name, role, avatar)
select id, 'Priya Sharma',  'Team Lead / Mobile Dev', 'PS' from hackathon_teams where name = 'ByteForce';
insert into team_members (team_id, user_name, role, avatar)
select id, 'Aryan Mehta',   'Backend Developer',      'AM' from hackathon_teams where name = 'ByteForce';
insert into team_members (team_id, user_name, role, avatar)
select id, 'Dev Kapoor',    'ML Engineer',            'DK' from hackathon_teams where name = 'ByteForce';

-- ChainGuard
insert into team_members (team_id, user_name, role, avatar)
select id, 'Rohan Verma',   'Smart Contract Dev',  'RV' from hackathon_teams where name = 'ChainGuard';
insert into team_members (team_id, user_name, role, avatar)
select id, 'Sneha Patil',   'Frontend Developer',  'SP' from hackathon_teams where name = 'ChainGuard';
insert into team_members (team_id, user_name, role, avatar)
select id, 'Kabir Das',     'Full-Stack',          'KD' from hackathon_teams where name = 'ChainGuard';
insert into team_members (team_id, user_name, role, avatar)
select id, 'Tanya Rao',     'UI/UX Designer',      'TR' from hackathon_teams where name = 'ChainGuard';

-- GreenPulse
insert into team_members (team_id, user_name, role, avatar)
select id, 'Pooja Iyer',    'Data Scientist',  'PI' from hackathon_teams where name = 'GreenPulse';
insert into team_members (team_id, user_name, role, avatar)
select id, 'Ravi Nair',     'Backend / APIs',  'RN' from hackathon_teams where name = 'GreenPulse';

-- NeuralNexus
insert into team_members (team_id, user_name, role, avatar)
select id, 'Dev Kapoor',    'ML Lead',           'DK' from hackathon_teams where name = 'NeuralNexus';
insert into team_members (team_id, user_name, role, avatar)
select id, 'Ishaan Bose',   'Backend Developer', 'IB' from hackathon_teams where name = 'NeuralNexus';
insert into team_members (team_id, user_name, role, avatar)
select id, 'Mihir Shah',    'Frontend Dev',      'MS' from hackathon_teams where name = 'NeuralNexus';
insert into team_members (team_id, user_name, role, avatar)
select id, 'Anika Singh',   'DevOps / Cloud',    'AS' from hackathon_teams where name = 'NeuralNexus';
insert into team_members (team_id, user_name, role, avatar)
select id, 'Pooja Iyer',    'Research / Data',   'PI' from hackathon_teams where name = 'NeuralNexus';

-- ─── Sample Applications ──────────────────────────────────
insert into applications (project_id, applicant_name, applicant_skills, message)
select id, 'Rohan Verma',  ARRAY['React','Node.js','MongoDB'],  'I can build the full backend and help with AI integration.'
from projects where title = 'AI-Powered Study Buddy';

insert into applications (project_id, applicant_name, applicant_skills, message)
select id, 'Tanya Rao',    ARRAY['React','Figma','TypeScript'],  'I would love to lead the UI/UX design for this project.'
from projects where title = 'AI-Powered Study Buddy';

insert into applications (project_id, applicant_name, applicant_skills, message)
select id, 'Aryan Mehta',  ARRAY['Python','TensorFlow','React'], 'Strong background in ML pipelines and data visualisation.'
from projects where title = 'Agri-Tech Yield Predictor';

-- ─── Demo Auth Users (for Supabase Auth / reference) ─────
-- NOTE: Create these manually in Supabase Dashboard → Authentication → Users
-- or use the Admin API. Passwords are all: demo1234
--
--  Email                 | Full Name      | Skills
--  ----------------------|----------------|--------------------------------
--  aryan@demo.colab      | Aryan Mehta    | React, Node.js, Python, OpenAI
--  priya@demo.colab      | Priya Sharma   | React Native, ARKit, Node.js
--  rohan@demo.colab      | Rohan Verma    | Solidity, Web3, React, IPFS
--  sneha@demo.colab      | Sneha Patil    | Python, TensorFlow, FastAPI
--
