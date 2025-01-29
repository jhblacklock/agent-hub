'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';

export default function ProjectPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
        <Button>
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
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Agent
          </Button>
        </div>
      </div>
    </div>
  );
}
