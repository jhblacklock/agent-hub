'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface SettingsFormSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading?: boolean;
  error?: string;
  hint?: string;
}

export function SettingsFormSection({
  title,
  description,
  children,
  onSubmit,
  loading = false,
  error,
  hint,
}: SettingsFormSectionProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <form onSubmit={onSubmit}>
          <div className="p-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="mt-6 space-y-4">
              {children}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <div>
            <Separator />
            <div className="flex items-center justify-between bg-muted/50 px-6 py-4">
              <p className="text-sm text-muted-foreground">{hint}</p>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
