"use client";

import React, { useState, useEffect, useCallback } from "react";
import ChatWindow from "@/components/chat/ChatWindow";
import { MessageInput } from "@/components/chat/MessageInput";
import { SingleMessage, UserFound } from "@/types";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useChatContext } from "@/contexts/ChatContext";

const Index = () => {
    const params = useParams();
    const router = useRouter();
    const session_id = params?.session_id as string;
    const { loading, isAuthenticated } = useAuth();
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
    } = useChatContext();

    useEffect(() => {
        console.log("session_id in Index: ", session_id);
    }, [session_id]);

    const boot = useCallback(async () => {
        try {
            const storedQuery = localStorage.getItem("userQuery");

            if (storedQuery) {
                localStorage.removeItem("userQuery");
                await createSessionTab(session_id, storedQuery);
                await sendMessage(session_id, storedQuery, true);
            } else {
                selectSession(session_id);
            }
        } catch (error) {
            console.error("Error in boot:", error);
            router.push("/");
        }
    }, [session_id, router, sendMessage, selectSession, createSessionTab]);

    useEffect(() => {
        if (!loading && session_id) {
            boot();
        }     
    }, [session_id, loading, boot]);

    useEffect(() => {
        setIsManuallySelecting(false);
    }, [session_id]);

    const handleSendMessage = async (message: string) => {
        await sendMessage(session_id, message, false);
    };

    // Convert DraftMessage[] to SingleMessage[] for ChatWindow
    const convertedMessages: SingleMessage[] = messages.map(msg => ({
        messageID: msg.messageID || null,
        sessionID: msg.sessionID || null,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt || null,
        isThinking: msg.isThinking || false,
        thinkingText: msg.thinkingText || "",
    }));

    return (
        <>
            {/* Chat Window */}
            <ChatWindow messages={convertedMessages} />

            {/* Message Input */}
            <MessageInput
                onSendMessage={handleSendMessage}
                disabled={isLoading}
                mode="chat"
            />
        </>
    );
};

export default Index; 