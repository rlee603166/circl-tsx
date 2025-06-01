
export interface CreateMessage {
    role:       string;
    content:    string;
}

export interface SingleMessage {
    messageID:  string | null;
    sessionID:  string | null;
    role:       string;
    content:    string;
    createdAt:  Date;
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
    userID:     string;
    title:      string;
    messages:   [];
    createdAt:  Date;
}

export interface SearchResult {
    professionals:  User[];
    query:          string;
    totalCount:     number;
}
