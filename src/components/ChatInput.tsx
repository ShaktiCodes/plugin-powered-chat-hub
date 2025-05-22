
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
      className="flex space-x-2 p-4 border-t border-border"
    >
      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message or try /weather, /calc, /define..."
        className="flex-grow bg-secondary text-secondary-foreground"
        disabled={isTyping}
      />
      <Button 
        type="submit" 
        size="icon"
        disabled={!message.trim() || isTyping}
        className="bg-primary hover:bg-primary/90"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
