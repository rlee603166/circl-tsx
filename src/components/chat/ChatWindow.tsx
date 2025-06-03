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
            {messages.map(message => (
                <ChatMessage key={message.messageID || message.createdAt?.toString()} message={message} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};
