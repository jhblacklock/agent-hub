'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Project } from '@/lib/supabase/types';
import { useSupabase } from './supabase-provider';
import { useRouter, usePathname } from 'next/navigation';
import logger from '@/lib/utils/logger';

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project) => void;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { supabase, session, isLoading: sessionLoading } = useSupabase();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function initializeProject() {
      if (sessionLoading) {
        return;
      }

      if (!session?.user) {
        logger.info('No session, skipping project init', { userId: null });
        setIsLoading(false);
        return;
      }

      try {
        logger.info('Fetching projects...', { userId: session.user.id });
        const { data: existingProjects, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          logger.error('Error fetching projects', fetchError);
          setIsLoading(false);
          return;
        }

        logger.debug('Projects fetched', { count: existingProjects?.length });

        if (existingProjects?.length) {
          setProjects(existingProjects);

          // Get project from URL
          const urlParts = pathname.split('/');
          const urlProjectPath = urlParts[1];
          const urlProject = existingProjects.find(
            (p: Project) => p.url_path === urlProjectPath
          );

          if (urlProject) {
            logger.info('Found matching project', { projectId: urlProject.id });
            setCurrentProject(urlProject);
            setIsLoading(false);
            return;
          }

          // If we're not on an auth page and no matching project, redirect to first project
          if (!pathname.startsWith('/auth')) {
            logger.info('Redirecting to first project', {
              projectId: existingProjects[0].id,
            });
            router.push(`/${existingProjects[0].url_path}`);
          }
          return;
        }

        // Create default project if none exist
        const defaultProject = {
          name: `${session.user.email}'s projects`,
          url_path: `${session.user.email.split('@')[0]}-projects`,
          user_id: session.user.id,
          avatar_url: null,
        };

        logger.info('Creating default project', defaultProject);

        const { data: newProject, error: insertError } = await supabase
          .from('projects')
          .insert(defaultProject)
          .select()
          .single();

        if (insertError) {
          logger.error('Error creating project', insertError);
          setIsLoading(false);
          return;
        }

        if (newProject) {
          logger.info('Created new project', { projectId: newProject.id });
          setProjects([newProject]);
          setCurrentProject(newProject);
          if (!pathname.startsWith('/auth')) {
            router.push(`/${newProject.url_path}`);
          }
        }
      } catch (error) {
        logger.error('Error in project initialization', error);
      }

      setIsLoading(false);
    }

    initializeProject();
  }, [session, sessionLoading, pathname, router, supabase]);

  const value = {
    currentProject,
    projects,
    setCurrentProject: (project: Project) => {
      setCurrentProject(project);
      router.push(`/${project.url_path}`);
    },
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
