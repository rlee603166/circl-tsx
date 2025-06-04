// ── src/hooks/useChat.ts ──
import { useState, useCallback, useEffect } from "react";
import { Session, User, SearchResult, SingleMessage, DraftMessage } from "@/types";
import { useRouter } from "next/navigation";
import { searchService } from "@/services/searchService";
import { useAuth } from "@/hooks/useAuth";

export const useChat = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<DraftMessage[]>([]);

    const router = useRouter();
    const { user } = useAuth();
    const activeSession = sessions.find((c) => c.sessionID === activeSessionId) || null;

    const generateTempId = () => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `temp-${timestamp}-${random}`;
    };

    const addToSessionList = useCallback((newSession: Session) => {
        setSessions((prev) => {
            const newSessions = [newSession, ...prev];
            // Sort sessions by most recent first after adding
            newSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return newSessions;
        });
    }, []);

    const createNewSession = useCallback(() => {
        router.push("/");
        setActiveSessionId(null);
        setSearchResult(null);
        setMessages([]);
    }, []);

    const updateMessages = useCallback(
        (session_id: string, content: string, role: "user" | "assistant") => {

            const newMsg: DraftMessage = {
                messageID: generateTempId(),
                sessionID: session_id,
                role,
                content,
                createdAt: new Date(),
                isThinking: false,
                thinkingText: "",
            };

            setMessages((prev) => [...prev, newMsg]);
        },
        [activeSessionId]
    );

    const streamThought = useCallback(
        (session_id: string, chunk: string, tmp_id: string) => {
            setMessages((prevMsgs) => {
                const newMsgs = [...prevMsgs];
                const thoughtId = `${tmp_id}_thought`;
                console.log('thoughtId: ', thoughtId);
                const existingIndex = newMsgs.findIndex(msg => msg.messageID === thoughtId);
                
                if (existingIndex !== -1) {
                    const existing = newMsgs[existingIndex];
                    newMsgs[existingIndex] = {
                        ...existing,
                        content: existing.content + chunk,
                    };
                } else {
                    newMsgs.push({
                        messageID: thoughtId,
                        sessionID: session_id,
                        role: "assistant",
                        content: chunk,
                        createdAt: new Date(),
                        isThinking: true,
                        thinkingText: "",
                    });
                }
                return newMsgs;
            });
        },
        []
    );

    const streamResponse = useCallback(
        (session_id: string, chunk: string, tmp_id: string) => {
            setMessages((prevMsgs) => {
                const newMsgs = [...prevMsgs];
                const responseId = `response_${tmp_id}`;
                const existingIndex = newMsgs.findIndex(msg => msg.messageID === responseId);

                if (existingIndex !== -1) {
                    const existing = newMsgs[existingIndex];
                    newMsgs[existingIndex] = {
                        ...existing,
                        content: existing.content + chunk,
                    };
                } else {
                    newMsgs.push({
                        messageID: responseId,
                        sessionID: session_id,
                        role: "assistant",
                        content: chunk,
                        createdAt: new Date(),
                        isThinking: false,
                        thinkingText: "",
                    });
                }
                return newMsgs;
            });
        }, 
        []
    );

    const sendMessage = useCallback(
        async (session_id: string, content: string, setUsersFound: (found: User[]) => void) => {
            console.log('session_id in sendMessage: ', session_id);
            updateMessages(session_id, content, "user");

            setIsLoading(true);
            const collected: User[] = [];

            try {
                await searchService.search(session_id, content, {
                    onThought: (chunk: string, tmp_id: string) => { streamThought(session_id, chunk, tmp_id) },
                    onResponse: (chunk: string, tmp_id: string) => { streamResponse(session_id, chunk, tmp_id) },
                    onFoundUsers: (user: User) => {
                        collected.push(user);
                        setUsersFound([...collected]);
                    },
                });
            } finally {
                setIsLoading(false);
            }
        },
        [activeSessionId, streamThought, streamResponse, updateMessages]
    );

    const loadSessions = useCallback(async () => {
        const fetchedSessions = await searchService.getUserSessions();
        if (!fetchedSessions || fetchedSessions.length === 0) return;
        
        const sessionTypes: Session[] = fetchedSessions.map((session: any) => ({
            sessionID: session.session_id,
            title: session.title,
            createdAt: session.created_at,
            userID: session.user_id,
        }));
        
        // Sort sessions by most recent first
        sessionTypes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setSessions([...sessionTypes]);
    }, []);

    const loadSessionMessages = useCallback(
        async (sessionId: string) => {
            try {
                const pastMessages: SingleMessage[] = await searchService.loadSession(sessionId);

                const draftMsgs: DraftMessage[] = pastMessages.map((m) => ({
                    messageID: m.messageID ?? undefined,
                    sessionID: m.sessionID ?? undefined,
                    role: m.role,
                    content: m.content,
                    createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
                    isThinking: false,
                    thinkingText: "",
                }));

                setMessages(draftMsgs);
            } catch (error) {
                console.error("Error loading session messages:", error);
                setMessages([]);
            }
        },
        []
    );

    const selectSession = useCallback(
        async (id: string) => {
            setActiveSessionId(id);
            setSearchResult(null);
            await loadSessionMessages(id);
        },
        [loadSessionMessages]
    );

    const createSessionTab = useCallback(
        async (sessionID: string, query: string) => {
            try {
                addToSessionList({
                    sessionID: sessionID,
                    title: "",
                    createdAt: new Date(),
                    userID: user?.userID || null,
                });
                
                router.replace(`/chat/${sessionID}`);
                setActiveSessionId(sessionID);
                setSearchResult(null);
                
                const summary = await searchService.summarize(query, sessionID);
                
                setSessions((prev) => 
                    prev.map((session) =>
                        session.sessionID === sessionID
                            ? { ...session, title: summary }
                            : session
                    )
                );

            } catch (error) {
                console.error("Error creating session tab:", error);
                throw error;
            } 
        },
        [addToSessionList, router, user?.userID]
    );

    // ─── Delete a session entirely
    const deleteSession = useCallback(
        (id: string) => {
            setSessions((prev) => prev.filter((c) => c.sessionID !== id));
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
        // Expose `DraftMessage[]` here. Components can treat messageID as possibly `undefined`.
        messages,
        searchResult,
        isLoading,
        addToSessionList,
        createNewSession,
        createSessionTab,
        updateMessages,
        sendMessage,
        selectSession,
        deleteSession,
        loadSessions,
        loadSessionMessages,
    };
};
