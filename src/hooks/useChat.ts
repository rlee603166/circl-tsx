// ── src/hooks/useChat.ts ──
import { useState, useCallback, useEffect } from "react";
import { Session, User, SearchResult, SingleMessage, DraftMessage } from "@/types";
import { useRouter } from "next/navigation";
import { searchService } from "@/services/searchService";

export const useChat = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<DraftMessage[]>([]);

    const router = useRouter();
    const activeSession = sessions.find((c) => c.sessionID === activeSessionId) || null;

    const generateTempId = () => Math.random().toString(36).substr(2, 9);

    const addToSessionList = useCallback((newSession: Session) => {
        setSessions((prev) => [newSession, ...prev]);
    }, []);

    const createNewSession = useCallback(() => {
        router.push("/");
        setActiveSessionId(null);
        setSearchResult(null);
        setMessages([]);
    }, []);

    const createSessionTab = useCallback(
        async (sessionID: string, query: string) => {
            setActiveSessionId(sessionID);

            try {
                let titleBuffer = "";
                let updateTimer: NodeJS.Timeout | null = null;
                
                const batchedTitleUpdate = () => {
                    if (titleBuffer) {
                        setSessions((prev) => {
                            const newSessions = [...prev];
                            const idx = newSessions.findIndex((c) => c.sessionID === sessionID);
                            if (idx !== -1) {
                                newSessions[idx] = {
                                    ...newSessions[idx],
                                    title: titleBuffer
                                };
                            }
                            return newSessions;
                        });
                    }
                };

                await searchService.summarize(query, sessionID, {
                    onSummary: (message: string) => {
                        titleBuffer += message;
                        
                        // Clear existing timer and set a new one
                        if (updateTimer) {
                            clearTimeout(updateTimer);
                        }
                        
                        // Batch updates every 50ms to reduce re-renders
                        updateTimer = setTimeout(batchedTitleUpdate, 50);
                    },
                });
                
                // Ensure final update happens
                if (updateTimer) {
                    clearTimeout(updateTimer);
                }
                batchedTitleUpdate();
                
            } catch (error) {
                console.error("Error creating session tab:", error);
            }
        },
        []
    );

    const updateMessages = useCallback(
        (content: string, role: "user" | "assistant") => {
            if (!activeSessionId) return;

            const newMsg: DraftMessage = {
                messageID: undefined,
                sessionID: activeSessionId,
                role,
                content,
                createdAt: new Date(),
            };

            setMessages((prev) => [...prev, newMsg]);
        },
        [activeSessionId]
    );

    const streamThought = useCallback(
        (chunk: string) => {
            setMessages((prevMsgs) => {
                const newMsgs = [...prevMsgs];
                if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === "assistant") {
                    const last = newMsgs[newMsgs.length - 1];
                    newMsgs[newMsgs.length - 1] = {
                        ...last,
                        content: last.content + chunk,
                    };
                } else {
                    newMsgs.push({
                        messageID: undefined,
                        sessionID: activeSessionId || undefined,
                        role: "assistant",
                        content: chunk,
                        createdAt: new Date(),
                    });
                }
                return newMsgs;
            });
        },
        [activeSessionId]
    );

    const streamResponse = useCallback((chunk: string) => {
        setMessages((prevMsgs) => {
            const newMsgs = [...prevMsgs];
            if (newMsgs.length === 0) return newMsgs;

            const last = newMsgs[newMsgs.length - 1];
            newMsgs[newMsgs.length - 1] = {
                ...last,
                content: last.content + chunk,
            };
            return newMsgs;
        });
    }, []);

    const sendMessage = useCallback(
        async (content: string, setUsersFound: (found: User[]) => void) => {
            if (!activeSessionId) return;
            updateMessages(content, "user");

            setIsLoading(true);
            const collected: User[] = [];

            try {
                await searchService.search(activeSessionId, content, {
                    onThought: streamThought,
                    onResponse: streamResponse,
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
        const sessionTypes: Session[] = fetchedSessions.map((session: any) => ({
            sessionID: session.session_id,
            title: session.title,
            createdAt: session.created_at,
            userID: session.user_id,
        }));
        setSessions([...sessionTypes]);
    }, []);

    const loadSessionMessages = useCallback(
        async (sessionId: string) => {
            try {
                const pastMessages: SingleMessage[] = await searchService.loadSession(sessionId);

                // Convert each SingleMessage into a DraftMessage (all fields present)
                const draftMsgs: DraftMessage[] = pastMessages.map((m) => ({
                    messageID: m.messageID ?? undefined,
                    sessionID: m.sessionID ?? undefined,
                    role: m.role,
                    content: m.content,
                    createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
                }));

                setMessages(draftMsgs);
            } catch (error) {
                console.error("Error loading session messages:", error);
                setMessages([]);
            }
        },
        []
    );

    // ─── When the user clicks on a session tab
    const selectSession = useCallback(
        async (id: string) => {
            setActiveSessionId(id);
            setSearchResult(null);
            await loadSessionMessages(id);
        },
        [loadSessionMessages]
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
        sendMessage,
        selectSession,
        deleteSession,
        loadSessions,
        loadSessionMessages,
    };
};
