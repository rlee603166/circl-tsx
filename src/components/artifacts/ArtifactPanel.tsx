
import React, { useState } from 'react';
import { SearchResult } from '@/types';
import { UserCard } from './UserCard';
import { ChevronDown, ChevronUp, Users, Search } from 'lucide-react';

interface ArtifactPanelProps {
  searchResult: SearchResult | null;
  isVisible: boolean;
}

export const ArtifactPanel: React.FC<ArtifactPanelProps> = ({ searchResult, isVisible }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isVisible || !searchResult) return null;

  return (
    <div className="h-full bg-gray-50/80 backdrop-blur-xl border-l border-gray-200/50 flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/30 flex items-center justify-between bg-white/60">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100/80 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Search Results</h3>
              <p className="text-sm text-gray-500 font-light">
                {searchResult.totalCount} professionals found
              </p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="neumorphic-button p-2 rounded-lg transition-all duration-200 hover:scale-105"
        >
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white/40 to-gray-50/60">
          <div className="space-y-4">
            {searchResult.usersFound.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
          
          {searchResult.usersFound.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-gray-500 font-light">No professionals found for this search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
