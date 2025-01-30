import { Providers } from '@/components/providers';
import './globals.css';
import { AgentProvider } from '@/lib/providers/agent-provider';
import { ProjectProvider } from '@/lib/providers/project-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ProjectProvider>
            <AgentProvider>{children}</AgentProvider>
          </ProjectProvider>
        </Providers>
      </body>
    </html>
  );
}
