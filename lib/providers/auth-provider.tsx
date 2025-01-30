'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
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
  const { supabase } = useSupabase();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle initial auth check
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        logger.error('Error fetching user', error);
        setLoading(false);
        return;
      }
      setUser(data.user);
      setLoading(false);
    };
    fetchUser();
  }, [supabase.auth]);

  // Handle auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Handle navigation after auth state changes
  useEffect(() => {
    if (loading) return;

    const shouldRedirect = async () => {
      if (!user && !pathname.startsWith('/auth')) {
        router.push('/auth/login');
      } else if (user && pathname.startsWith('/auth')) {
        router.push('/');
      }
    };

    shouldRedirect();
  }, [user, loading, pathname, router]);

  const value = {
    user,
    loading,
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
      } catch (error) {
        logger.error('Sign out error', error);
        throw error;
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
