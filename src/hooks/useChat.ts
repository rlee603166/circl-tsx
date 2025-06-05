// ── src/hooks/useChat.ts ──
import { useState, useCallback, useEffect } from "react";
import { Session, User, SearchResult, SingleMessage, DraftMessage, UserFound, ApiUserFound, mapApiUserFoundToUserFound } from "@/types";
import { useRouter } from "next/navigation";
import { searchService } from "@/services/searchService";
import { useAuth } from "@/hooks/useAuth";

export const useChat = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<DraftMessage[]>([]);
    const [usersFound, setUsersFound] = useState<UserFound[]>([]);

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
        setUsersFound([]);
    }, [router, activeSessionId]);

    const streamThought = useCallback(
        (session_id: string, chunk: string, tmp_id: string) => {
            if (!tmp_id) {
                console.warn('streamThought called without tmp_id');
                return;
            }
            
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
            if (!tmp_id) {
                console.warn('streamResponse called without tmp_id');
                return;
            }
            
            setMessages((prevMsgs) => {
                const newMsgs = [...prevMsgs];
                const responseId = `response_${tmp_id}`;
                console.log('responseId: ', responseId);
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

    const loadSessions = useCallback(async () => {
        const fetchedSessions = await searchService.getUserSessions();
        if (!fetchedSessions || fetchedSessions.length === 0) return;
        
        const sessionTypes: Session[] = fetchedSessions.map((session: any) => ({
            sessionID: session.session_id,
            title: session.title,
            createdAt: session.created_at,
            userID: session.user_id,
        }));
        
        // Merge with existing sessions to avoid duplicates
        setSessions((prev) => {
            const sessionMap = new Map<string, Session>();
            
            // Add existing sessions to map
            prev.forEach(session => {
                if (session.sessionID) {
                    sessionMap.set(session.sessionID, session);
                }
            });
            
            // Add/update with fetched sessions
            sessionTypes.forEach(session => {
                if (session.sessionID) {
                    sessionMap.set(session.sessionID, session);
                }
            });
            
            // Convert back to array and sort by most recent first
            const mergedSessions = Array.from(sessionMap.values());
            mergedSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
            return mergedSessions;
        });
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

    const updateMessages = useCallback(
        (session_id: string, content: string, role: "user" | "assistant", isInitial: boolean = false) => {

            const newMsg: DraftMessage = {
                messageID: generateTempId(),
                sessionID: session_id,
                role,
                content,
                createdAt: new Date(),
                isThinking: false,
                thinkingText: "",
            };

            if (isInitial) {
                setMessages([newMsg]);
            } else {
                setMessages((prev) => [...prev, newMsg]);
            }
        },
        [activeSessionId]
    );

    const sendMessage = useCallback(
        async (session_id: string, content: string, isInitial: boolean = false) => {
            console.log('session_id in sendMessage: ', session_id);
            updateMessages(session_id, content, "user", isInitial);

            setIsLoading(true);
            const collected: UserFound[] = [];

            try {
                await searchService.search(session_id, content, {
                    onThought: (chunk: string, tmp_id: string) => { streamThought(session_id, chunk, tmp_id) },
                    onResponse: (chunk: string, tmp_id: string) => { streamResponse(session_id, chunk, tmp_id) },
                    onFoundUsers: (user: ApiUserFound) => {
                        collected.push(mapApiUserFoundToUserFound(user));
                        setUsersFound([...collected]);
                    },
                });
            } finally {
                setIsLoading(false);
            }
        },
        [activeSessionId, streamThought, streamResponse, updateMessages]
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
                
                setSearchResult(null);
                setUsersFound([]);
                router.replace(`/chat/${sessionID}`);
                setActiveSessionId(sessionID);
                
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

    const selectSession = useCallback(
        async (id: string) => {
            setActiveSessionId(id);
            setSearchResult(null);
            setUsersFound([]);
            setMessages([]);
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
        setActiveSessionId,
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
