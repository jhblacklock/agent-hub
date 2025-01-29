-- Create projects table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  name varchar(32) not null,
  url_path varchar(48) not null,
  avatar_url text,
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, url_path)
);

-- Create agents table first
create table agents (
  id uuid default uuid_generate_v4() primary key,
  name varchar(32) not null,
  description text,
  project_id uuid references projects(id) not null,
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table projects enable row level security;
alter table agents enable row level security;

-- Project policies
create policy "Users can view their own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on projects for update
  using (auth.uid() = user_id);

-- Agent policies
create policy "Users can view their own agents"
  on agents for select
  using (auth.uid() = user_id);

create policy "Users can insert their own agents"
  on agents for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own agents"
  on agents for update
  using (auth.uid() = user_id); 