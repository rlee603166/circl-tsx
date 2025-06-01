"use client";
import React, { useState, useEffect } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { MessageInput } from "@/components/chat/MessageInput";
import { ChatSidebar } from "@/components/sidebar/ChatSidebar";
import { ArtifactPanel } from "@/components/artifacts/ArtifactPanel";
import { ResizableLayout } from "@/components/layout/ResizableLayout";
import { useChat } from "@/hooks/useChat";
import { Menu } from "lucide-react";
import { User } from "@/types";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { searchService } from "@/services/searchService";
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
        activeSessionId,
        createNewSession,
        sendMessage,
        selectSession,
        loadSessionMessages
    } = useChat();

    useEffect(() => {
        const boot = async () => {
            try {
                const storedQuery = localStorage.getItem("userQuery");

                if (storedQuery) {
                    localStorage.removeItem("userQuery");
                    await sendMessage(storedQuery, setUsersFound);
                } else {
                    await loadSessionMessages(session_id);
                }
            } catch (error) {
                console.error("Error in boot:", error);
                router.push("/");
            }
        };

        if (!loading && session_id && session_id !== activeSessionId) {
            selectSession(session_id);
            boot();
        }
    }, [session_id, loading, activeSessionId, selectSession, loadSessionMessages, sendMessage, router]);

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
            />
        </div>
    );
};

export default Index;
