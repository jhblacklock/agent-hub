'use client';

import { ThemeProvider } from 'next-themes';
import { SupabaseProvider } from '@/lib/providers/supabase-provider';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { ProjectProvider } from '@/lib/providers/project-provider';
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
          <ProjectProvider>{children}</ProjectProvider>
        </AuthProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
