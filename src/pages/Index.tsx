
import React from 'react';
import ChatWindow from '@/components/ChatWindow';
import { ChatProvider } from '@/contexts/ChatContext';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-2 sm:p-4">
      <div className="container mx-auto flex-grow flex flex-col max-w-3xl">
        <header className="mb-4 sm:mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-primary">AI Chat Interface</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Chat with AI using plugin commands for enhanced functionality
          </p>
        </header>
        
        <div className="flex-grow">
          <ChatProvider>
            <ChatWindow />
          </ChatProvider>
        </div>
        
        <footer className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>Available plugins: /weather [city], /calc [expression], /define [word], /gemini [prompt]</p>
          <p className="mt-1">✨ New: Custom plugins and markdown formatting ✨</p>
          <p className="mt-1">© 2025 AI Chat Interface</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
