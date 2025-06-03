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

    const generateTempId = () => Math.random().toString(36).substr(2, 9);

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
                // First create the backend session to get a real session ID
                const realSessionId = await searchService.createSession(user?.userID || null);
                
                // Add temporary session with empty title for loading state
                addToSessionList({
                    sessionID: realSessionId,
                    title: "", // Empty title triggers typing animation
                    createdAt: new Date(),
                    userID: user?.userID || null,
                });
                
                // Update URL to use real session ID and select the session
                router.replace(`/chat/${realSessionId}`);
                setTimeout(() => selectSession(realSessionId), 0);
                
                // Then get the summary using the real session ID
                const summary = await searchService.summarize(query, realSessionId);
                
                // Update the session with the summary title
                setSessions((prev) => 
                    prev.map((session) =>
                        session.sessionID === realSessionId
                            ? { ...session, title: summary }
                            : session
                    )
                );
            } catch (error) {
                console.error("Error creating session tab:", error);
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
        sendMessage,
        selectSession,
        deleteSession,
        loadSessions,
        loadSessionMessages,
    };
};
