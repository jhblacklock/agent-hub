'use client';

import { Search } from '@/components/search';
import { AgentList } from '@/components/agent-list';

const initialAgents = [
  {
    id: '1',
    name: 'Data Analyzer',
    description: 'agent-hub-analyzer.vercel.app',
    isActive: true,
  },
  {
    id: '2',
    name: 'Language Translator',
    description: 'agent-hub-translator.vercel.app',
    isActive: false,
  },
  {
    id: '3',
    name: 'Image Generator',
    description: 'agent-hub-image.vercel.app',
    isActive: true,
  },
  {
    id: '4',
    name: 'Code Assistant',
    description: 'agent-hub-code.vercel.app',
    isActive: false,
  },
  {
    id: '5',
    name: 'Content Writer',
    description: 'agent-hub-writer.vercel.app',
    isActive: true,
  },
  {
    id: '6',
    name: 'Research Assistant',
    description: 'agent-hub-research.vercel.app',
    isActive: false,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-4 md:p-6 space-y-4">
        <div className="max-w-[1200px] mx-auto space-y-4">
          <Search />
          <AgentList initialAgents={initialAgents} />
        </div>
      </main>
    </div>
  );
}
