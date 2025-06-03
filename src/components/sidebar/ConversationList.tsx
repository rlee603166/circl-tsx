import React, { useState, useEffect } from "react";
import { Session } from "@/types";
import { Trash2, MessageSquare } from "lucide-react";

interface SessionListProps {
    sessions: Session[];
    activeSessionId: string | null;
    onSelectSession: (id: string) => void;
    onDeleteSession: (id: string) => void;
}

// Typing animation component
const TypingText: React.FC<{ text: string; isNewSession: boolean }> = ({ text, isNewSession }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (isNewSession) {
            setDisplayedText("Generating title...");
            return;
        }

        if (text && text !== displayedText && !isNewSession) {
            setIsTyping(true);
            setDisplayedText("");

            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex <= text.length) {
                    setDisplayedText(text.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    setIsTyping(false);
                    clearInterval(interval);
                }
            }, 30); // Type at 30ms per character

            return () => clearInterval(interval);
        } else if (!isNewSession) {
            setDisplayedText(text);
        }
    }, [text, isNewSession]);

    return (
        <span className={`${isNewSession ? "text-gray-500 italic" : ""} ${isTyping ? "typing-cursor" : ""}`}>
            {displayedText}
        </span>
    );
};

export const ConversationList: React.FC<SessionListProps> = ({
    sessions,
    activeSessionId,
    onSelectSession,
    onDeleteSession,
}) => {
    const formatDate = (date: Date) => {
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays} days ago`;

        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-2">
            <style jsx>{`
                .typing-cursor::after {
                    content: '|';
                    animation: blink 1s infinite;
                    color: #3b82f6;
                }
                
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
                
                .typing-container {
                    position: relative;
                    overflow: hidden;
                    white-space: nowrap;
                    max-width: 180px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                }
                
                .typing-container.with-fade::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 30px;
                    height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8));
                    pointer-events: none;
                    z-index: 1;
                    transition: all 0.2s ease;
                }
                
                .group:hover .typing-container.with-fade::after {
                    background: linear-gradient(to right, transparent, rgba(235, 235, 235, 0.95));
                    width: 50px;
                    right: 0;
                }
                
                .group.active-session .typing-container.with-fade::after {
                    background: linear-gradient(to right, transparent, rgba(239, 246, 255, 0.8));
                }
                
                .group.active-session:hover .typing-container.with-fade::after {
                    background: linear-gradient(to right, transparent, rgba(239, 246, 255, 0.95));
                    width: 50px;
                    right: 0;
                }
            `}</style>
            {sessions.map(Session => {
                const isNewSession = Session.title === "";
                const titleText = Session.title || "";
                const needsFade = titleText.length > 20; // Approximate character limit for 180px

                return (
                    <div
                        key={Session.sessionID}
                        className={`group relative p-[5px] rounded-lg cursor-pointer transition-all duration-200 ${activeSessionId === Session.sessionID
                            ? "bg-blue-50 border border-blue-200/50 active-session"
                            : "hover:bg-[#ebebeb] border border-transparent"
                            }`}
                        onClick={() => onSelectSession(Session.sessionID || "")}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    <MessageSquare
                                        className="w-4 h-4 text-gray-400 flex-shrink-0"
                                        strokeWidth={1.5}
                                    />
                                    <h3 className="text-sm font-small text-gray-800">
                                        <div className={`typing-container ${needsFade ? 'with-fade' : ''}`}>
                                            <TypingText 
                                                key={Session.sessionID} 
                                                text={titleText} 
                                                isNewSession={isNewSession} 
                                            />
                                        </div>
                                    </h3>
                                </div>
                                {/* <p className="text-xs text-gray-500 font-light">
                                {formatDate(Session.updatedAt)}
                            </p> */}
                            </div>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    onDeleteSession(Session.sessionID || "");
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 transition-all duration-200 relative z-10 bg-white/80 backdrop-blur-sm shadow-sm"
                            >
                                <Trash2
                                    className="w-4 h-4 text-red-500 hover:text-red-700"
                                    strokeWidth={1.5}
                                />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
