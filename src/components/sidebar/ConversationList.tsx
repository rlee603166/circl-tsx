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
            {sessions.map(Session => (
                <div
                    key={Session.id}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        activeSessionId === Session.id
                            ? "bg-blue-50 border border-blue-200/50"
                            : "hover:bg-[#ebebeb] border border-transparent"
                    }`}
                    onClick={() => onSelectSession(Session.id)}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                                <MessageSquare
                                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                                    strokeWidth={1.5}
                                />
                                <h3 className="text-sm font-medium text-gray-800 truncate">
                                    {Session.title}
                                </h3>
                            </div>
                            <p className="text-xs text-gray-500 font-light">
                                {formatDate(Session.updatedAt)}
                            </p>
                        </div>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                onDeleteSession(Session.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 transition-all duration-200"
                        >
                            <Trash2
                                className="w-4 h-4 text-red-400 hover:text-red-600"
                                strokeWidth={1.5}
                            />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
