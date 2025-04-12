
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Heart, UserCircle } from 'lucide-react';

type ChatMessageProps = {
  content: string;
  sender: 'user' | 'ai';
  timestamp?: Date;
};

const ChatMessage = ({ content, sender, timestamp }: ChatMessageProps) => {
  const isAi = sender === 'ai';
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isAi ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "flex items-start max-w-[80%]",
        isAi ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "flex-shrink-0 mt-1",
          isAi ? "mr-3" : "ml-3"
        )}>
          {isAi ? (
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-medical-primary text-white">
              <Heart className="h-4 w-4" />
            </div>
          ) : (
            <UserCircle className="h-8 w-8 text-gray-400" />
          )}
        </div>
        
        <div className={cn(
          "p-3 rounded-lg",
          isAi ? "bg-white border border-gray-200" : "bg-medical-primary text-white"
        )}>
          <p className="text-sm">{content}</p>
          {timestamp && (
            <p className={cn(
              "text-xs mt-1",
              isAi ? "text-gray-500" : "text-white/80"
            )}>
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
