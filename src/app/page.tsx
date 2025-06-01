"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import Interface from "@/components/chat/Inteface";
import { User } from "@/types";

const Index = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [usersFound, setUsersFound] = useState<User[]>([]);

    const {
        sessions,
        activeSession,
        searchResult,
        isLoading,
        createNewSession,
        sendMessage,
        selectSession,
        deleteSession,
    } = useChat();

    useEffect(() => {
        setIsLoaded(true);
        // Create initial Sessions if none exists
        if (sessions.length === 0) {
            createNewSession();
        }
    }, [sessions.length, createNewSession]);

    const handleSendMessage = async (message: string) => {
        if (!activeSession) {
            const newConvId = createNewSession();
            // Wait for state update then send message
            setTimeout(() => sendMessage(message, setUsersFound), 100);
        } else {
            await sendMessage(message, setUsersFound);
        }
    };

    const handleNewSessions = () => {
        createNewSession();
        setIsSidebarOpen(false);
    };

    const showArtifactPanel = !!searchResult && searchResult.professionals.length > 0;

    return (
        <div>
            <Interface 
                modeType={"welcome"} 
                handleNewSession={handleNewSessions} 
                handleSendMessage={handleSendMessage} 
                showArtifactPanel={showArtifactPanel} 
            />
        </div>
    );
};

export default Index;
