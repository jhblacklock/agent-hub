'use client';

import { useState } from 'react';
import type { Agent } from '@/types/agent';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { MoreHorizontal, Activity } from 'lucide-react';
import { Button } from './ui/button';

interface AgentListProps {
  initialAgents: Agent[];
}

export function AgentList({ initialAgents }: AgentListProps) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  const toggleAgent = (id: string) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) =>
        agent.id === id ? { ...agent, isActive: !agent.isActive } : agent
      )
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id} className="p-4">
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
                checked={agent.isActive}
                onCheckedChange={() => toggleAgent(agent.id)}
                aria-label={`Toggle ${agent.name}`}
              />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
