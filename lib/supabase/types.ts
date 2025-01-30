export interface TaskData {
  type: string;
  params: Record<string, unknown>;
  timestamp: string;
}

export interface TaskResult {
  status: 'success' | 'error' | 'pending';
  output: Record<string, unknown>;
  timestamp: string;
}

export interface Log {
  id: string;
  agent_name: string;
  task: TaskData;
  result: TaskResult;
  created_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export type AgentResponse = {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
};

export type Database = {
  public: {
    Tables: {
      logs: {
        Row: {
          id: string;
          agent_name: string;
          task: TaskData;
          result: TaskResult;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          agent_name: string;
          task: TaskData;
          result?: TaskResult;
          created_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          agent_name?: string;
          task?: TaskData;
          result?: TaskResult;
          created_at?: string;
          user_id?: string;
        };
      };
    };
  };
};

export type Project = {
  id: string;
  name: string;
  url_path: string;
  avatar_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type ProjectWithAgents = Project & {
  agents: Agent[];
};

export type Agent = {
  id: string;
  name: string;
  description: string;
  url_path: string;
  project_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type ApiKey = {
  id: string;
  key: string;
  agent_id: string;
  user_id: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
};
