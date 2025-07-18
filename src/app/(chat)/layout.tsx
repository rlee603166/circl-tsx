"use client";

import React, { useState, useEffect } from "react";
import { ChatProvider, useChatContext } from "@/contexts/ChatContext";
import { ChatSidebar } from "@/components/sidebar/ChatSidebar";
import { ResizableLayout } from "@/components/layout/ResizableLayout";
import { ArtifactPanel } from "@/components/artifacts/ArtifactPanel";
import { Menu } from "lucide-react";
import { UserFound } from "@/types";
import { useRouter } from "next/navigation";

// vercel annoying

const ChatLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const {
        sessions,
        activeSession,
        usersFound,
        isLoading,
        messages,
        setActiveSessionId,
        createNewSession,
        sendMessage,
        selectSession,
        deleteSession,
        loadSessions,
    } = useChatContext();

    useEffect(() => {
        setIsLoaded(true);
        loadSessions();
    }, [loadSessions]);

    const handleNewSession = React.useCallback(async () => {
        console.log('handleNewSession called - current activeSessionId:', activeSession?.sessionID);
        
        // First, explicitly clear the active session
        setActiveSessionId(null);
        console.log('setActiveSessionId(null) called');
        
        // Then call the createNewSession function from the hook
        createNewSession();
        console.log('createNewSession() called');
        
        // Close mobile sidebar if open
        setIsSidebarOpen(false);
    }, [createNewSession, setActiveSessionId, activeSession?.sessionID]);

    const onSelectSession = (id: string) => {
        selectSession(id);
        router.push(`/chat/${id}`);
    };

    const showArtifactPanel = !!usersFound && usersFound.length > 0;

    return (
        <div
            className={`min-h-screen bg-white transition-opacity duration-600 ${
                isLoaded ? "opacity-100" : "opacity-0"
            }`}
        >
            {/* Main Layout */}
            <div className="h-screen">
                <ResizableLayout
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    createNewSession={handleNewSession}
                    sidebar={
                        <div className="hidden lg:block h-full">
                            <ChatSidebar
                                sessions={sessions}
                                activeSessionId={activeSession?.sessionID || null}
                                onSelectSession={onSelectSession}
                                onDeleteSession={deleteSession}
                                onNewSession={handleNewSession}
                                isOpen={true}
                                onClose={() => {}}
                                isCollapsed={isCollapsed}
                                setIsCollapsed={setIsCollapsed}
                            />
                        </div>
                    }
                    chatWindow={
                        <div className="flex flex-col h-full bg-white">
                            {/* Centered container with max‑width */}
                            <div className="flex flex-col h-full w-full">
                                {/* Mobile Header for sidebar toggle */}
                                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200/30 glass-effect">
                                    <h1 className="text-xl font-medium text-gray-800">circl</h1>
                                    <button
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="neumorphic-button p-2 rounded-lg transition-all duration-200 hover:scale-105"
                                    >
                                        <Menu className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                                    </button>
                                </div>

                                {/* Content area - this will change between pages */}
                                {children}
                            </div>
                        </div>
                    }
                    artifactPanel={
                        <ArtifactPanel usersFound={usersFound} isVisible={showArtifactPanel} />
                    }
                    showArtifactPanel={showArtifactPanel}
                />

                {/* Mobile Sidebar */}
                <div className="lg:hidden">
                    <ChatSidebar
                        sessions={sessions}
                        activeSessionId={activeSession?.sessionID || null}
                        onSelectSession={id => {
                            onSelectSession(id);
                            setIsSidebarOpen(false);
                        }}
                        onDeleteSession={deleteSession}
                        onNewSession={handleNewSession}
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed}
                    />
                </div>
            </div>
        </div>
    );
};

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ChatProvider>
            <ChatLayoutContent>{children}</ChatLayoutContent>
        </ChatProvider>
    );
} 