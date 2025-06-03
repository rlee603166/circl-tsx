import React from "react";
import { Session } from "@/types";
import { Trash2, MessageSquare } from "lucide-react";

interface SessionListProps {
    sessions: Session[];
    activeSessionId: string | null;
    onSelectSession: (id: string) => void;
    onDeleteSession: (id: string) => void;
}

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
                .typing-animation {
                    overflow: hidden;
                    white-space: nowrap;
                    animation: typing 1.2s steps(30, end), blink-caret 0.75s step-end infinite;
                    border-right: 2px solid transparent;
                    position: relative;
                    display: inline-block;
                    vertical-align: top;
                }
                
                .typing-animation.active {
                    border-right-color: #3b82f6;
                    animation: typing 1s steps(30, end), blink-caret 0.75s step-end infinite;
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
                
                @keyframes typing {
                    from {
                        width: 0;
                    }
                    to {
                        width: 100%;
                    }
                }
                
                @keyframes blink-caret {
                    from, to {
                        border-color: transparent;
                    }
                    50% {
                        border-color: #3b82f6;
                    }
                }
                
                .typing-complete {
                    border-right: none;
                }
            `}</style>
            {sessions.map(Session => {
                const isNewSession = Session.title === "";
                const titleText = isNewSession ? "New Conversation" : (Session.title || "");
                const needsFade = titleText.length > 20; // Approximate character limit for 180px

                return (
                    <div
                        key={Session.sessionID}
                        className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${activeSessionId === Session.sessionID
                            ? "bg-blue-50 border border-blue-200/50 active-session"
                            : "hover:bg-[#ebebeb] border border-transparent"
                            }`}
                        onClick={() => onSelectSession(Session.sessionID || "")}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                    <MessageSquare
                                        className="w-4 h-4 text-gray-400 flex-shrink-0"
                                        strokeWidth={1.5}
                                    />
                                    <h3 className="text-sm font-medium text-gray-800">
                                        {isNewSession ? (
                                            <div className={`typing-container ${needsFade ? 'with-fade' : ''}`}>
                                                <span
                                                    className="typing-animation inline-block"
                                                    style={{
                                                        animationDelay: '0.1s'
                                                    }}
                                                    onAnimationEnd={(e) => {
                                                        e.currentTarget.classList.add('typing-complete');
                                                        e.currentTarget.classList.remove('typing-animation');
                                                    }}
                                                >
                                                    {titleText}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className={`typing-container ${needsFade ? 'with-fade' : ''}`}>
                                                <span className="inline-block">
                                                    {titleText}
                                                </span>
                                            </div>
                                        )}
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
