import Link from 'next/link';
import { ProfileDropdown } from './profile-dropdown';
import { ProjectSwitcher } from '@/components/project-switcher';
import { MainNav } from '@/components/main-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-foreground" />
          </Link>
          <span className="text-sm text-muted-foreground">/</span>
          <div className="flex items-center gap-4">
            <ProjectSwitcher />
            <span className="text-sm text-muted-foreground">/</span>
            <MainNav />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
