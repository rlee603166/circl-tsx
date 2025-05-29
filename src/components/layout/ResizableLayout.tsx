
import React, { useState, useRef, useCallback } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

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
      {/* Fixed Sidebar */}
      <div className="w-80 flex-shrink-0">
        {sidebar}
      </div>
      
      {/* Resizable Content Area */}
      <div className="flex-1 flex">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Chat Panel */}
          <ResizablePanel defaultSize={showArtifactPanel ? 60 : 100} minSize={40}>
            {chatWindow}
          </ResizablePanel>
          
          {/* Resizable Handle - only show when artifact panel is visible */}
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
  );
};
