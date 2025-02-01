'use client';

import * as React from 'react';
import { CaretSortIcon, CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import Link from 'next/link';
import { useAgent } from '@/lib/providers/agent-provider';
import { useProject } from '@/lib/providers/project-provider';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CreateAgentModal } from '@/components/create-agent-modal';

export function AgentSwitcher() {
  const { currentProject } = useProject();
  const { currentAgent, agents } = useAgent();
  const [open, setOpen] = useState(false);
  const [showNewAgentModal, setShowNewAgentModal] = useState(false);
  const handleCreateAgent = () => {
    setOpen(false);
    setShowNewAgentModal(true);
  };

  if (!currentAgent) {
    return null;
  }

  return (
    <>
      <span className="text-sm text-muted-foreground">/</span>
      <div className="flex items-center gap-2">
        <Link
          href={`/${currentProject?.url_path}/agents/${currentAgent.url_path}`}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-foreground/10">
            <div className="h-2 w-2 rounded-sm bg-foreground" />
          </div>
          <span className="truncate">{currentAgent.name}</span>
        </Link>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              aria-label="Select agent"
            >
              <CaretSortIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-0">
            <Command>
              <CommandInput placeholder="Search agents..." />
              <CommandList>
                <CommandEmpty>No agents found.</CommandEmpty>
                <CommandGroup>
                  {agents.map((agent) => (
                    <CommandItem
                      key={agent.id}
                      onSelect={() => {
                        window.location.href = `/${currentProject?.url_path}/agents/${agent.url_path}`;
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-foreground/10 mr-2">
                        <div className="h-2 w-2 rounded-sm bg-foreground" />
                      </div>
                      <span className="truncate">{agent.name}</span>
                      {currentAgent?.id === agent.id && (
                        <CheckIcon className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={handleCreateAgent} className="text-sm">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create Agent
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <CreateAgentModal
        open={showNewAgentModal}
        onOpenChange={setShowNewAgentModal}
      />
    </>
  );
}
