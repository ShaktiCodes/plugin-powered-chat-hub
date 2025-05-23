
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChatContext } from '@/contexts/ChatContext';

const ChatWindow: React.FC = () => {
  const { messages, isTyping } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full bg-background rounded-lg shadow-lg border border-border overflow-hidden chat-container">
      <div className="flex-none p-3 sm:p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <h2 className="text-base sm:text-lg font-semibold text-primary">AI Chat Interface</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Ask questions or use plugin commands
        </p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-2 sm:p-4 scrollbar-thin">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-center space-x-2 p-2 sm:p-3 typing-indicator mt-2">
            <div className="flex space-x-1">
              <span className="w-2 h-2 bg-primary/70 rounded-full animate-typing-dot-1"></span>
              <span className="w-2 h-2 bg-primary/70 rounded-full animate-typing-dot-2"></span>
              <span className="w-2 h-2 bg-primary/70 rounded-full animate-typing-dot-3"></span>
            </div>
            <span className="text-xs sm:text-sm text-foreground/70">Assistant is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput />
    </div>
  );
};

export default ChatWindow;
