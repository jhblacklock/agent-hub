'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProject } from '@/lib/providers/project-provider';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { SettingsLayout } from '@/components/settings-layout';
import { SettingsFormSection } from '@/components/settings-form-section';
import { generateCleanUrlPath } from '@/lib/utils/url';

export default function AgentSettingsPage() {
  const params = useParams();
  const { currentProject } = useProject();
  const { supabase } = useSupabase();
  const [agent, setAgent] = useState<any>(null);
  const [nameLoading, setNameLoading] = useState(false);
  const [urlLoading, setUrlLoading] = useState(false);
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const [name, setName] = useState('');
  const [urlPath, setUrlPath] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [urlError, setUrlError] = useState('');

  // Fetch agent data
  useEffect(() => {
    async function fetchAgent() {
      if (!currentProject || !params.agentId) return;

      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('url_path', params.agentId)
        .eq('project_id', currentProject.id)
        .single();

      if (error) {
        console.error('Error fetching agent:', error);
        return;
      }

      setAgent(data);
      setName(data.name);
      setUrlPath(data.url_path);
      setDescription(data.description || '');
    }

    fetchAgent();
  }, [currentProject, params.agentId, supabase]);

  // Validation effects
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
    } else {
      setUrlError('');
    }
  }, [urlPath]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent || nameError) return;

    setNameLoading(true);
    try {
      const { data, error } = await supabase
        .from('agents')
        .update({ name })
        .eq('id', agent.id)
        .select()
        .single();

      if (error) throw error;

      setAgent(data);
      toast.success('Agent name updated');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating agent name');
    } finally {
      setNameLoading(false);
    }
  };

  const handleDescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;

    setDescriptionLoading(true);
    try {
      const { data, error } = await supabase
        .from('agents')
        .update({ description })
        .eq('id', agent.id)
        .select()
        .single();

      if (error) throw error;

      setAgent(data);
      toast.success('Agent description updated');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating agent description');
    } finally {
      setDescriptionLoading(false);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent || urlError) return;

    setUrlLoading(true);
    try {
      // Clean the URL path only on submission
      const cleanUrlPath = generateCleanUrlPath(urlPath);

      const { error } = await supabase
        .from('agents')
        .update({ url_path: cleanUrlPath })
        .eq('id', agent.id);

      if (error) throw error;

      toast.success('Agent URL updated');
      window.location.href = `/${currentProject?.url_path}/agents/${cleanUrlPath}/settings`;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating agent URL');
    } finally {
      setUrlLoading(false);
    }
  };

  const items = [
    {
      href: `/${currentProject?.url_path}/agents/${agent?.url_path}/settings`,
      title: 'General',
    },
    {
      href: `/${currentProject?.url_path}/agents/${agent?.url_path}/settings/api`,
      title: 'API',
    },
  ];

  return (
    <SettingsLayout items={items}>
      {agent ? (
        <div className="space-y-6">
          <SettingsFormSection
            title="Agent Name"
            description="This is your agent's visible name within the platform."
            onSubmit={handleNameSubmit}
            loading={nameLoading}
            error={nameError}
            hint={`Please use 32 characters at maximum. Currently: ${name.length}/32`}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
            />
          </SettingsFormSection>

          <SettingsFormSection
            title="Agent URL"
            description="This is your agent's URL path for accessing it in the browser."
            onSubmit={handleUrlSubmit}
            loading={urlLoading}
            error={urlError}
            hint="URL path can only contain lowercase letters, numbers, and hyphens"
          >
            <div className="flex">
              <div className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                agenthub.dev/{currentProject?.url_path}/agents/
              </div>
              <Input
                value={urlPath}
                onChange={(e) => setUrlPath(e.target.value)}
                className="rounded-l-none"
                placeholder="my-agent"
              />
            </div>
          </SettingsFormSection>

          <SettingsFormSection
            title="Description"
            description="Describe what this agent does and its purpose."
            onSubmit={handleDescriptionSubmit}
            loading={descriptionLoading}
          >
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Enter a description for your agent..."
            />
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
