import React, { createContext, useContext, ReactNode } from "react";
import { useChat } from "@/hooks/useChat";
import { Session, User, SearchResult, DraftMessage } from "@/types";

interface ChatContextType {
    sessions: Session[];
    activeSessionId: string | null;
    activeSession: Session | null;
    messages: DraftMessage[];
    searchResult: SearchResult | null;
    isLoading: boolean;
    addToSessionList: (newSession: Session) => void;
    createNewSession: () => void;
    createSessionTab: (sessionID: string, query: string) => Promise<void>;
    updateMessages: (session_id: string, content: string, role: "user" | "assistant") => void;
    sendMessage: (session_id: string, content: string, setUsersFound: (found: User[]) => void) => Promise<void>;
    selectSession: (id: string) => Promise<void>;
    deleteSession: (id: string) => void;
    loadSessions: () => Promise<void>;
    loadSessionMessages: (sessionId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const chatHook = useChat();

    return (
        <ChatContext.Provider value={chatHook}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return context;
}; 