import { AgentResponse, TaskData } from '../supabase/types';

export abstract class BaseAgent {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract run(task: TaskData): Promise<AgentResponse>;

  getName(): string {
    return this.name;
  }
} 