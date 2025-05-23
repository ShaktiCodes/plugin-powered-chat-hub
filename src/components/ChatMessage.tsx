
import React from 'react';
import { Message } from '../types';
import { cn } from '@/lib/utils';
import { getPlugin } from '../plugins';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  // Format timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const renderPluginContent = () => {
    if (message.type !== 'plugin' || !message.pluginName || !message.pluginData) {
      return null;
    }
    
    const plugin = getPlugin(message.pluginName);
    if (!plugin) return null;
    
    return plugin.renderContent(message.pluginData);
  };
  
  return (
    <div 
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "max-w-[80%] p-4",
          isUser 
            ? "chat-message-user"
            : "chat-message-assistant"
        )}
      >
        {message.content && (
          <div className="mb-2 whitespace-pre-wrap">{message.content}</div>
        )}
        
        {message.type === 'plugin' && renderPluginContent()}
        
        <div 
          className={cn(
            "text-xs mt-2 flex justify-end",
            isUser ? "text-purple-200/80" : "text-blue-200/80"
          )}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
