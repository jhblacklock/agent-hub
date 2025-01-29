'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { useSupabase } from './supabase-provider';
import logger from '@/lib/utils/logger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabase, session, isLoading: sessionLoading } = useSupabase();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) {
      return;
    }

    if (!session && !pathname.startsWith('/auth')) {
      logger.info('No session found, redirecting to login', { pathname });
      router.push('/auth/login');
      return;
    }

    setUser(session?.user ?? null);
    setLoading(false);
  }, [session, sessionLoading, pathname, router]);

  const value = {
    user,
    loading: loading || sessionLoading,
    signIn: async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } catch (error) {
        logger.error('Sign in error', error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        await supabase.auth.signOut();
        router.push('/auth/login');
      } catch (error) {
        logger.error('Sign out error', error);
        throw error;
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
