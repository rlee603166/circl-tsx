import React, { useState, useEffect } from "react";
import { Session } from "@/types";
import { Search, SquarePlus, X, PanelLeftClose, ChevronRight } from "lucide-react";
import { ConversationList } from "./ConversationList";

interface ChatSidebarProps {
    sessions: Session[];
    activeSessionId: string | null;
    onSelectSession: (id: string) => void;
    onDeleteSession: (id: string) => void;
    onNewSession: () => void;
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    sessions,
    activeSessionId,
    onSelectSession,
    onDeleteSession,
    onNewSession,
    isOpen,
    onClose,
    isCollapsed,
    setIsCollapsed,
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredsessions = sessions.filter(Session =>
        Session.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    );    
    
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed top-0 left-0 h-full bg-[#f9f9f9] backdrop-blur-xl border-r border-gray-200/30 z-50 transform transition-all duration-300 lg:relative lg:translate-x-0 lg:z-auto ${
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                } ${isCollapsed ? "w-0" : "w-60"}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200/30 px-2">
                        <div className="flex items-center justify-between mb-2 pl-3">
                            <h2 className="text-lg font-medium text-gray-800">sessions</h2>
                            <div
                                className="flex items-center space-x-2 hover:bg-[#ebebeb] focus:bg-[#ebebeb] cursor-pointer p-[4px] px-[6px] rounded-md"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                            >
                                <PanelLeftClose
                                    className="w-5 h-6 text-gray-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>

                        <div className="flex-col">
                            {/* “New Chat” button */}
                            <div className="relative cursor-pointer" onClick={onNewSession}>
                                <SquarePlus
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600"
                                    strokeWidth={2}
                                />
                                <div
                                    className="
                                        w-full pl-10 pr-4 py-2 text-sm rounded-lg
                                        bg-[#f9f9f9] hover:bg-[#ebebeb] transition-colors
                                        text-gray-900 placeholder-gray-500 font-light
                                        focus:outline-none
                                      "
                                >
                                    New Chat
                                </div>
                            </div>

                            {/* Search input */}
                            <div className="relative mt-2">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600"
                                    strokeWidth={2}
                                />
                                <input
                                    type="text"
                                    placeholder="Search sessions..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="
                                          w-full pl-10 pr-4 py-2 text-sm rounded-lg
                                          bg-[#f9f9f9] hover:bg-[#ebebeb] focus:bg-[#ebebeb] transition-colors
                                          text-gray-900 placeholder-gray-500 font-light
                                          focus:outline-none
                                        "
                                />
                            </div>
                        </div>
                    </div>

                    {/* Session List */}
                    <div className="flex-1 overflow-y-auto p-4 px-2">
                        {filteredsessions.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm font-light">
                                    {searchTerm ? "No sessions found" : "No sessions yet"}
                                </p>
                            </div>
                        ) : (
                            <ConversationList
                                sessions={filteredsessions}
                                activeSessionId={activeSessionId}
                                onSelectSession={onSelectSession}
                                onDeleteSession={onDeleteSession}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
