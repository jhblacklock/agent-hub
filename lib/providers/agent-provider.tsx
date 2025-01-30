'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Agent } from '@/lib/supabase/types';
import { useSupabase } from './supabase-provider';
import { usePathname } from 'next/navigation';
import { useProject } from './project-provider';

interface AgentContextType {
  currentAgent: Agent | null;
  agents: Agent[];
  isLoading: boolean;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const { supabase } = useSupabase();
  const { currentProject } = useProject();
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function initializeAgent() {
      if (!currentProject) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: projectAgents, error } = await supabase
          .from('agents')
          .select('*')
          .eq('project_id', currentProject.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setAgents(projectAgents || []);

        // Check if we're on an agent route and set current agent
        const pathParts = pathname.split('/');
        const agentIndex = pathParts.findIndex((part) => part === 'agents');
        if (agentIndex !== -1 && pathParts[agentIndex + 1]) {
          const urlAgentPath = pathParts[agentIndex + 1];
          const urlAgent = projectAgents?.find(
            (a: Agent) => a.url_path === urlAgentPath
          );
          if (urlAgent) {
            setCurrentAgent(urlAgent);
          }
        } else {
          setCurrentAgent(null);
        }
      } catch (error) {
        console.error('Error initializing agent:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initializeAgent();
  }, [currentProject, pathname, supabase]);

  const value = {
    currentAgent,
    agents,
    isLoading,
  };

  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  );
}

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
};
