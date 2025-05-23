import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Plugin, DynamicPluginInfo } from '../types';
import { parsePluginCommand, getPlugin } from '../plugins';
import { useToast } from '../hooks/use-toast';
import { usePlugins } from '../hooks/usePlugins';

interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  isTyping: boolean;
  plugins: Plugin[];
  addPlugin: (pluginInfo: DynamicPluginInfo) => void;
  getCustomPluginsInfo: () => DynamicPluginInfo[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const { plugins, addPlugin, getCustomPluginsInfo } = usePlugins();

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('aiChatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
        localStorage.removeItem('aiChatMessages');
      }
    } else {
      // Add welcome message if no history
      const welcomeMessage: Message = {
        id: uuidv4(),
        sender: 'assistant',
        content: "Hi there! I'm your AI assistant. You can ask me questions or try these commands:\n\n- `/weather [city]` - Get weather information\n- `/calc [expression]` - Calculate a math expression\n- `/define [word]` - Look up a word's definition\n- `/gemini [prompt]` - Get AI-powered responses using Google Gemini\n- `/gemini-key [api-key]` - Set your Gemini API key (optional)\n\n**Markdown support** is enabled, so you can use **bold**, *italic*, `code`, links, and more!",
        type: 'text',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('aiChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: uuidv4(),
      sender: 'user',
      content,
      type: 'text',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Check if message contains a plugin command
    const pluginCommand = parsePluginCommand(content, plugins);
    
    setIsTyping(true);
    
    try {
      let responseMessage: Message;
      
      if (pluginCommand) {
        const plugin = getPlugin(pluginCommand.pluginName, plugins);
        
        if (plugin) {
          // Execute plugin
          const pluginData = await plugin.execute(pluginCommand.params);
          
          responseMessage = {
            id: uuidv4(),
            sender: 'assistant',
            content: `Results for ${plugin.command} ${pluginCommand.params}:`,
            type: 'plugin',
            pluginName: pluginCommand.pluginName,
            pluginData,
            timestamp: new Date().toISOString()
          };
        } else {
          throw new Error(`Plugin ${pluginCommand.pluginName} not found.`);
        }
      } else {
        // Handle as normal message with a simple response
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate thinking
        
        // Simple responses based on keywords in the message
        const lowerContent = content.toLowerCase();
        let responseContent = '';
        
        if (lowerContent.includes('hello') || lowerContent.includes('hi ') || lowerContent === 'hi') {
          responseContent = "Hello! How can I help you today?";
        } else if (lowerContent.includes('help')) {
          responseContent = "I can help you with several tasks. Try using one of these commands:\n\n- `/weather [city]` - Get weather information\n- `/calc [expression]` - Calculate a math expression\n- `/define [word]` - Look up a word's definition\n- `/gemini [prompt]` - Get AI responses\n\nYou can also add **custom plugins** by clicking the + button in the top right.";
        } else if (lowerContent.includes('weather') && !lowerContent.startsWith('/weather')) {
          // Natural language parsing for weather
          const cityMatch = content.match(/weather\s+(?:in|for|at)?\s+([A-Za-z\s]+)/i);
          if (cityMatch && cityMatch[1]) {
            const city = cityMatch[1].trim();
            // Execute weather plugin with the extracted city
            const plugin = getPlugin('weather');
            if (plugin) {
              try {
                const pluginData = await plugin.execute(city);
                responseMessage = {
                  id: uuidv4(),
                  sender: 'assistant',
                  content: `Here's the weather for ${city}:`,
                  type: 'plugin',
                  pluginName: 'weather',
                  pluginData,
                  timestamp: new Date().toISOString()
                };
                setMessages(prevMessages => [...prevMessages, responseMessage]);
                setIsTyping(false);
                return;
              } catch (error) {
                responseContent = `I couldn't get the weather for ${city}. Please try using the /weather command directly.`;
              }
            }
          } else {
            responseContent = "If you're looking for weather information, try using the command `/weather [city]`.";
          }
        } else if ((lowerContent.includes('calculate') || lowerContent.includes('what is')) && 
                  /[0-9+\-*/()]/.test(lowerContent) && 
                  !lowerContent.startsWith('/calc')) {
          // Natural language parsing for calculator
          const expressionMatch = content.match(/(?:calculate|what is|what's|whats)\s+([0-9+\-*/() .]+)/i);
          if (expressionMatch && expressionMatch[1]) {
            const expression = expressionMatch[1].trim();
            const plugin = getPlugin('calc');
            if (plugin) {
              try {
                const pluginData = await plugin.execute(expression);
                responseMessage = {
                  id: uuidv4(),
                  sender: 'assistant',
                  content: `Here's the calculation result:`,
                  type: 'plugin',
                  pluginName: 'calc',
                  pluginData,
                  timestamp: new Date().toISOString()
                };
                setMessages(prevMessages => [...prevMessages, responseMessage]);
                setIsTyping(false);
                return;
              } catch (error) {
                responseContent = `I couldn't calculate "${expression}". Please try using the /calc command directly.`;
              }
            }
          }
        } else if ((lowerContent.includes('define') || lowerContent.includes('meaning of') || lowerContent.includes('what does') || lowerContent.includes('definition')) && 
                  !lowerContent.startsWith('/define')) {
          // Natural language parsing for definitions
          const wordMatch = content.match(/(?:define|meaning of|what does|definition of)\s+(?:the word\s+)?['"]?([a-zA-Z]+)['"]?/i);
          if (wordMatch && wordMatch[1]) {
            const word = wordMatch[1].trim();
            const plugin = getPlugin('define');
            if (plugin) {
              try {
                const pluginData = await plugin.execute(word);
                responseMessage = {
                  id: uuidv4(),
                  sender: 'assistant',
                  content: `Here's the definition of "${word}":`,
                  type: 'plugin',
                  pluginName: 'define',
                  pluginData,
                  timestamp: new Date().toISOString()
                };
                setMessages(prevMessages => [...prevMessages, responseMessage]);
                setIsTyping(false);
                return;
              } catch (error) {
                responseContent = `I couldn't find the definition of "${word}". Please try using the /define command directly.`;
              }
            }
          }
        } else if (lowerContent.includes('markdown') || lowerContent.includes('formatting')) {
          responseContent = "# Markdown Support\n\nYou can use **bold text**, *italic text*, and `code formatting`.\n\n## Lists\n\n- Item 1\n- Item 2\n- Item 3\n\n## Code Blocks\n\n```\nconst greeting = 'Hello, world!';\nconsole.log(greeting);\n```\n\n> You can also use blockquotes like this.\n\nEnjoy the markdown formatting!";
        } else if (lowerContent.includes('plugin') && (lowerContent.includes('add') || lowerContent.includes('create') || lowerContent.includes('custom'))) {
          responseContent = "To add custom plugins:\n\n1. Click the + button in the top-right corner\n2. Enter a plugin name, command (without the slash), and description\n3. Click 'Add Plugin'\n\nYour custom plugin will be available immediately using `/yourcommand [parameters]`";
        } else {
          responseContent = "I'm not sure how to respond to that. Try asking for help or using one of our commands like /weather, /calc, or /define.\n\nYou can also try our **markdown formatting** or add custom plugins!";
        }
        
        responseMessage = {
          id: uuidv4(),
          sender: 'assistant',
          content: responseContent,
          type: 'text',
          timestamp: new Date().toISOString()
        };
      }
      
      // Wait a bit to simulate AI thinking
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMessages(prevMessages => [...prevMessages, responseMessage]);
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to process your request.',
        variant: 'destructive'
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        id: uuidv4(),
        sender: 'assistant',
        content: `Sorry, I encountered an error: ${error.message || 'Unknown error'}`,
        type: 'text',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage, 
      isTyping, 
      plugins, 
      addPlugin, 
      getCustomPluginsInfo 
    }}>
      {children}
    </ChatContext.Provider>
  );
};
