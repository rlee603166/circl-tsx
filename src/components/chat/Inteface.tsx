"use client";

import React, { useState, useEffect } from "react";
import ChatWindow from "@/components/chat/ChatWindow";
import { MessageInput } from "@/components/chat/MessageInput";
import { ChatSidebar } from "@/components/sidebar/ChatSidebar";
import { ArtifactPanel } from "@/components/artifacts/ArtifactPanel";
import { ResizableLayout } from "@/components/layout/ResizableLayout";
import WelcomeScreen from "./WelcomeScreen";
import { Menu } from "lucide-react";
import { Session, SearchResult, DraftMessage, SingleMessage } from "@/types";
import { useRouter } from "next/navigation";

const Interface = ({ 
    modeType = "welcome", 
    handleNewSession,
    handleSendMessage,
    showArtifactPanel,
    sessions,
    activeSession,
    searchResult,
    isLoading,
    messages,
    selectSession,
    deleteSession
}: {
    modeType?: string;
    handleNewSession: () => void;
    handleSendMessage: (message: string) => void;
    showArtifactPanel: boolean;
    sessions: Session[];
    activeSession: Session | null;
    searchResult: SearchResult | null;
    isLoading: boolean;
    messages: DraftMessage[];
    selectSession: (id: string) => void;
    deleteSession: (id: string) => void;
}) => {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Convert DraftMessage[] to SingleMessage[] for ChatWindow
    const convertedMessages: SingleMessage[] = messages.map(msg => ({
        messageID: msg.messageID || null,
        sessionID: msg.sessionID || null,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt || null,
    }));

    const onSelectSession = (id: string) => {
        selectSession(id);
        router.push(`/chat/${id}`);
    };

    return (
        <div
            className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 transition-opacity duration-600 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        >
            {/* Main Layout */}
            <div className="h-screen">
                <ResizableLayout
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
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
                            <div className="flex flex-col h-full w-full max-w-[750px] mx-auto">
                                {/* Mobile Header for sidebar toggle */}
                                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200/30 glass-effect">
                                    <h1 className="text-xl font-medium text-gray-800">Circl</h1>
                                    <button
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="neumorphic-button p-2 rounded-lg transition-all duration-200 hover:scale-105"
                                    >
                                        <Menu className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                                    </button>
                                </div>

                                {/* Chat Window */}
                                {modeType === "chat" ? (
                                    <ChatWindow messages={convertedMessages} />
                                ) : (
                                    <WelcomeScreen />
                                )}

                                {/* Message Input */}
                                {modeType === "chat" && <MessageInput
                                    onSendMessage={handleSendMessage}
                                    disabled={isLoading}
                                />}
                            </div>
                        </div>
                    }
                    artifactPanel={
                        <ArtifactPanel searchResult={searchResult} isVisible={showArtifactPanel} />
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

export default Interface;
