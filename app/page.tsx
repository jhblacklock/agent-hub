import { AgentList } from "@/components/agent-list"
import { Agent } from "@/types/agent"
const initialAgents: Agent[] = [
  { id: "1", name: "Data Analyzer", description: "Analyzes complex datasets", isActive: false },
  { id: "2", name: "Language Translator", description: "Translates between multiple languages", isActive: true },
  { id: "3", name: "Image Generator", description: "Creates images from text descriptions", isActive: false },
  { id: "4", name: "Code Assistant", description: "Helps with coding and debugging", isActive: true },
]

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">AI Agent Hub</h1>
      <AgentList initialAgents={initialAgents} />
    </div>
  )
}

