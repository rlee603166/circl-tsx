"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mic, ArrowUp, Sparkles, BrainCircuit, Lock } from "lucide-react";

import "./styles/WelcomeScreen.css";
import "./styles/ChatInterface.css";
import { searchService } from "@/services/searchService";
import { useAuth } from "@/hooks/useAuth";
import { MessageInput } from "./MessageInput";
import { useChat } from "@/hooks/useChat";

const AuthRequiredMessage = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Lock className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Authentication Required</h3>
        <p className="text-gray-600 text-center mb-4">
            Please log in to start searching and chatting.
        </p>
        <Button
            onClick={() => (window.location.href = "/log-in")}
            className="bg-gray-900 text-white hover:bg-gray-800"
        >
            Log In to Continue
        </Button>
    </div>
);

const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
    </div>
);


export default function WelcomeScreen() {
    const [inputValue, setInputValue] = useState("");
    const router = useRouter();
    const { loading, isAuthenticated, user } = useAuth();

    const handleSubmit = async (message: string) => {
        if (!message.trim()) return;

        if (!isAuthenticated) {
            alert("Please log in to continue");
            router.push("/log-in");
            return;
        }

        try {
            localStorage.setItem("userQuery", message.trim());
            const session_id = await searchService.createSession(user?.userID);

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

    return (
        <div className="chat-container">
            <main className="chat-main">
                <div className="welcome-container max-w-[750px] w-full px-4">
                    {isAuthenticated ? (
                        <>
                            <div className="welcome-text fade-in-up">
                                <h1 className="welcome-heading">
                                    {getGreeting()}
                                </h1>
                                <p className="welcome-subheading">How can I help you today?</p>
                            </div>
                           <MessageInput onSendMessage={handleSubmit} />
                        </>
                    ) : (
                        <AuthRequiredMessage />
                    )}
                </div>
            </main>
        </div>
    );
}
