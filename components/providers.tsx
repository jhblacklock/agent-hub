'use client';

import { ThemeProvider } from 'next-themes';
import { SupabaseProvider } from '@/lib/providers/supabase-provider';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { ProjectProvider } from '@/lib/providers/project-provider';
import { AgentProvider } from '@/lib/providers/agent-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SupabaseProvider>
        <AuthProvider>
          <ProjectProvider>
            <AgentProvider>{children}</AgentProvider>
          </ProjectProvider>
        </AuthProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
