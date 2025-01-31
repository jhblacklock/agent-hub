'use client';

import { useState, useEffect } from 'react';
import { useProject } from '@/lib/providers/project-provider';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { SettingsLayout } from '@/components/settings-layout';
import { SettingsFormSection } from '@/components/settings-form-section';

export default function ProjectSettingsPage() {
  const { currentProject, setCurrentProject } = useProject();
  const { supabase } = useSupabase();
  const [nameLoading, setNameLoading] = useState(false);
  const [urlLoading, setUrlLoading] = useState(false);
  const [name, setName] = useState('');
  const [urlPath, setUrlPath] = useState('');
  const [nameError, setNameError] = useState('');
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    if (currentProject) {
      setName(currentProject.name);
      setUrlPath(currentProject.url_path);
    }
  }, [currentProject]);

  useEffect(() => {
    if (!name) {
      setNameError('Name is required');
    } else if (name.length > 32) {
      setNameError('Name must be 32 characters or less');
    } else {
      setNameError('');
    }
  }, [name]);

  useEffect(() => {
    if (!urlPath) {
      setUrlError('URL path is required');
    } else if (!/^[a-z0-9-]+$/.test(urlPath)) {
      setUrlError(
        'URL path can only contain lowercase letters, numbers, and hyphens'
      );
    } else {
      setUrlError('');
    }
  }, [urlPath]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject || nameError) return;

    setNameLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ name })
        .eq('id', currentProject.id);

      if (error) throw error;

      if (currentProject) {
        const updatedProject = { ...currentProject, name };
        setCurrentProject(updatedProject);
      }

      toast.success('Project name updated');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating project name');
    } finally {
      setNameLoading(false);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject || urlError) return;

    setUrlLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ url_path: urlPath })
        .eq('id', currentProject.id);

      if (error) throw error;

      toast.success('Project URL updated');
      window.location.href = `/${urlPath}/settings`;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating project URL');
    } finally {
      setUrlLoading(false);
    }
  };

  const items = [
    {
      href: `/${currentProject?.url_path}/settings`,
      title: 'General',
    },
    {
      href: `/${currentProject?.url_path}/settings/members`,
      title: 'Members',
    },
    {
      href: `/${currentProject?.url_path}/settings/billing`,
      title: 'Billing',
    },
  ];

  return (
    <SettingsLayout items={items}>
      {currentProject ? (
        <div className="space-y-6">
          <SettingsFormSection
            title="Project Name"
            description="This is your project's visible name within the platform."
            onSubmit={handleNameSubmit}
            loading={nameLoading}
            error={nameError}
            hint={`Please use 32 characters at maximum. Currently: ${name.length}/32`}
          >
            <div className="space-y-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={32}
              />
            </div>
          </SettingsFormSection>

          <SettingsFormSection
            title="Project URL"
            description="This is your project's URL path for accessing it in the browser."
            onSubmit={handleUrlSubmit}
            loading={urlLoading}
            error={urlError}
            hint="URL path can only contain lowercase letters, numbers, and hyphens"
          >
            <div className="space-y-2">
              <div className="flex">
                <div className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                  agenthub.dev/
                </div>
                <Input
                  value={urlPath}
                  onChange={(e) => setUrlPath(e.target.value.toLowerCase())}
                  className="rounded-l-none"
                  placeholder="my-project"
                />
              </div>
            </div>
          </SettingsFormSection>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        </div>
      )}
    </SettingsLayout>
  );
}
