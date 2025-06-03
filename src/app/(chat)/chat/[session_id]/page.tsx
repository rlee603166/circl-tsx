"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { MessageInput } from "@/components/chat/MessageInput";
import { User, SingleMessage } from "@/types";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
    const params = useParams();
    const router = useRouter();
    const session_id = params?.session_id as string;
    const { loading, isAuthenticated } = useAuth();

    const [usersFound, setUsersFound] = useState<User[]>([]);
    const [isManuallySelecting, setIsManuallySelecting] = useState(false);

    const {
        sessions,
        activeSession,
        isLoading,
        messages,
        addToSessionList,
        activeSessionId,
        sendMessage,
        selectSession,
        createSessionTab,
        loadSessions
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
        loadSessions();
    }, [loadSessions]);

    useEffect(() => {
        console.log("useEffect triggered", { loading, session_id, activeSessionId, hasStoredQuery: !!localStorage.getItem("userQuery"), isManuallySelecting });
        if (!loading && session_id && session_id !== activeSessionId && !isManuallySelecting) {
            console.log("Running boot for stored query");
            boot();
        }
    }, [session_id, loading, activeSessionId, selectSession, boot, sessions, isManuallySelecting]);

    useEffect(() => {
        setIsManuallySelecting(false);
    }, [session_id]);

    const handleSendMessage = async (message: string) => {
        await sendMessage(message, setUsersFound);
    };

    // Convert DraftMessage[] to SingleMessage[] for ChatWindow
    const convertedMessages: SingleMessage[] = messages.map(msg => ({
        messageID: msg.messageID || null,
        sessionID: msg.sessionID || null,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt || null,
    }));

    return (
        <>
            {/* Chat Window */}
            <ChatWindow messages={convertedMessages} />

            {/* Message Input */}
            <MessageInput
                onSendMessage={handleSendMessage}
                disabled={isLoading}
            />
        </>
    );
};

export default Index; 