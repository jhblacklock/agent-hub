import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/supabase/types';

export default async function HomePage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('url_path')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (projects) {
    redirect(`/${projects.url_path}`);
  }

  // If no projects exist, redirect to project creation page
  redirect('/projects/new');
}
