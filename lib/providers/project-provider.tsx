'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Project } from '@/lib/supabase/types';
import { useSupabase } from './supabase-provider';
import { useRouter, usePathname } from 'next/navigation';

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project) => void;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { supabase, session, isLoading: sessionLoading } = useSupabase();
  const [currentProjectState, setCurrentProjectState] =
    useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function initializeProject() {
      if (sessionLoading) {
        console.log('Session is still loading...');
        return;
      }

      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: existingProjects, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (existingProjects?.length) {
          setProjects(existingProjects);

          const currentPath = pathname.split('/')[1];
          const currentProject = existingProjects.find(
            (project: { url_path: string }) => project.url_path === currentPath
          );

          if (!currentProject) {
            console.log('Redirecting to:', `/${existingProjects[0].url_path}`);
            setCurrentProjectState(existingProjects[0]);
            router.push(`/${existingProjects[0].url_path}`);
          } else if (currentProject !== currentProjectState) {
            setCurrentProjectState(currentProject);
          }
        } else {
          console.log('No projects found for user');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initializeProject();
  }, [
    session,
    sessionLoading,
    pathname,
    router,
    supabase,
    currentProjectState,
  ]);

  const setCurrentProject = (project: Project) => {
    setCurrentProjectState(project);
    // Only navigate if not in settings
    if (!pathname.includes('/settings')) {
      router.push(`/${project.url_path}`);
    }
  };

  const value = {
    currentProject: currentProjectState,
    projects,
    setCurrentProject,
    isLoading: isLoading || sessionLoading,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
