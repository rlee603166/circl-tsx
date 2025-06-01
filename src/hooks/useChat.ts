import { useState, useCallback } from "react";
import { Session, User, SearchResult, SingleMessage, CreateMessage } from "@/types";
import { useRouter } from "next/navigation";
import { searchService } from "@/services/searchService";

export const useChat = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<SingleMessage[]>([]);

    const router = useRouter();
    const activeSession = sessions.find(c => c.sessionID === activeSessionId);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addToSessionList = useCallback((newSession: Session) => {
        setSessions(prev => [newSession, ...prev]);
    }, []);

    const createNewSession = useCallback(() => {
        setActiveSessionId(null);
        setSearchResult(null);
        setMessages([]);
    }, []);

    const updateMessages = useCallback((content: string, role: string) => {
        if (!activeSessionId) return;
        
        const newMessage: CreateMessage = {
            role,
            content,
        };

        // [TODO]: Send api request to create message in the backend

        const fromBackend: SingleMessage = {
            messageID: generateId(),
            sessionID: activeSessionId,
            role,
            content,
            createdAt: new Date(),
        };
        
        setMessages(prev => [...prev, fromBackend]);
    }, [activeSessionId]);

    const streamThought = useCallback((chunk: string) => {
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "assistant") {
                // Update existing assistant message
                const lastMessage = newMessages[newMessages.length - 1];
                newMessages[newMessages.length - 1] = {
                    ...lastMessage,
                    content: lastMessage.content + chunk
                };
            } else {
                // Create new assistant message
                newMessages.push({
                    messageID: generateId(),
                    sessionID: activeSessionId,
                    role: "assistant",
                    content: chunk,
                    createdAt: new Date(),
                });
            }
            return newMessages;
        });
    }, [activeSessionId]);

    const streamResponse = useCallback((chunk: string) => {
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            const lastMessage = newMessages[newMessages.length - 1];
            
            // Update the content of the last message
            newMessages[newMessages.length - 1] = {
                ...lastMessage,
                content: lastMessage.content + chunk
            };
            
            return newMessages;
        });
    }, []);

    const sendMessage = useCallback(
        async (
            content: string,
            setUsersFound: (prev: User[]) => void
        ) => {
            if (!activeSessionId) return;
            
            // Add user message immediately
            updateMessages(content, "user");
            
            setIsLoading(true);
            const collected: any[] = [];
            try {
                await searchService.search(activeSessionId, content, {
                    onThought: streamThought,
                    onResponse: streamResponse,
                    onFoundUsers: (message: string) => {
                        collected.push(message);
                        setUsersFound([...collected]);
                    },
                });
            } finally {
                setIsLoading(false);
            }
        },
        [activeSessionId, streamThought, streamResponse, updateMessages]
    );

    const loadSessionMessages = useCallback(async (sessionId: string) => {
        try {
            const pastMessages = await searchService.loadSession(sessionId);
            if (pastMessages && pastMessages.length > 0) {
                setMessages(pastMessages);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error("Error loading session messages:", error);
            setMessages([]);
        }
    }, []);

    const selectSession = useCallback(async (id: string) => {
        setActiveSessionId(id);
        setSearchResult(null);
        await loadSessionMessages(id);
    }, [loadSessionMessages]);

    const deleteSession = useCallback(
        (id: string) => {
            setSessions(prev => prev.filter(c => c.sessionID !== id));
            if (activeSessionId === id) {
                setActiveSessionId(null);
                setSearchResult(null);
                setMessages([]);
            }
        },
        [activeSessionId]
    );

    return {
        sessions,
        activeSessionId,
        activeSession,
        messages,
        searchResult,
        isLoading,
        addToSessionList,
        createNewSession,
        sendMessage,
        selectSession,
        deleteSession,
        loadSessionMessages,
    };
};
