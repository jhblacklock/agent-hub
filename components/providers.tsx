'use client';

import { ThemeProvider } from 'next-themes';
import { SupabaseProvider } from '@/lib/providers/supabase-provider';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { ProjectProvider } from '@/lib/providers/project-provider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { type Session } from '@supabase/auth-helpers-nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SupabaseProvider session={session}>
        <AuthProvider>
          <ProjectProvider>{children}</ProjectProvider>
        </AuthProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
