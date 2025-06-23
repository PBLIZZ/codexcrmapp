'use client';

import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * OmniBot provides the core AI assistant chat functionality.
 * This component has been refactored to remove its own floating button and sidebar
 * so it can be properly used within the OmniBotFloat component.
 */
export function OmniBot() {
  // Mock chat history
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'bot';
    message: string;
  }>>([]);

  // Suggested prompts
  const suggestedPrompts = [
    "Summarize today's appointments",
    "Draft follow-up email for a customer",
    "Suggest wellness tips for a customer",
    "Create a new group for yoga enthusiasts",
    "Analyze my customer retention metrics"
  ];

  const handlePromptClick = (prompt: string) => {
    // In a real app, you would send this to your API and get a response
    setChatHistory([
      ...chatHistory,
      { type: 'user', message: prompt }
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        {chatHistory.length > 0 ? (
          <div className="space-y-4">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-2xl p-3
                    ${message.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card border border-border rounded-bl-none'
                    }
                  `}
                >
                  {message.type === 'bot' && (
                    <div className="flex items-center mb-1">
                      <Sparkles className="h-3 w-3 text-primary mr-1" />
                      <span className="text-xs font-medium text-primary">OmniBot</span>
                    </div>
                  )}
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center">
            <div className="text-center mb-6">
              <Sparkles className="h-10 w-10 text-primary/30 mx-auto mb-2" />
              <p className="text-muted-foreground">
                How can I help you today?
              </p>
            </div>
            
            {/* Suggested prompts as chat bubbles */}
            <div className="w-full space-y-3">
              <p className="text-xs font-medium text-center text-muted-foreground mb-2">
                Try asking:
              </p>
              {suggestedPrompts.map((prompt, index) => (
                <div
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="bg-card border border-border rounded-2xl rounded-bl-none p-3 text-sm cursor-pointer hover:bg-accent transition-colors"
                >
                  {prompt}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="pt-4 mt-auto">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your question..."
            className="flex-1"
          />
          <Button>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}