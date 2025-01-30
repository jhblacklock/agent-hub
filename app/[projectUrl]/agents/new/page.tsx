'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '@/lib/providers/project-provider';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

function generateUrlPath(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewAgentPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const { currentProject } = useProject();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url_path = generateUrlPath(name);

      const { error } = await supabase
        .from('agents')
        .insert({
          name,
          description,
          url_path,
          project_id: currentProject?.id,
          user_id: currentProject?.user_id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Agent created successfully');
      router.push(`/${currentProject?.url_path}/agents/${url_path}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error creating agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Agent</CardTitle>
          <CardDescription>Add a new agent to your project</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="My Agent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="What does this agent do?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Agent'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
