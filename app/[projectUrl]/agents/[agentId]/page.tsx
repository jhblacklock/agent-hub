'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { Agent } from '@/lib/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useProject } from '@/lib/providers/project-provider';

export default function AgentPage() {
  const { supabase } = useSupabase();
  const params = useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentProject } = useProject();

  useEffect(() => {
    async function fetchAgent() {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('url_path', params.agentId)
          .single();

        if (error) throw error;
        setAgent(data);
      } catch (error) {
        console.error('Error fetching agent:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAgent();
  }, [supabase, params.agentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!agent) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{agent.name}</h1>
      </div>
      <div>
        <p className="text-muted-foreground">{agent.description}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Created
                </div>
                <div>
                  {new Date(agent.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
