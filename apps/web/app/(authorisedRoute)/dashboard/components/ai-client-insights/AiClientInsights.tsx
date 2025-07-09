'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, Brain } from "lucide-react";
import Link from "next/link";

interface AiClientInsightsProps {
  className?: string;
}

export function AiClientInsights({ className }: AiClientInsightsProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Mock insights data - would be fetched from API in real implementation
  const insights = [
    {
      id: 1,
      title: 'Client Engagement',
      content: 'Sarah has missed 2 consecutive appointments. Consider reaching out with a personalized message to re-engage.',
      actionText: 'Send Message',
      actionLink: { pathname: '/messages/new', query: { client: 'sarah' } } as const,
    },
    {
      id: 2,
      title: 'Treatment Progress',
      content: 'Alex has shown significant improvement in anxiety symptoms over the last month based on assessment scores.',
      actionText: 'View Progress',
      actionLink: { pathname: '/contacts/alex/progress' } as const,
    },
    {
      id: 3,
      title: 'Client Anniversary',
      content: 'Emma is celebrating 1 year as your client next week. Consider sending a milestone celebration note.',
      actionText: 'Schedule Note',
      actionLink: { pathname: '/calendar/new', query: { type: 'reminder' } } as const,
    },
    {
      id: 4,
      title: 'Group Opportunity',
      content: 'Based on recent sessions, Michael might benefit from joining your "Stress Management" group.',
      actionText: 'Add to Group',
      actionLink: { pathname: '/groups/stress-management/add' } as const,
    },
  ];

  // Simulate refresh action
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>AI Client Insights</CardTitle>
          <CardDescription>AI-generated insights about your clients</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="h-8 w-8"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh insights</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {insights.map((insight) => (
              <CarouselItem key={insight.id}>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm">{insight.content}</p>
                    <Button 
                      variant="link" 
                      className="mt-2 h-8 p-0 text-primary" 
                      asChild
                    >
                      <Link href={insight.actionLink}>
                        {insight.actionText}
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-2">
            <CarouselPrevious className="relative left-0 translate-x-0 h-8 w-8" />
            <CarouselNext className="relative right-0 translate-x-0 h-8 w-8" />
          </div>
        </Carousel>
      </CardContent>
    </Card>
  );
}