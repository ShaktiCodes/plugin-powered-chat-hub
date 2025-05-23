
import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import PluginManager from './PluginManager';
import { useChatContext } from '@/contexts/ChatContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const ChatWindow: React.FC = () => {
  const { messages, isTyping } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPluginManagerOpen, setIsPluginManagerOpen] = useState(false);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <>
      <div className="flex flex-col h-full bg-background rounded-lg shadow-lg border border-border overflow-hidden chat-container">
        <div className="flex-none p-3 sm:p-4 border-b border-border bg-card/50 backdrop-blur-sm flex justify-between items-center">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-primary">AI Chat Interface</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ask questions or use plugin commands
            </p>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setIsPluginManagerOpen(true)} 
            title="Plugin Manager"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
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
      
      <Dialog open={isPluginManagerOpen} onOpenChange={setIsPluginManagerOpen}>
        <DialogContent className="sm:max-w-md">
          <PluginManager onClose={() => setIsPluginManagerOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatWindow;
