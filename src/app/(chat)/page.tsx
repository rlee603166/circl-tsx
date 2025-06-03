"use client";

import React, { useEffect } from "react";
import { useChatContext } from "@/contexts/ChatContext";
import WelcomeScreen from "@/components/chat/WelcomeScreen";

const Index = () => {
    const {
        sessions,
        isLoading,
        createNewSession,
        loadSessions,
    } = useChatContext();

    useEffect(() => {
        loadSessions();
        // Create initial Sessions if none exists
        if (sessions.length === 0) {
            createNewSession();
        }
    }, [sessions.length, createNewSession, loadSessions]);

    return (
        <>
            {/* Welcome Screen */}
            <WelcomeScreen />
        </>
    );
};

export default Index; 