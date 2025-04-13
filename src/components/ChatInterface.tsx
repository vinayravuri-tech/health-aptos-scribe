
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import MultiModalInput from './MultiModalInput';
import { Send, Loader, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Message = {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  messageType?: 'text' | 'image';
  imageData?: string;
};

const initialMessages: Message[] = [
  {
    content: "Hi, I'm your HealthScribe assistant. How can I help you today? You can type, upload an image, or use voice input to describe your symptoms.",
    sender: 'ai',
    timestamp: new Date(),
  },
];

// Database of symptoms and their follow-up questions/responses
const symptomDatabase = {
  headache: {
    followUp: "I notice you mentioned headache. How severe is it on a scale from 1-10, and how long have you been experiencing it?",
    relatedSymptoms: ["nausea", "dizziness", "sensitivity to light", "vision changes"],
  },
  fever: {
    followUp: "You mentioned fever. What's your temperature, and do you have any other symptoms like chills or body aches?",
    relatedSymptoms: ["chills", "sweating", "fatigue", "body aches"],
  },
  cough: {
    followUp: "I see you're coughing. Is it a dry cough or are you coughing up phlegm? And how long has this been going on?",
    relatedSymptoms: ["shortness of breath", "chest pain", "wheezing", "sore throat"],
  },
  rash: {
    followUp: "I notice you mentioned a rash. Can you describe the appearance, location, and if it's itchy or painful?",
    relatedSymptoms: ["itching", "swelling", "blisters", "redness"],
  },
  fatigue: {
    followUp: "You mentioned feeling fatigued. Is this a new symptom, and how is it affecting your daily activities?",
    relatedSymptoms: ["weakness", "sleepiness", "difficulty concentrating", "low energy"],
  },
  nausea: {
    followUp: "I see you mentioned nausea. Have you vomited, and are you able to keep food and liquids down?",
    relatedSymptoms: ["vomiting", "stomach pain", "dizziness", "loss of appetite"],
  },
  pain: {
    followUp: "You mentioned pain. Could you specify the location, intensity, and whether it's constant or intermittent?",
    relatedSymptoms: ["swelling", "tenderness", "limited mobility", "redness"],
  },
  dizzy: {
    followUp: "I notice you mentioned feeling dizzy. Does it feel like the room is spinning, or more like lightheadedness?",
    relatedSymptoms: ["vertigo", "balance problems", "fainting", "headache"],
  },
  breathing: {
    followUp: "You mentioned breathing issues. Is it difficult to catch your breath or painful to breathe? Did this come on suddenly?",
    relatedSymptoms: ["wheezing", "chest tightness", "cough", "anxiety"],
  },
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [conversationContext, setConversationContext] = useState<string[]>([]);

  // Enhanced AI response function with symptom detection
  const generateAIResponse = async (userMessage: string, imageData?: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let response = "I understand you're experiencing some symptoms. Can you tell me more about how you're feeling?";
    let detectedSymptoms: string[] = [];
    
    // Normalize the user message for better matching
    const normalizedMessage = userMessage.toLowerCase();
    
    // Check for symptoms in the user message
    Object.keys(symptomDatabase).forEach(symptom => {
      if (normalizedMessage.includes(symptom)) {
        detectedSymptoms.push(symptom);
      }
    });

    // Check for related terms that aren't exact matches
    const commonHealthTerms = {
      "throat": "sore throat",
      "cant sleep": "insomnia",
      "cant breathe": "breathing",
      "hard to breathe": "breathing",
      "throw up": "nausea",
      "throwing up": "nausea",
      "vomit": "nausea",
      "stomach": "abdominal pain",
      "belly": "abdominal pain",
      "head hurts": "headache",
      "back hurts": "back pain",
      "ache": "pain",
      "tired": "fatigue",
      "exhausted": "fatigue",
      "no energy": "fatigue",
      "chest": "chest pain",
      "heart": "chest pain",
      "nose": "nasal congestion",
      "runny nose": "nasal congestion",
      "stuffy": "nasal congestion",
      "itchy": "itching",
      "scratch": "itching",
      "spots": "rash",
      "bumps": "rash",
    };

    Object.entries(commonHealthTerms).forEach(([term, symptom]) => {
      if (normalizedMessage.includes(term) && !detectedSymptoms.includes(symptom)) {
        detectedSymptoms.push(symptom);
      }
    });
    
    // If symptoms were detected, provide a specific response
    if (detectedSymptoms.length > 0) {
      // Update conversation context with detected symptoms
      setConversationContext(prev => [...prev, ...detectedSymptoms]);
      
      // Get the first detected symptom for a targeted response
      const primarySymptom = detectedSymptoms[0];
      const matchedSymptom = Object.keys(symptomDatabase).find(s => 
        primarySymptom.includes(s) || s.includes(primarySymptom)
      );
      
      if (matchedSymptom && symptomDatabase[matchedSymptom as keyof typeof symptomDatabase]) {
        response = symptomDatabase[matchedSymptom as keyof typeof symptomDatabase].followUp;
        
        // If we've detected multiple symptoms, acknowledge them
        if (detectedSymptoms.length > 1) {
          response += `\n\nI also notice you mentioned ${detectedSymptoms.slice(1).join(", ")}. Let's discuss each of these symptoms.`;
        }
      }
    } else if (imageData) {
      // Image analysis response
      response = "I've analyzed the image you sent. It appears to show some skin condition. Could you describe any symptoms related to this, such as itching, pain, or how long you've had it?";
    } else if (normalizedMessage.includes("hello") || normalizedMessage.includes("hi")) {
      response = "Hello! I'm here to help with your health concerns. Could you describe your symptoms in detail?";
    } else if (normalizedMessage.includes("thank")) {
      response = "You're welcome! Is there anything else about your symptoms you'd like to discuss?";
    } else {
      // Use conversation context to provide a more contextual response
      if (conversationContext.length > 0) {
        response = `Based on our conversation about ${conversationContext.join(", ")}, could you provide more details about your symptoms? This will help me give you a more accurate assessment.`;
      }
    }
    
    setIsLoading(false);
    return response;
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !showImagePreview) return;
    
    // Add user message
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
    
    // Generate and add AI response
    const aiResponse = await generateAIResponse(input, userMessage.imageData);
    
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
              messageType={message.messageType}
              imageData={message.imageData}
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
};

export default ChatInterface;
