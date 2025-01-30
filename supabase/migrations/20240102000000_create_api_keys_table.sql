create table api_keys (
  id uuid default uuid_generate_v4() primary key,
  key text not null,
  agent_id uuid references agents(id) not null,
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_used_at timestamp with time zone,
  revoked_at timestamp with time zone,
  unique(agent_id, key)
);

-- RLS policies
alter table api_keys enable row level security;

create policy "Users can view their own api keys"
  on api_keys for select
  using (auth.uid() = user_id);

create policy "Users can create api keys"
  on api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own api keys"
  on api_keys for update
  using (auth.uid() = user_id); 