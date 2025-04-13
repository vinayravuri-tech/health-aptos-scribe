
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import MultiModalInput from './MultiModalInput';
import { Send, Loader, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAIResponse, getMedicalSystemPrompt, GroqMessage } from '@/utils/groqApi';

type Message = {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  messageType?: 'text' | 'image';
  imageData?: string;
};

const initialMessages: Message[] = [
  {
    content: "Hi, I'm your HealthScribe assistant powered by Groq. How can I help you today? You can type, upload an image, or use voice input to describe your symptoms.",
    sender: 'ai',
    timestamp: new Date(),
  },
];

const ChatInterface = forwardRef(function ChatInterface(props, ref) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({
    getMessages: () => messages
  }));

  const processMessageWithGroqAPI = async (userMessage: string, imageData?: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      // Construct conversation history for Groq API
      const systemPrompt = getMedicalSystemPrompt();
      
      // Format the messages for the Groq API
      const groqMessages: GroqMessage[] = [
        { role: 'system', content: systemPrompt },
      ];
      
      // Add conversation history (limit to last 10 messages to save tokens)
      const conversationHistory = messages.slice(-10);
      conversationHistory.forEach(msg => {
        groqMessages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
      
      // Add the current user message
      let currentMessage = userMessage;
      if (imageData) {
        currentMessage += " [Note: User has also uploaded an image which appears to show a medical condition.]";
      }
      
      groqMessages.push({ role: 'user', content: currentMessage });
      
      // Get response from Groq API
      const response = await generateAIResponse(groqMessages);
      
      // Extract symptoms from the user message for later use
      const commonSymptoms = [
        'headache', 'fever', 'cough', 'sore throat', 'fatigue', 
        'nausea', 'vomiting', 'dizziness', 'pain', 'rash',
        'breathing', 'chest pain', 'chills', 'sweating'
      ];
      
      const newSymptoms = commonSymptoms.filter(symptom => 
        userMessage.toLowerCase().includes(symptom) && 
        !detectedSymptoms.includes(symptom)
      );
      
      if (newSymptoms.length > 0) {
        setDetectedSymptoms(prev => [...prev, ...newSymptoms]);
      }
      
      return response;
    } catch (error) {
      console.error("Error processing with Groq API:", error);
      return "I'm having trouble processing your request right now. Could you try again in a moment?";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !showImagePreview) return;
    
    const userMessage: Message = {
      content: input,
      sender: 'user',
      timestamp: new Date(),
      messageType: showImagePreview ? 'image' : 'text',
      imageData: showImagePreview || undefined,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowImagePreview(null);
    
    const aiResponse = await processMessageWithGroqAPI(input, userMessage.imageData);
    
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

  const handleImageCapture = (imageData: string) => {
    setShowImagePreview(imageData);
    toast({
      title: "Image Received",
      description: "Your image is ready to be analyzed. Add a description or send as is.",
    });
  };

  const handleVoiceCapture = (transcript: string) => {
    setInput(transcript);
    toast({
      title: "Voice Transcribed",
      description: "Your voice has been converted to text. Review and send.",
    });
  };

  const clearImagePreview = () => {
    setShowImagePreview(null);
  };

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
              messageType={message.messageType}
              imageData={message.imageData}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200">
                <Loader className="h-4 w-4 text-medical-primary animate-spin" />
                <span className="text-sm text-gray-500">Processing with Groq AI...</span>
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200">
        {showImagePreview && (
          <div className="mb-3 relative">
            <div className="relative rounded-lg overflow-hidden border border-gray-200 inline-block max-w-xs">
              <img src={showImagePreview} alt="Preview" className="h-[150px] object-cover" />
              <Button
                onClick={clearImagePreview}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
              >
                &times;
              </Button>
            </div>
          </div>
        )}
        
        <MultiModalInput 
          onImageCapture={handleImageCapture}
          onVoiceCapture={handleVoiceCapture}
          isLoading={isLoading}
        />
        
        <div className="flex space-x-2 mt-3">
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
            disabled={(!input.trim() && !showImagePreview) || isLoading}
            className="bg-medical-primary hover:bg-medical-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
});

export default ChatInterface;
