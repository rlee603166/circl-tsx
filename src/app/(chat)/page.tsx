"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import WelcomeScreen from "@/components/chat/WelcomeScreen";
import { MessageInput } from "@/components/chat/MessageInput";
import { User } from "@/types";

const Index = () => {
    const [usersFound, setUsersFound] = useState<User[]>([]);
    
    const {
        sessions,
        isLoading,
        sendMessage,
        createNewSession,
        loadSessions,
    } = useChat();

    useEffect(() => {
        loadSessions();
        // Create initial Sessions if none exists
        if (sessions.length === 0) {
            createNewSession();
        }
    }, [sessions.length, createNewSession, loadSessions]);

    const handleSendMessage = async (message: string) => {
        await sendMessage(message, setUsersFound);
    };

    return (
        <>
            {/* Welcome Screen */}
            <WelcomeScreen />
            
            {/* Message Input */}
            <MessageInput
                onSendMessage={handleSendMessage}
                disabled={isLoading}
            />
        </>
    );
};

export default Index; 