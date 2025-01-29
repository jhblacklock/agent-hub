'use client';

import { notFound } from 'next/navigation';
import { useProject } from '@/lib/providers/project-provider';
import { Header } from '@/components/header';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentProject, isLoading } = useProject();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto">{children}</div>
      </div>
    </div>
  );
}
