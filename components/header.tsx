import Link from 'next/link';
import { ProfileDropdown } from './profile-dropdown';
import { ProjectSwitcher } from '@/components/project-switcher';
import { MainNav } from '@/components/main-nav';
import { AgentSwitcher } from './agent-switcher';
import { useProject } from '@/lib/providers/project-provider';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { NewProjectModal } from '@/components/new-project-modal';

export function Header() {
  const { projects } = useProject();
  const router = useRouter();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background text-sm">
        <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-foreground" />
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <div className="flex items-center gap-4">
              {projects.length > 0 ? (
                <>
                  <ProjectSwitcher />
                  <AgentSwitcher />
                  <MainNav />
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewProjectModal(true)}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              )}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </div>
      </header>
      <NewProjectModal
        open={showNewProjectModal}
        onOpenChange={setShowNewProjectModal}
      />
    </>
  );
}
