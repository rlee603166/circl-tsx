
import React from 'react';

interface ThinkingIndicatorProps {
  text: string;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ text }) => {
  return (
    <div className="flex items-center space-x-3 px-6 py-4 glass-effect rounded-2xl rounded-bl-md border border-gray-200/30 shadow-lg">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full thinking-dots"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full thinking-dots"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full thinking-dots"></div>
      </div>
      <span className="text-gray-700 text-sm font-light">{text}</span>
    </div>
  );
};
