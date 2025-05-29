// components/layout/ResizableLayout.tsx

import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import Header from './Header';

interface ResizableLayoutProps {
  sidebar: React.ReactNode;
  chatWindow: React.ReactNode;
  artifactPanel: React.ReactNode;
  showArtifactPanel: boolean;
}

export const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  sidebar,
  chatWindow,
  artifactPanel,
  showArtifactPanel
}) => {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar: width controlled by ChatSidebar’s own classes */}
      <div className="flex-shrink-0 h-full overflow-y-auto transition-all duration-300">
        {sidebar}
      </div>

      {/* Main area: header + chat/artifact */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header sits above chat/artifact, but to the right of the sidebar */}
        <div className="h-16 border-b border-gray-200/30 glass-effect">
          <Header />
        </div>

        {/* Resizable chat vs. artifact panels */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Chat Panel */}
            <ResizablePanel defaultSize={showArtifactPanel ? 60 : 100} minSize={40}>
              {chatWindow}
            </ResizablePanel>

            {/* Handle (only when artifact panel visible) */}
            {showArtifactPanel && (
              <ResizableHandle withHandle className="w-2 bg-gray-200/50 hover:bg-gray-300/50 transition-colors duration-200 relative group">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </ResizableHandle>
            )}

            {/* Artifact Panel */}
            {showArtifactPanel && (
              <ResizablePanel defaultSize={40} minSize={25} maxSize={60}>
                {artifactPanel}
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};
