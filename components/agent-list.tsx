'use client';

import { useRouter } from 'next/navigation';
import { useProject } from '@/lib/providers/project-provider';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Agent } from '@/lib/supabase/types';
import { MoreHorizontal, Activity } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from '@radix-ui/react-switch';
import { Search } from './search';

interface AgentListProps {
  agents: Agent[];
}

export function AgentList({ agents }: AgentListProps) {
  const { currentProject } = useProject();
  const router = useRouter();

  const handleCreateAgent = () => {
    router.push(`/${currentProject?.url_path}/agents/new`);
  };

  if (agents.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <Button onClick={handleCreateAgent}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Agent
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No agents yet</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Get started by creating your first agent
            </p>
            <Button onClick={handleCreateAgent}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
      <div className="flex items-center justify-between">
        <div className="w-full mr-4">
          <Search />
        </div>
        <Button onClick={handleCreateAgent}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Link
            key={agent.id}
            href={`/${currentProject?.url_path}/agents/${agent.url_path}`}
            className="block"
          >
            <Card className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Switch
                    checked={true}
                    // onCheckedChange={() => toggleAgent(agent.id)}
                    aria-label={`Toggle ${agent.name}`}
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
