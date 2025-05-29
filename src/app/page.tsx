"use client";
import React, { useState, useEffect } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { MessageInput } from "@/components/chat/MessageInput";
import { ChatSidebar } from "@/components/sidebar/ChatSidebar";
import { ArtifactPanel } from "@/components/artifacts/ArtifactPanel";
import { ResizableLayout } from "@/components/layout/ResizableLayout";
import Header from "@/components/layout/Header";
import { useChat } from "@/hooks/useChat";
import { Menu } from "lucide-react";

const Index = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const {
        conversations,
        activeConversation,
        searchResult,
        isLoading,
        createNewConversation,
        sendMessage,
        selectConversation,
        deleteConversation,
    } = useChat();

    useEffect(() => {
        setIsLoaded(true);
        // Create initial conversation if none exists
        if (conversations.length === 0) {
            createNewConversation();
        }
    }, [conversations.length, createNewConversation]);

    const handleSendMessage = async (message: string) => {
        if (!activeConversation) {
            const newConvId = createNewConversation();
            // Wait for state update then send message
            setTimeout(() => sendMessage(message), 100);
        } else {
            await sendMessage(message);
        }
    };

    const handleNewConversation = () => {
        createNewConversation();
        setIsSidebarOpen(false);
    };

    const showArtifactPanel = !!searchResult && searchResult.professionals.length > 0;

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
                                conversations={conversations}
                                activeConversationId={activeConversation?.id || null}
                                onSelectConversation={selectConversation}
                                onDeleteConversation={deleteConversation}
                                onNewConversation={handleNewConversation}
                                isOpen={true}
                                onClose={() => {}}
                                isCollapsed={isCollapsed}
                                setIsCollapsed={setIsCollapsed}
                            />
                        </div>
                    }
                    chatWindow={
                        <div className="flex flex-col h-full">
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
                            <ChatWindow messages={activeConversation?.messages || []} />

                            {/* Message Input */}
                            <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
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
                        conversations={conversations}
                        activeConversationId={activeConversation?.id || null}
                        onSelectConversation={id => {
                            selectConversation(id);
                            setIsSidebarOpen(false);
                        }}
                        onDeleteConversation={deleteConversation}
                        onNewConversation={handleNewConversation}
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Index;
