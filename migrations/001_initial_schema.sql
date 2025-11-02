-- Enable pgvector extension (run this first in Supabase SQL editor)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- users
create table public.users (
  id uuid primary key default gen_random_uuid(),
  handle text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  wallet_address text unique,
  rep_score int default 0,
  created_at timestamptz default now()
);

-- posts (Echoes)
create type post_kind as enum ('text','image','audio','video');
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.users(id) on delete cascade,
  kind post_kind not null,
  body text,
  media_url text,
  minted boolean default false,
  chain_id int,
  contract text,
  token_id numeric,
  price_wei numeric,
  edition_type text,          -- '1of1'|'limited'|'open'|'allowlist'
  editions int,               -- maxSupply for 1155; null for 1/1
  start_at timestamptz,
  end_at timestamptz,
  per_wallet_cap int,
  royalty_bps int,
  transfer_lock_until timestamptz,
  sold_out boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- features per post
create table public.post_features (
  post_id uuid primary key references public.posts(id) on delete cascade,
  embedding vector(1536),
  emotion jsonb,              -- {valence, arousal, tone:'joy|calm|curiosity|anger|sadness|awe'}
  influence_score float default 0,
  audio_url text,             -- cached TTS summary
  summary text
);

-- reactions (off-chain micro-pay intents)
create type reaction_kind as enum ('like','comment','quote');
create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  actor_id uuid references public.users(id) on delete cascade,
  kind reaction_kind not null,
  comment_text text,
  amount_wei numeric not null,
  created_at timestamptz default now(),
  settled_tx text
);

-- sales / mint events
create table public.sales(
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  buyer_id uuid references public.users(id),
  tx_hash text,
  amount_wei numeric,
  edition_serial int,         -- for 1155 editions (#n)
  supply_at_purchase int,
  created_at timestamptz default now()
);

-- collected (absorbed) neurons
create table public.collected_neurons (
  id uuid primary key default gen_random_uuid(),
  collector_id uuid references public.users(id) on delete cascade,
  source_post_id uuid references public.posts(id) on delete cascade,
  source_author_id uuid references public.users(id) on delete cascade,
  collected_at timestamptz default now(),
  price_wei numeric,
  tx_hash text
);

-- influence lineage and mind state
create table public.influence_lineage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  source_user_id uuid references public.users(id) on delete cascade,
  weight float default 0,      -- normalized 0..1
  updated_at timestamptz default now(),
  unique(user_id, source_user_id)
);

create table public.mind_state (
  user_id uuid primary key references public.users(id) on delete cascade,
  self_weight float default 1.0,
  external_weight float default 0.0,
  node_count int default 0,
  coherence float default 0,    -- 0..1
  diversity float default 0,    -- 0..1 (entropy proxy)
  last_recomputed timestamptz default now()
);

-- 3D graph cache and packs
create table public.mind_graph_cache (
  user_id uuid references public.users(id) on delete cascade,
  version int default 1,
  glb_url text,
  nodes jsonb,   -- [{id, kind:'native|absorbed', pos:[x,y,z], color:[r,g,b], size, audio_url, label, emotion, serial}]
  edges jsonb,   -- [{source, target, weight}]
  created_at timestamptz default now(),
  primary key (user_id, created_at)
);

create table public.packs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.users(id) on delete cascade,
  title text,
  description text,
  created_at timestamptz default now(),
  price_wei numeric
);

create table public.pack_items (
  pack_id uuid references public.packs(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  primary key (pack_id, post_id)
);

-- flags / reputation
create table public.flags(
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  reporter_id uuid references public.users(id),
  reason text,
  status text default 'open',
  created_at timestamptz default now()
);

create table public.reputation_events(
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  type text,
  weight numeric,
  meta jsonb,
  created_at timestamptz default now()
);

-- useful indexes
create index posts_author_idx on public.posts(author_id, created_at desc);
create index features_embedding_idx on public.post_features using ivfflat (embedding vector_cosine_ops);
create index collected_by_user_idx on public.collected_neurons(collector_id, collected_at desc);
create index lineage_user_idx on public.influence_lineage(user_id);
create index posts_minted_idx on public.posts(minted, created_at desc);
create index sales_post_idx on public.sales(post_id, created_at desc);

-- Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.post_features enable row level security;
alter table public.reactions enable row level security;
alter table public.sales enable row level security;
alter table public.collected_neurons enable row level security;
alter table public.influence_lineage enable row level security;
alter table public.mind_state enable row level security;
alter table public.mind_graph_cache enable row level security;
alter table public.packs enable row level security;
alter table public.pack_items enable row level security;
alter table public.flags enable row level security;
alter table public.reputation_events enable row level security;

-- Basic RLS policies (allow all reads, authenticated writes)
create policy "Users are viewable by everyone" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid()::text = id::text);

create policy "Posts are viewable by everyone" on public.posts for select using (true);
create policy "Authenticated users can create posts" on public.posts for insert with check (true);
create policy "Users can update own posts" on public.posts for update using (auth.uid()::text = author_id::text);

create policy "Post features are viewable by everyone" on public.post_features for select using (true);

create policy "Reactions are viewable by everyone" on public.reactions for select using (true);
create policy "Authenticated users can create reactions" on public.reactions for insert with check (true);

create policy "Sales are viewable by everyone" on public.sales for select using (true);
create policy "Authenticated users can create sales" on public.sales for insert with check (true);

create policy "Collected neurons are viewable by everyone" on public.collected_neurons for select using (true);
create policy "Authenticated users can collect" on public.collected_neurons for insert with check (true);

create policy "Influence lineage is viewable by everyone" on public.influence_lineage for select using (true);
create policy "Mind state is viewable by everyone" on public.mind_state for select using (true);
create policy "Mind graph cache is viewable by everyone" on public.mind_graph_cache for select using (true);

create policy "Packs are viewable by everyone" on public.packs for select using (true);
create policy "Pack items are viewable by everyone" on public.pack_items for select using (true);

