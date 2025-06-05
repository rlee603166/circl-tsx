"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, ArrowUp, Sparkles, BrainCircuit } from "lucide-react";

import "./styles/WelcomeScreen.css";
import "./styles/ChatInterface.css";
import { searchService } from "@/services/searchService";
import { useAuth } from "@/hooks/useAuth";
import { MessageInput } from "./MessageInput";
import { useChatContext } from "@/contexts/ChatContext";

const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
    </div>
);

export default function ChatWelcomeScreen() {
    const [inputValue, setInputValue] = useState("");
    const router = useRouter();
    const { loading, isAuthenticated, user } = useAuth();
    const { addToSessionList, loadSessions } = useChatContext();

    // Redirect to /welcome if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/welcome');
        }
    }, [loading, isAuthenticated, router]);

    const handleSubmit = async (message: string) => {
        if (!message.trim()) return;

        if (!isAuthenticated) {
            router.push("/welcome");
            return;
        }

        try {
            localStorage.setItem("userQuery", message.trim());
            const session_id = await searchService.createSession();
            router.push(`/chat/${session_id}`);
        } catch (err) {
            console.error("Error creating session:", err);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    // Only render the welcome screen if authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-start h-full pt-[22vh]">
            <div className="welcome-container max-w-[750px] w-full px-4">
                <div className="welcome-text fade-in-up">
                    <h1 className="welcome-heading">
                        {getGreeting()}
                    </h1>
                    <p className="welcome-subheading">How can I help you today?</p>
                </div>
                <MessageInput onSendMessage={handleSubmit} mode="welcome" />
            </div>
        </div>
    );
}
