
export interface DraftMessage {
    messageID?: string;
    sessionID?: string;
    role: string;
    content: string;
    createdAt: Date;
    isThinking: boolean | null;
    thinkingText: string | null;
}
  

export interface SingleMessage {
    messageID:  string | null;
    sessionID:  string | null;
    role:       string;
    content:    string;
    createdAt:  Date | null;
    isThinking: boolean;
    thinkingText: string;
}

export interface User {
    userID:     string | null;
    firstName:  string;
    lastName:   string;
    email:      string;
    summary:    string
    pfpURL:     string;
}

export interface Session {
    sessionID:  string | null;
    userID:     string | null;
    title:      string | null;
    createdAt:  Date;
}

export interface SearchResult {
    professionals:  User[];
    query:          string;
    totalCount:     number;
}
