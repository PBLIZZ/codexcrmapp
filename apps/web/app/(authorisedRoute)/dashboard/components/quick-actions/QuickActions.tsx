'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@codexcrm/ui/components/ui/card";
import { Button } from "@codexcrm/ui/components/ui/button";
import { 
  UserPlus, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Send, 
  BarChart, 
  Settings, 
  Users,
  PlusCircle
} from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const quickActions = [
    {
      title: 'Add Contact',
      icon: UserPlus,
      href: { pathname: '/contacts', query: { new: 'true' } } as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Schedule Session',
      icon: Calendar,
      href: { pathname: '/calendar/new' } as const,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Create Note',
      icon: FileText,
      href: { pathname: '/notes/new' } as const,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Send Message',
      icon: MessageSquare,
      href: { pathname: '/messages/new' } as const,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Create Group',
      icon: Users,
      href: { pathname: '/groups/new' } as const,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'View Reports',
      icon: BarChart,
      href: { pathname: '/reports' } as const,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Bulk Email',
      icon: Send,
      href: { pathname: '/email/new' } as const,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      title: 'Settings',
      icon: Settings,
      href: { pathname: '/settings' } as const,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className={`h-auto flex flex-col items-center justify-center p-4 space-y-2 ${action.bgColor} border-0 hover:bg-opacity-80`}
                asChild
              >
                <Link href={action.href}>
                  <Icon className={`h-6 w-6 mb-2 ${action.color}`} />
                  <span className="text-xs font-medium">{action.title}</span>
                </Link>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href={{ pathname: '/actions' }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              View All Actions
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}