-- Create agent tokens table
create table if not exists agent_tokens (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references agents(id) on delete cascade not null,
  name text not null,
  token text not null unique,
  created_at timestamp with time zone default now() not null,
  last_used_at timestamp with time zone,
  expires_at timestamp with time zone,
  revoked_at timestamp with time zone
);

-- Create indexes
create index agent_tokens_agent_id_idx on agent_tokens(agent_id);
create index agent_tokens_token_idx on agent_tokens(token) where revoked_at is null;

-- Enable RLS
alter table agent_tokens enable row level security;

-- Create policies
create policy "Users can view their own agent tokens"
  on agent_tokens for select
  using (
    agent_id in (
      select id from agents
      where project_id in (
        select id from projects
        where user_id = auth.uid()
      )
    )
  );

create policy "Users can create tokens for their own agents"
  on agent_tokens for insert
  with check (
    agent_id in (
      select id from agents
      where project_id in (
        select id from projects
        where user_id = auth.uid()
      )
    )
  );

create policy "Users can revoke their own tokens"
  on agent_tokens for update
  using (
    agent_id in (
      select id from agents
      where project_id in (
        select id from projects
        where user_id = auth.uid()
      )
    )
  );

-- Add types for token purposes
comment on table agent_tokens is 'API tokens for agent authentication';
comment on column agent_tokens.name is 'User-provided name for the token';
comment on column agent_tokens.token is 'The actual token value used for authentication';
comment on column agent_tokens.last_used_at is 'When the token was last used';
comment on column agent_tokens.expires_at is 'When the token expires (null = never)';
comment on column agent_tokens.revoked_at is 'When the token was revoked (null = active)'; 