'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Quote } from "lucide-react";

interface DailyInspirationCardProps {
  className?: string;
}

export function DailyInspirationCard({ className }: DailyInspirationCardProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Mock quotes - would be fetched from API in real implementation
  const quotes = [
    {
      text: "The good life is a process, not a state of being. It is a direction, not a destination.",
      author: "Carl Rogers"
    },
    {
      text: "Between stimulus and response there is a space. In that space is our power to choose our response.",
      author: "Viktor Frankl"
    },
    {
      text: "You don't have to see the whole staircase, just take the first step.",
      author: "Martin Luther King Jr."
    },
    {
      text: "The privilege of a lifetime is being who you are.",
      author: "Joseph Campbell"
    },
    {
      text: "We are not what happened to us, we are what we choose to become.",
      author: "Carl Jung"
    }
  ];

  // Select a random quote - in real implementation, this would be from an API
  const [quoteIndex, setQuoteIndex] = React.useState(
    Math.floor(Math.random() * quotes.length)
  );
  const quote = quotes[quoteIndex];

  // Simulate refresh action to get a new quote
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * quotes.length);
      } while (newIndex === quoteIndex);
      setQuoteIndex(newIndex);
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <Card className={`${className} bg-primary/5`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Daily Inspiration</CardTitle>
          <CardDescription>Wisdom to guide your practice</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="h-8 w-8"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">New quote</span>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
        <Quote className="h-8 w-8 text-primary/60" />
        <blockquote className="text-lg italic text-center">
          "{quote.text}"
        </blockquote>
        <cite className="font-medium text-sm">— {quote.author}</cite>
      </CardContent>
    </Card>
  );
}