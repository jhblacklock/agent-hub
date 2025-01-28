import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Log, TaskData, TaskResult } from './types';

export async function createLog(
  agentName: string,
  task: TaskData,
  userId: string
): Promise<{ error: Error | null }> {
  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase
    .from('logs')
    .insert({
      agent_name: agentName,
      task,
      user_id: userId,
      created_at: new Date().toISOString()
    });

  return { error: error as Error | null };
}

export async function updateLogResult(
  logId: string,
  result: TaskResult
): Promise<{ error: Error | null }> {
  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase
    .from('logs')
    .update({ result })
    .match({ id: logId });

  return { error: error as Error | null };
}

export async function getLogs(
  userId: string,
  limit = 10
): Promise<{ logs: Log[] | null; error: Error | null }> {
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { 
    logs: data as Log[] | null,
    error: error as Error | null 
  };
} 