'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: '/',
      label: 'Overview',
      active: pathname === '/',
    },
    {
      href: '/activity',
      label: 'Activity',
      active: pathname === '/activity',
    },
    {
      href: '/usage',
      label: 'Usage',
      active: pathname === '/usage',
    },
    {
      href: '/settings',
      label: 'Settings',
      active: pathname === '/settings',
    },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm transition-colors hover:text-primary',
            route.active
              ? 'text-black dark:text-white'
              : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
