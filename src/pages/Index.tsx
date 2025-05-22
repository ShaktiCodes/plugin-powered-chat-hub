
import React from 'react';
import ChatWindow from '@/components/ChatWindow';
import { ChatProvider } from '@/contexts/ChatContext';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <div className="container mx-auto flex-grow flex flex-col max-w-3xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">AI Chat Interface</h1>
          <p className="text-muted-foreground">
            Chat with AI using plugin commands for enhanced functionality
          </p>
        </header>
        
        <div className="flex-grow">
          <ChatProvider>
            <ChatWindow />
          </ChatProvider>
        </div>
        
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>Available plugins: /weather [city], /calc [expression], /define [word]</p>
          <p className="mt-1">© 2025 AI Chat Interface</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
