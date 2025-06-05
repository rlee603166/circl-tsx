// components/layout/ResizableLayout.tsx

import React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import Header from "./Header";

interface ResizableLayoutProps {
    sidebar: React.ReactNode;
    chatWindow: React.ReactNode;
    artifactPanel: React.ReactNode;
    showArtifactPanel: boolean;
    isCollapsed: boolean;   
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    createNewSession: () => void;
}

export const ResizableLayout: React.FC<ResizableLayoutProps> = ({
    sidebar,
    chatWindow,
    artifactPanel,
    showArtifactPanel,
    isCollapsed,
    setIsCollapsed,
    createNewSession
}) => {
    return (
        <div className="flex h-screen w-full">
            {/* Sidebar: width controlled by ChatSidebar's own classes */}
            <div className="flex-shrink-0 h-full overflow-y-auto transition-all duration-300">
                {sidebar}
            </div>

            {/* Main area: chat/artifact with floating header */}
            <div className="flex-1 h-full overflow-hidden relative">
                {/* Floating Header - positioned absolutely to float above content */}
                <div className="absolute top-0 left-0 right-0 z-50">
                    <Header 
                        isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed}
                        createNewSession={createNewSession}
                    />
                </div>

                {/* Resizable chat vs. artifact panels - now takes full height */}
                <div className="h-full overflow-hidden">
                    <ResizablePanelGroup direction="horizontal" className="h-full">
                        {/* Chat Panel */}
                        <ResizablePanel defaultSize={showArtifactPanel ? 60 : 100} minSize={40}>
                            {/* Add top padding to account for floating header */}
                            <div className="h-full pt-16">
                                {chatWindow}
                            </div>
                        </ResizablePanel>

                        {/* Handle (only when artifact panel visible) */}
                        {showArtifactPanel && (
                            <ResizableHandle
                                withHandle
                                className="w-2 bg-gray-200/50 hover:bg-gray-300/50 transition-colors duration-200 relative group"
                            >
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </ResizableHandle>
                        )}

                        {/* Artifact Panel */}
                        {showArtifactPanel && (
                            <ResizablePanel defaultSize={40} minSize={25} maxSize={60}>
                                {/* Add top padding to account for floating header */}
                                <div className="h-full pt-16">
                                    {artifactPanel}
                                </div>
                            </ResizablePanel>
                        )}
                    </ResizablePanelGroup>
                </div>
            </div>
        </div>
    );
};
