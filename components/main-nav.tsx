'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useProject } from '@/lib/providers/project-provider';

export function MainNav() {
  const pathname = usePathname();
  const { currentProject } = useProject();

  // Extract agentId from path if it exists
  const pathParts = pathname.split('/');
  const agentIndex = pathParts.findIndex((part) => part === 'agents');
  const isAgentRoute = agentIndex !== -1 && pathParts[agentIndex + 1];
  const agentId = isAgentRoute ? pathParts[agentIndex + 1] : null;

  const routes = isAgentRoute
    ? [
        {
          href: `/${currentProject?.url_path}/agents/${agentId}`,
          label: 'Overview',
          active: pathname === `/${currentProject?.url_path}/agents/${agentId}`,
        },
        {
          href: `/${currentProject?.url_path}/agents/${agentId}/settings`,
          label: 'Settings',
          active: pathname.includes(`/agents/${agentId}/settings`),
        },
      ]
    : [
        {
          href: `/${currentProject?.url_path}`,
          label: 'Overview',
          active: pathname === `/${currentProject?.url_path}`,
        },
        {
          href: `/${currentProject?.url_path}/settings`,
          label: 'Settings',
          active: pathname.includes(`/${currentProject?.url_path}/settings`),
        },
      ];

  return (
    <nav className="flex items-center space-x-6 border-b">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'flex h-14 items-center border-b-2 px-1',
            route.active
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
