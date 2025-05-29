
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isThinking?: boolean;
  thinkingText?: string;
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  company: string;
  location?: string;
  email?: string;
  linkedin?: string;
  expertise?: string[];
  avatar?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResult {
  professionals: Professional[];
  query: string;
  totalCount: number;
}
