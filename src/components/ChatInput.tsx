
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isTyping } = useChatContext();
  
  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;
    
    const messageToSend = message;
    setMessage('');
    await sendMessage(messageToSend);
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex space-x-2 p-2 sm:p-4 border-t border-border bg-card/50 backdrop-blur-sm"
    >
      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message or try a /command..."
        className="flex-grow bg-background/50 text-foreground border-primary/20 focus-visible:ring-primary/50 text-sm sm:text-base"
        disabled={isTyping}
      />
      <Button 
        type="submit" 
        size="icon"
        disabled={!message.trim() || isTyping}
        className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-9 w-9 sm:h-10 sm:w-10"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
