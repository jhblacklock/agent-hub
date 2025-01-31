-- Remove columns we don't need anymore
alter table agent_tokens
  drop column name,
  drop column expires_at,
  drop column revoked_at;

-- Make agent_id unique (one token per agent)
alter table agent_tokens
  add constraint agent_tokens_agent_id_unique unique (agent_id);

-- Drop old index that referenced revoked_at
drop index if exists agent_tokens_token_idx;
create index agent_tokens_token_idx on agent_tokens(token);

-- Drop old policies
drop policy if exists "Users can create tokens for their own agents" on agent_tokens;
drop policy if exists "Users can revoke their own tokens" on agent_tokens;

-- Create new unified policy
create policy "Users can manage tokens for their own agents"
  on agent_tokens for all
  using (
    agent_id in (
      select id from agents
      where project_id in (
        select id from projects
        where user_id = auth.uid()
      )
    )
  );

-- Add trigger to auto-create token for new agents
create or replace function create_agent_token()
returns trigger as $$
begin
  insert into agent_tokens (agent_id, token)
  values (NEW.id, 'agt_' || encode(gen_random_bytes(32), 'base64'));
  return NEW;
end;
$$ language plpgsql security definer;

create trigger create_agent_token_on_insert
  after insert on agents
  for each row
  execute function create_agent_token(); 