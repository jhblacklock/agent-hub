'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { useProject } from '@/lib/providers/project-provider';
import { Agent } from '@/lib/supabase/types';
import { AgentList } from '@/components/agent-list';

export default function ProjectPage() {
  const { supabase } = useSupabase();
  const { currentProject } = useProject();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgents() {
      if (!currentProject) return;

      try {
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('project_id', currentProject.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAgents(data || []);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, [currentProject, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  return <AgentList agents={agents} />;
}
