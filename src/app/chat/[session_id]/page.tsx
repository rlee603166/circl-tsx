"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useChat } from "@/hooks/useChat";
import { User } from "@/types";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Interface from "@/components/chat/Inteface";

const Index = () => {
    const params = useParams();
    const router = useRouter();
    const session_id = params?.session_id as string;
    const { loading, isAuthenticated } = useAuth();

    const [usersFound, setUsersFound] = useState<User[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const {
        sessions,
        activeSession,
        searchResult,
        isLoading,
        messages,
        addToSessionList,
        activeSessionId,
        createNewSession,
        sendMessage,
        selectSession,
        deleteSession,
        loadSessionMessages,
        createSessionTab
    } = useChat();

    const boot = useCallback(async () => {
        try {
            const storedQuery = localStorage.getItem("userQuery");

            if (storedQuery) {
                addToSessionList({
                    sessionID: session_id,
                    title: "",
                    createdAt: new Date(),
                    userID: null,
                });
                localStorage.removeItem("userQuery");
                await createSessionTab(session_id, storedQuery);
            }
        } catch (error) {
            console.error("Error in boot:", error);
            router.push("/");
        }
    }, [session_id, addToSessionList, createSessionTab, router]);

    useEffect(() => {
        if (!loading && session_id && session_id !== activeSessionId) {
            const storedQuery = localStorage.getItem("userQuery");
            
            if (storedQuery) {
                boot();
            } else {
                selectSession(session_id);
            }
        }
    }, [session_id, loading, activeSessionId, selectSession, boot]);

    const handleSendMessage = async (message: string) => {
        await sendMessage(message, setUsersFound);
    };

    const handleNewSession = () => {
        createNewSession();
        setIsSidebarOpen(false);
    };

    return (
        <div>
            <Interface
                modeType={"chat"}
                handleNewSession={handleNewSession}
                handleSendMessage={handleSendMessage}
                showArtifactPanel={usersFound.length > 0}
                sessions={sessions}
                activeSession={activeSession}
                searchResult={searchResult}
                isLoading={isLoading}
                messages={messages}
                selectSession={selectSession}
                deleteSession={deleteSession}
            />
        </div>
    );
};

export default Index;
