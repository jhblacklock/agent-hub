import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { TaskData } from '@/lib/supabase/types';

export async function POST(
  request: Request,
  { params }: { params: { agentName: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const task: TaskData = {
      type: body.type,
      params: body.params,
      timestamp: new Date().toISOString(),
    };

    // Log the task
    const { error: logError } = await supabase.from('logs').insert({
      agent_name: params.agentName,
      task,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
    });

    if (logError) {
      throw logError;
    }

    return NextResponse.json({
      success: true,
      message: 'Task logged successfully',
    });
  } catch (error) {
    console.error('Error processing agent task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
