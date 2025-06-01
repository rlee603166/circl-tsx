import React from 'react';
import { SingleMessage } from '@/types';
import { ThinkingIndicator } from './ThinkingIndicator';

interface ChatMessageProps {
  message: SingleMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  // if (message.isThinking) {
  //   return (
  //     <div className="flex justify-start mb-6 fade-in-up">
  //       <div className="max-w-3xl">
  //         <ThinkingIndicator text={message.thinkingText || "Searching for professionals..."} />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={`flex mb-6 fade-in-up ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl ${message.role === 'user'  ? 'order-1' : 'order-2'}`}>
        {message.role === 'user' ? (
          // User message - keep the pill bubble design
          <div className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-4 rounded-br-md shadow-lg">
            <div className="prose prose-sm max-w-none">
              {message.content.split('\n').map((line, index) => (
                <p key={index} className={`${index === 0 ? 'mt-0' : 'mt-2'} text-white`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ) : (
          // AI message - essay-like style without bubble
          <div className="mr-4">
            <div className="prose prose-gray max-w-none">
              {message.content.split('\n').map((line, index) => (
                <p key={index} className={`${index === 0 ? 'mt-0' : 'mt-4'} text-gray-800 leading-relaxed font-light`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
        <div className={`text-xs text-gray-500 mt-2 px-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};
