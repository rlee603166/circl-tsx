import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { SingleMessage } from "@/types";
import "./styles/Scrollbar.css";

interface ChatWindowProps {
    messages: SingleMessage[];
    className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, className = "" }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className={`flex flex-col h-full ${className}`}>
            <div className="flex-1 overflow-y-auto custom-scrollbar pl-[10px]">
                <div className="space-y-2 min-h-full max-w-[750px] mx-auto py-12">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <div className="text-lg font-medium mb-2">No messages yet</div>
                                <div className="text-sm">Start a conversation!</div>
                            </div>
                        </div>
                    ) : (
                        messages.map(message => (
                            <ChatMessage key={message.messageID} message={message} />
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
