'use client';

import React, { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/components/ui/avatar';

export function OmniBot() {
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-teal-500 hover:bg-teal-600 transition-all duration-300"
        >
          <Sparkles className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Sliding sidebar from right */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar - taking up 1/3 of the screen */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-1/3 z-50 bg-white shadow-xl flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b bg-teal-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 text-teal-500 mr-2" />
                    <h3 className="font-medium">Omni-bot</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your magical wellness practice assistant
                </p>
              </div>

              {/* Chat area */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
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
                              ? 'bg-teal-500 text-white rounded-br-none'
                              : 'bg-white border border-gray-200 rounded-bl-none'
                            }
                          `}
                        >
                          {message.type === 'bot' && (
                            <div className="flex items-center mb-1">
                              <Sparkles className="h-3 w-3 text-teal-500 mr-1" />
                              <span className="text-xs font-medium text-teal-500">Omni-bot</span>
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
                      <Sparkles className="h-10 w-10 text-teal-300 mx-auto mb-2" />
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
                          className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3 text-sm cursor-pointer hover:bg-teal-50 transition-colors"
                        >
                          {prompt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type your question..."
                    className="flex-1"
                  />
                  <Button className="bg-teal-500 hover:bg-teal-600">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}