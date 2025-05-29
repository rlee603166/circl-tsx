
import { useState, useCallback } from 'react';
import { Message, Conversation, Professional, SearchResult } from '@/types';

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setSearchResult(null);
    
    return newConversation.id;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!activeConversationId) return;

    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    // Add thinking indicator
    const thinkingMessage: Message = {
      id: generateId(),
      content: '',
      isUser: false,
      timestamp: new Date(),
      isThinking: true,
      thinkingText: 'Analyzing your request and searching for matching professionals...',
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage, thinkingMessage],
              title: conv.messages.length === 0 ? content.slice(0, 50) + '...' : conv.title,
              updatedAt: new Date(),
            }
          : conv
      )
    );

    // Simulate API call and streaming response
    setTimeout(() => {
      // Mock response
      const aiResponse: Message = {
        id: generateId(),
        content: `I found several professionals matching your criteria for "${content}". Here are the most relevant matches based on your search parameters. Each profile includes their expertise, current role, and contact information.`,
        isUser: false,
        timestamp: new Date(),
      };

      // Mock search results
      const mockProfessionals: Professional[] = [
        {
          id: '1',
          name: 'Sarah Chen',
          title: 'Senior Data Scientist',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          email: 'sarah.chen@techcorp.com',
          linkedin: 'https://linkedin.com/in/sarahchen',
          expertise: ['Machine Learning', 'Python', 'Data Analytics', 'AI Research'],
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b887?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: '2',
          name: 'Michael Rodriguez',
          title: 'Product Manager',
          company: 'InnovateLabs',
          location: 'New York, NY',
          email: 'm.rodriguez@innovatelabs.com',
          expertise: ['Product Strategy', 'User Research', 'Agile', 'Analytics'],
        },
        {
          id: '3',
          name: 'Emily Watson',
          title: 'UX Designer',
          company: 'DesignStudio',
          location: 'Austin, TX',
          expertise: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping'],
        }
      ];

      const newSearchResult: SearchResult = {
        professionals: mockProfessionals,
        query: content,
        totalCount: mockProfessionals.length,
      };

      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: [...conv.messages.filter(m => !m.isThinking), aiResponse],
                updatedAt: new Date(),
              }
            : conv
        )
      );

      setSearchResult(newSearchResult);
      setIsLoading(false);
    }, 2000);
  }, [activeConversationId]);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    // You could restore search results here if needed
    setSearchResult(null);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setSearchResult(null);
    }
  }, [activeConversationId]);

  return {
    conversations,
    activeConversation,
    searchResult,
    isLoading,
    createNewConversation,
    sendMessage,
    selectConversation,
    deleteConversation,
  };
};
