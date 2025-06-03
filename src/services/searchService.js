import { ENDPOINTS } from "@/api.config.js";
import { authService } from "./AuthService";

export const searchService = {
    summarize: async (query, session_id, callbacks) => {
        if (!authService.isAuthenticated()) {
            throw new Error("Authentication required to access api");
        }

        const { onSummary, onStatus } = callbacks || {}; 

        try {
            const response = await authService.authenticatedFetch(
                `${ENDPOINTS.astralis}/summarize`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query, session_id }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    onStatus?.("Completed");
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                const lines = buffer.split("\n");
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.trim() && line.startsWith("data:")) {
                        try {
                            const jsonString = line.slice(5).trim();
                            if (!jsonString) continue;

                            const data = JSON.parse(jsonString);

                            switch (data.type) {
                                case "summary":
                                    onSummary?.(data.message);
                                    break;
                                case "error":
                                    console.error("Server error:", data.message);
                                    onStatus?.(`Error: ${data.message}`);
                                    throw new Error(data.message);
                            }
                        } catch (parseError) {
                            console.error("Error parsing line:", line, parseError);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Search error:", error);

            if (error.message.includes("Authentication")) {
                onStatus?.("Authentication error. Please log in again.");
                setTimeout(() => {
                    window.location.href = "/log-in";
                }, 2000);
            } else if (error.message.includes("Network")) {
                onStatus?.("Network error. Please check your connection.");
            } else {
                onStatus?.(`Error: ${error.message || "Failed to get response"}`);
            }

            throw error;
        }
    },

    createSession: async user_id => {
        if (!authService.isAuthenticated()) {
            throw new Error("Authentication required to create session");
        }

        try {
            const response = await authService.authenticatedFetch(ENDPOINTS.session, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id }),
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to create session: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            console.log("Session created:", data);
            return data.session_id;
        } catch (error) {
            console.error("Error creating session:", error);
            throw error;
        }
    },

    loadSession: async sessionId => {
        if (!authService.isAuthenticated()) {
            throw new Error("Authentication required to load session");
        }

        try {
            const response = await authService.authenticatedFetch(
                `${ENDPOINTS.session}/${sessionId}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    return [];
                }
                throw new Error(
                    `Failed to load session: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            return data.messages || [];
        } catch (error) {
            console.error("Error loading session:", error);
            throw error;
        }
    },

    search: async (session_id, query, callbacks) => {
        if (!authService.isAuthenticated()) {
            throw new Error("Authentication required to search");
        }

        const { onThought, onAction, onResponse, onStatus, onUsers, onFoundUsers } =
            callbacks || {};

        try {
            onStatus?.("Processing query...");

            const response = await authService.authenticatedFetch(`${ENDPOINTS.astralis}/query`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, session_id }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    onStatus?.("Completed");
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                const lines = buffer.split("\n");
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.trim() && line.startsWith("data:")) {
                        try {
                            const jsonString = line.slice(5).trim();
                            if (!jsonString) continue;

                            const data = JSON.parse(jsonString);

                            switch (data.type) {
                                case "thought":
                                    onThought?.(data.message);
                                    break;
                                case "action":
                                    onAction?.(data.message);
                                    break;
                                case "raw_action":
                                case "result":
                                    // onAction?.(data.message);
                                    break;
                                case "users":
                                    onUsers?.(data.message);
                                    break;
                                case "users_found":
                                    onFoundUsers?.(data.message);
                                    break;
                                case "response":
                                    onResponse?.(data.message);
                                    break;
                                case "status":
                                    onStatus?.(data.message);
                                    break;
                                case "end":
                                    onStatus?.("Completed");
                                    return;
                                case "error":
                                    console.error("Server error:", data.message);
                                    onStatus?.(`Error: ${data.message}`);
                                    throw new Error(data.message);
                            }
                        } catch (parseError) {
                            console.error("Error parsing line:", line, parseError);
                        }
                    }
                }

                onThought?.("");
            }
        } catch (error) {
            console.error("Search error:", error);

            if (error.message.includes("Authentication")) {
                onStatus?.("Authentication error. Please log in again.");
                setTimeout(() => {
                    window.location.href = "/log-in";
                }, 2000);
            } else if (error.message.includes("Network")) {
                onStatus?.("Network error. Please check your connection.");
            } else {
                onStatus?.(`Error: ${error.message || "Failed to get response"}`);
            }

            throw error;
        }
    },

    getUserSessions: async () => {
        if (!authService.isAuthenticated()) {
            throw new Error("Authentication required to get user sessions");
        }

        try {
            const response = await authService.authenticatedFetch(`${ENDPOINTS.session}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to get sessions: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error getting user sessions:", error);
            throw error;
        }
    },

    deleteSession: async sessionId => {
        if (!authService.isAuthenticated()) {
            throw new Error("Authentication required to delete session");
        }

        try {
            const response = await authService.authenticatedFetch(
                `${ENDPOINTS.session}/${sessionId}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to delete session: ${response.status} ${response.statusText}`
                );
            }

            return true;
        } catch (error) {
            console.error("Error deleting session:", error);
            throw error;
        }
    },
};
