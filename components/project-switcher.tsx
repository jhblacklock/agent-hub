'use client';

import * as React from 'react';
import { CaretSortIcon, CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
import { useProject } from '@/lib/providers/project-provider';
import { NewProjectModal } from '@/components/new-project-modal';

export function ProjectSwitcher() {
  const { projects, currentProject, setCurrentProject } = useProject();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const handleCreateProject = () => {
    setOpen(false);
    setShowNewProjectModal(true);
  };

  if (!currentProject) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href={`/${currentProject.url_path}`}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-foreground/10">
            <div className="h-2 w-2 rounded-sm bg-foreground" />
          </div>
          <span className="truncate">{currentProject.name}</span>
        </Link>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              aria-label="Select project"
            >
              <CaretSortIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-0">
            <Command>
              <CommandInput placeholder="Search projects..." />
              <CommandList>
                <CommandEmpty>No projects found.</CommandEmpty>
                <CommandGroup>
                  {projects.map((project) => (
                    <CommandItem
                      key={project.id}
                      onSelect={() => {
                        setCurrentProject(project);
                        router.push(`/${project.url_path}`);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-foreground/10 mr-2">
                        <div className="h-2 w-2 rounded-sm bg-foreground" />
                      </div>
                      <span className="truncate">{project.name}</span>
                      {currentProject?.id === project.id && (
                        <CheckIcon className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleCreateProject}
                    className="text-sm"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create Project
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <NewProjectModal
        open={showNewProjectModal}
        onOpenChange={setShowNewProjectModal}
      />
    </>
  );
}
