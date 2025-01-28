"use client"

import { useState } from "react"
import type { Agent } from "@/types/agent"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface AgentListProps {
  initialAgents: Agent[]
}

export function AgentList({ initialAgents }: AgentListProps) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)

  const toggleAgent = (id: string) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) => (agent.id === id ? { ...agent, isActive: !agent.isActive } : agent)),
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {agent.name}
              <Switch
                checked={agent.isActive}
                onCheckedChange={() => toggleAgent(agent.id)}
                aria-label={`Toggle ${agent.name}`}
              />
            </CardTitle>
            <CardDescription>{agent.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={agent.isActive ? "text-green-600" : "text-red-600"}>
              {agent.isActive ? "Active" : "Inactive"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

