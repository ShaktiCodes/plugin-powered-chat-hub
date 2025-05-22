
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
    <div className="flex flex-col h-full bg-background rounded-lg shadow-lg border border-border">
      <div className="flex-none p-4 border-b border-border">
        <h2 className="text-lg font-semibold">AI Chat Interface</h2>
        <p className="text-sm text-muted-foreground">
          Ask questions or use plugin commands
        </p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 scrollbar-thin">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="flex space-x-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dot-1"></span>
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dot-2"></span>
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dot-3"></span>
            </div>
            <span className="text-sm">Assistant is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput />
    </div>
  );
};

export default ChatWindow;
