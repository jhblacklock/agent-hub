import Link from 'next/link';
import { ProfileDropdown } from './profile-dropdown';

export function Header() {
  return (
    <header className="flex h-16 items-center px-4 border-b bg-background md:px-6">
      <div className="flex items-center gap-2 font-semibold">
        <Link href="/" className="flex items-center gap-2 text-lg md:text-base">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500" />
          ILUI Labs
        </Link>
      </div>
      <nav className="hidden md:flex flex-row items-center gap-5 text-sm lg:gap-6 mx-6">
        <Link href="/" className="font-bold">
          Overview
        </Link>
        <Link href="#" className="text-muted-foreground">
          Activity
        </Link>
        <Link href="#" className="text-muted-foreground">
          Usage
        </Link>
        <Link href="#" className="text-muted-foreground">
          Settings
        </Link>
      </nav>
      <div className="flex items-center gap-4 ml-auto">
        <ProfileDropdown />
      </div>
    </header>
  );
}
