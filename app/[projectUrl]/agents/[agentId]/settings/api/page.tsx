'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProject } from '@/lib/providers/project-provider';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SettingsLayout } from '@/components/settings-layout';
import { SettingsFormSection } from '@/components/settings-form-section';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { generateToken } from '@/lib/utils/token';
import { Input } from '@/components/ui/input';

interface AgentToken {
  id: string;
  token: string;
  created_at: string;
  last_used_at: string | null;
}

export default function AgentApiSettingsPage() {
  const params = useParams();
  const { currentProject } = useProject();
  const { supabase } = useSupabase();
  const [agent, setAgent] = useState<any>(null);
  const [token, setToken] = useState<AgentToken | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRegenerateAlert, setShowRegenerateAlert] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch agent and token
  useEffect(() => {
    async function fetchData() {
      if (!currentProject || !params.agentId) return;

      try {
        // Fetch agent
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('*')
          .eq('url_path', params.agentId)
          .eq('project_id', currentProject.id)
          .single();

        if (agentError) throw agentError;
        setAgent(agentData);

        // Fetch token
        const { data: tokenData, error: tokenError } = await supabase
          .from('agent_tokens')
          .select('*')
          .eq('agent_id', agentData.id)
          .single();

        if (tokenError) throw tokenError;
        setToken(tokenData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading API settings');
      }
    }

    fetchData();
  }, [currentProject, params.agentId, supabase]);

  const handleRegenerateToken = async () => {
    if (!agent) return;

    setLoading(true);
    try {
      const newTokenValue = generateToken();
      const { error } = await supabase
        .from('agent_tokens')
        .update({ token: newTokenValue })
        .eq('agent_id', agent.id);

      if (error) throw error;

      setNewToken(newTokenValue);
      toast.success('API token regenerated');
      setShowRegenerateAlert(false);

      // Refresh token data
      const { data, error: fetchError } = await supabase
        .from('agent_tokens')
        .select('*')
        .eq('agent_id', agent.id)
        .single();

      if (fetchError) throw fetchError;
      setToken(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error regenerating API token');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Token copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy token');
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
            title="API Token"
            description="Use this token to authenticate API requests for this agent."
            onSubmit={(e) => {
              e.preventDefault();
              setShowRegenerateAlert(true);
            }}
            loading={loading}
            submitText="Regenerate Token"
          >
            <div className="space-y-4">
              {newToken ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md space-y-2">
                  <p className="text-sm font-medium text-yellow-900">
                    Copy your new API token
                  </p>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newToken}
                      readOnly
                      className="flex-1 font-mono text-sm bg-white"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => copyToClipboard(newToken)}
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </Button>
                  </div>
                </div>
              ) : token ? (
                <div className="space-y-2">
                  <div className="flex items-center p-3 rounded-md">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={token.token}
                          readOnly
                          className="font-mono text-sm bg-transparent"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => copyToClipboard(token.token)}
                        >
                          {copied ? <CheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created{' '}
                        {new Date(token.created_at).toLocaleDateString()}
                      </p>
                      {token.last_used_at && (
                        <p className="text-sm text-muted-foreground">
                          Last used{' '}
                          {new Date(token.last_used_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </SettingsFormSection>

          <AlertDialog
            open={showRegenerateAlert}
            onOpenChange={setShowRegenerateAlert}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Regenerate API Token?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will invalidate the existing token. All clients using the
                  old token will need to be updated with the new one.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRegenerateToken}>
                  Regenerate Token
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        </div>
      )}
    </SettingsLayout>
  );
}
