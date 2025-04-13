import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
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
    treatments: [
      "For mild to moderate headaches, over-the-counter pain relievers like acetaminophen or ibuprofen may help.",
      "Stay hydrated and rest in a quiet, dark room if you have sensitivity to light or sound.",
      "Apply a cold or warm compress to your head or neck.",
      "If headaches are severe, persistent, or accompanied by other symptoms, please consult a healthcare provider."
    ]
  },
  fever: {
    followUp: "You mentioned fever. What's your temperature, and do you have any other symptoms like chills or body aches?",
    relatedSymptoms: ["chills", "sweating", "fatigue", "body aches"],
    treatments: [
      "Rest and drink plenty of fluids to prevent dehydration.",
      "Take over-the-counter fever reducers like acetaminophen or ibuprofen as directed.",
      "Use lightweight clothing and bedding.",
      "Take lukewarm baths to help reduce fever.",
      "If fever is high (over 103°F/39.4°C), persists for more than 3 days, or is accompanied by severe symptoms, seek medical attention."
    ]
  },
  cough: {
    followUp: "I see you're coughing. Is it a dry cough or are you coughing up phlegm? And how long has this been going on?",
    relatedSymptoms: ["shortness of breath", "chest pain", "wheezing", "sore throat"],
    treatments: [
      "Stay hydrated and drink warm liquids like tea with honey to soothe the throat.",
      "Use a humidifier or take steamy showers to moisturize the air and loosen congestion.",
      "Over-the-counter cough suppressants may help with dry coughs.",
      "For productive coughs, expectorants can help clear mucus.",
      "Avoid irritants like smoke or strong perfumes.",
      "If cough persists for more than 2 weeks or is accompanied by difficulty breathing, seek medical advice."
    ]
  },
  rash: {
    followUp: "I notice you mentioned a rash. Can you describe the appearance, location, and if it's itchy or painful?",
    relatedSymptoms: ["itching", "swelling", "blisters", "redness"],
    treatments: [
      "Avoid scratching and keep the affected area clean and dry.",
      "Apply cool compresses to reduce itching and inflammation.",
      "Over-the-counter hydrocortisone cream may help with itching and inflammation.",
      "For allergic reactions, antihistamines might provide relief.",
      "If the rash is widespread, painful, or accompanied by fever, consult a healthcare provider."
    ]
  },
  fatigue: {
    followUp: "You mentioned feeling fatigued. Is this a new symptom, and how is it affecting your daily activities?",
    relatedSymptoms: ["weakness", "sleepiness", "difficulty concentrating", "low energy"],
    treatments: [
      "Ensure you're getting adequate sleep (7-9 hours for adults).",
      "Maintain a balanced diet and stay hydrated.",
      "Engage in regular, moderate physical activity.",
      "Manage stress through techniques like meditation, deep breathing, or yoga.",
      "Consider reviewing your medications with your doctor, as some can cause fatigue.",
      "If fatigue is persistent or severe, consult a healthcare provider to rule out underlying conditions."
    ]
  },
  nausea: {
    followUp: "I see you mentioned nausea. Have you vomited, and are you able to keep food and liquids down?",
    relatedSymptoms: ["vomiting", "stomach pain", "dizziness", "loss of appetite"],
    treatments: [
      "Stay hydrated with small sips of clear fluids like water, broth, or sports drinks.",
      "Eat bland foods like crackers, toast, or rice when you can tolerate food.",
      "Avoid spicy, fatty, or heavily seasoned foods.",
      "Over-the-counter medications like bismuth subsalicylate or antiemetics may help relieve symptoms.",
      "If nausea persists for more than 2 days, is accompanied by severe pain, or if you can't keep any liquids down, seek medical attention."
    ]
  },
  pain: {
    followUp: "You mentioned pain. Could you specify the location, intensity, and whether it's constant or intermittent?",
    relatedSymptoms: ["swelling", "tenderness", "limited mobility", "redness"],
    treatments: [
      "Rest the affected area and avoid activities that worsen the pain.",
      "Apply ice to reduce swelling and inflammation, especially in the first 48 hours after an injury.",
      "Over-the-counter pain relievers like acetaminophen or NSAIDs may help manage pain.",
      "For muscle pain, gentle stretching and warm compresses can provide relief.",
      "If pain is severe, worsening, or doesn't improve with home care, consult a healthcare provider."
    ]
  },
  dizzy: {
    followUp: "I notice you mentioned feeling dizzy. Does it feel like the room is spinning, or more like lightheadedness?",
    relatedSymptoms: ["vertigo", "balance problems", "fainting", "headache"],
    treatments: [
      "Sit or lie down immediately when feeling dizzy to prevent falls.",
      "Move slowly when changing positions, especially when getting up from lying down.",
      "Stay hydrated and avoid caffeine, alcohol, and tobacco.",
      "If dizziness is related to inner ear issues, certain head movements or positions may help.",
      "For recurring or severe dizziness, consult a healthcare provider, as it could indicate an underlying condition."
    ]
  },
  breathing: {
    followUp: "You mentioned breathing issues. Is it difficult to catch your breath or painful to breathe? Did this come on suddenly?",
    relatedSymptoms: ["wheezing", "chest tightness", "cough", "anxiety"],
    treatments: [
      "Use proper posture to allow your lungs to expand fully.",
      "Practice deep breathing exercises to improve lung capacity.",
      "Avoid triggers like smoke, strong perfumes, or known allergens.",
      "For asthma or allergies, use prescribed inhalers or medications as directed.",
      "If you experience sudden shortness of breath, blue lips or fingers, or severe chest pain, seek emergency medical attention."
    ]
  },
};

