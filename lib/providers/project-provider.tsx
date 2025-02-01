'use client';

import { Project } from '@/lib/supabase/types';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSupabase } from './supabase-provider';

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

  const setCurrentProject = useCallback(
    (project: Project) => {
      setCurrentProjectState(project);
      // Only navigate if not in settings
      if (!pathname.includes('/settings')) {
        router.push(`/${project.url_path}`);
      }
    },
    [pathname, router]
  );

  const createDefaultProject = useCallback(async () => {
    try {
      console.info('Fetching projects...', { userId: session.user.id });
      const { data: existingProjects, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching projects', fetchError);
        setIsLoading(false);
        return;
      }

      if (existingProjects?.length) {
        setProjects(existingProjects);

        const urlParts = pathname.split('/');
        const urlProjectPath = urlParts[1];
        const urlProject = existingProjects.find(
          (p: Project) => p.url_path === urlProjectPath
        );

        if (urlProject) {
          setCurrentProject(urlProject);
          setIsLoading(false);
          return;
        }

        if (!pathname.startsWith('/auth')) {
          router.push(`/${existingProjects[0].url_path}`);
        }
        return;
      }

      // Create default project if none exist
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setIsLoading(false);
        return;
      }

      const defaultProject = {
        name: `${userData.user.email}'s projects`,
        url_path: `${userData.user.email?.split('@')[0]}-projects`,
        user_id: userData.user.id,
        avatar_url: null,
      };

      const { data: newProject, error: insertError } = await supabase
        .from('projects')
        .insert(defaultProject)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating project', insertError);
        setIsLoading(false);
        return;
      }

      if (newProject) {
        setProjects([newProject]);
        setCurrentProject(newProject);
        if (!pathname.startsWith('/auth')) {
          router.push(`/${newProject.url_path}`);
        }
      }
    } catch (error) {
      console.error('Error in project initialization', error);
    }
  }, [session?.user?.id, supabase, pathname, setCurrentProject, router]);

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
          createDefaultProject();
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
    createDefaultProject,
  ]);

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
