
import React, { useState } from 'react';
import { Conversation } from '@/types';
import { ConversationList } from './ConversationList';
import { Search, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div
        className={`fixed top-0 left-0 h-full bg-white/90 backdrop-blur-xl border-r border-gray-200/30 z-50 transform transition-all duration-300 lg:relative lg:translate-x-0 lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-16' : 'w-80'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-4 border-b border-gray-200/30 ${isCollapsed ? 'px-2' : 'px-6'}`}>
            <div className="flex items-center justify-between mb-4">
              {!isCollapsed && (
                <h2 className="text-lg font-medium text-gray-800">Conversations</h2>
              )}
              <div className="flex items-center space-x-2">
                <button
                  onClick={onNewConversation}
                  className="neumorphic-button p-2 rounded-lg transition-all duration-200 hover:scale-105"
                  title="New Conversation"
                >
                  <Plus className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:block neumorphic-button p-2 rounded-lg transition-all duration-200 hover:scale-105"
                  title={isCollapsed ? "Expand" : "Collapse"}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                  ) : (
                    <ChevronLeft className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="lg:hidden neumorphic-button p-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <X className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            
            {/* Search */}
            {!isCollapsed && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 glass-effect text-gray-800 placeholder-gray-500 font-light"
                />
              </div>
            )}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-4">
            {!isCollapsed ? (
              filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm font-light">
                    {searchTerm ? 'No conversations found' : 'No conversations yet'}
                  </p>
                </div>
              ) : (
                <ConversationList
                  conversations={filteredConversations}
                  activeConversationId={activeConversationId}
                  onSelectConversation={onSelectConversation}
                  onDeleteConversation={onDeleteConversation}
                />
              )
            ) : (
              // Collapsed view - show conversation icons
              <div className="space-y-2">
                {filteredConversations.slice(0, 10).map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`w-full p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
                      conversation.id === activeConversationId ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                    }`}
                    title={conversation.title}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium mx-auto">
                      {conversation.title.charAt(0).toUpperCase()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