const ChatInterface = forwardRef(function ChatInterface(props, ref) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);
  const [conversationStage, setConversationStage] = useState<'initial' | 'assessing' | 'recommending'>('initial');

  useImperativeHandle(ref, () => ({
    getMessages: () => messages
  }));

  const generateAIResponse = async (userMessage: string, imageData?: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let response = "I understand you're experiencing some symptoms. Can you tell me more about how you're feeling?";
    let newDetectedSymptoms: string[] = [...detectedSymptoms];
    
    const normalizedMessage = userMessage.toLowerCase();
    
    Object.keys(symptomDatabase).forEach(symptom => {
      if (normalizedMessage.includes(symptom) && !newDetectedSymptoms.includes(symptom)) {
        newDetectedSymptoms.push(symptom);
      }
    });

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
      if (normalizedMessage.includes(term) && !newDetectedSymptoms.includes(symptom)) {
        newDetectedSymptoms.push(symptom);
      }
    });

    setDetectedSymptoms(newDetectedSymptoms);
    
    const askingForTreatment = normalizedMessage.includes('treatment') || 
                             normalizedMessage.includes('remedy') || 
                             normalizedMessage.includes('medicine') || 
                             normalizedMessage.includes('help') ||
                             normalizedMessage.includes('cure') ||
                             normalizedMessage.includes('what should i do') ||
                             normalizedMessage.includes('how to treat');
    
    const shouldRecommendTreatment = askingForTreatment || 
                                   (newDetectedSymptoms.length > 0 && conversationStage === 'assessing' && messages.length > 4);
    
    if (shouldRecommendTreatment && newDetectedSymptoms.length > 0) {
      setConversationStage('recommending');
      
      response = "Based on your symptoms, here are some recommendations:\n\n";
      
      for (const symptom of newDetectedSymptoms) {
        const matchedSymptom = Object.keys(symptomDatabase).find(s => 
          symptom.includes(s) || s.includes(symptom)
        );
        
        if (matchedSymptom && symptomDatabase[matchedSymptom as keyof typeof symptomDatabase]) {
          const symptomInfo = symptomDatabase[matchedSymptom as keyof typeof symptomDatabase];
          response += `For ${matchedSymptom}:\n`;
          symptomInfo.treatments.slice(0, 3).forEach(treatment => {
            response += `• ${treatment}\n`;
          });
          response += '\n';
        }
      }
      
      response += "Remember, this is not a replacement for professional medical advice. If your symptoms are severe or persistent, please consult with a healthcare provider.";
    } else if (newDetectedSymptoms.length > 0) {
      setConversationContext(prev => [...prev, ...newDetectedSymptoms]);
      
      setConversationStage('assessing');
      
      const primarySymptom = newDetectedSymptoms[0];
      const matchedSymptom = Object.keys(symptomDatabase).find(s => 
        primarySymptom.includes(s) || s.includes(primarySymptom)
      );
      
      if (matchedSymptom && symptomDatabase[matchedSymptom as keyof typeof symptomDatabase]) {
        response = symptomDatabase[matchedSymptom as keyof typeof symptomDatabase].followUp;
        
        if (newDetectedSymptoms.length > 1) {
          response += `\n\nI also notice you mentioned ${newDetectedSymptoms.slice(1).join(", ")}. Let's discuss each of these symptoms.`;
        }
        
        if (newDetectedSymptoms.length >= 2) {
          response += "\n\nWould you like me to suggest some treatment options based on your symptoms?";
        }
      }
    } else if (imageData) {
      response = "I've analyzed the image you sent. It appears to show some skin condition. Could you describe any symptoms related to this, such as itching, pain, or how long you've had it?";
    } else if (normalizedMessage.includes("hello") || normalizedMessage.includes("hi")) {
      response = "Hello! I'm here to help with your health concerns. Could you describe your symptoms in detail?";
    } else if (normalizedMessage.includes("thank")) {
      response = "You're welcome! Is there anything else about your symptoms you'd like to discuss?";
    } else {
      if (conversationContext.length > 0) {
        response = `Based on our conversation about ${conversationContext.join(", ")}, could you provide more details about your symptoms? This will help me give you a more accurate assessment.`;
        
        if (conversationStage === 'assessing' && conversationContext.length >= 2) {
          response += "\n\nWould you like me to suggest some treatment options based on what you've shared so far?";
        }
      }
    }
    
    setIsLoading(false);
    return response;
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
});

export default ChatInterface;
