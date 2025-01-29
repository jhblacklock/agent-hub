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
