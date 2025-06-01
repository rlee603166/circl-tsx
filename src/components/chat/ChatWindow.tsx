import React, { useRef, useEffect } from "react";
import { SingleMessage } from "@/types";
import { ChatMessage } from "./ChatMessage";

interface ChatWindowProps {
    messages: SingleMessage[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center fade-in-up">
                        <h2 className="text-2xl font-light text-gray-700 mb-2">Welcome to circl.</h2>
                        <p className="text-gray-500 font-light">
                            Your professional search engine. Start by describing who you're looking
                            for.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {messages.map(message => (
                        <ChatMessage key={message.messageID || message.createdAt.toString()} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                </>
            )}
        </div>
    );
};
