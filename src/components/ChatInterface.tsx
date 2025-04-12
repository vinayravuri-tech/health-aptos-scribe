
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import { Send, Loader } from 'lucide-react';

type Message = {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    content: "Hi, I'm your HealthScribe assistant. How can I help you today?",
    sender: 'ai',
    timestamp: new Date(),
  },
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mock AI response function - in a real app this would call an AI service
  const generateAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let response = "I understand you're experiencing some symptoms. Can you tell me more about how you're feeling?";
    
    // Simple keyword detection for demo purposes
    if (userMessage.toLowerCase().includes('headache')) {
      response = "I notice you mentioned headache. How severe is it on a scale from 1-10, and how long have you been experiencing it?";
    } else if (userMessage.toLowerCase().includes('fever')) {
      response = "You mentioned fever. What's your temperature, and do you have any other symptoms like chills or body aches?";
    } else if (userMessage.toLowerCase().includes('cough')) {
      response = "I see you're coughing. Is it a dry cough or are you coughing up phlegm? And how long has this been going on?";
    }
    
    setIsLoading(false);
    return response;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Generate and add AI response
    const aiResponse = await generateAIResponse(input);
    
    const aiMessage: Message = {
      content: aiResponse,
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <Card className="shadow-lg border-gray-200 h-[600px] flex flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <CardContent className="pt-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200">
                <Loader className="h-4 w-4 text-medical-primary animate-spin" />
                <span className="text-sm text-gray-500">HealthScribe is thinking...</span>
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isLoading}
            className="bg-medical-primary hover:bg-medical-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
