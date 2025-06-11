'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertCircle,
  Tag,
  User,
  Phone,
  Mail,
  Star,
  Sparkles,
} from 'lucide-react';

import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
} from '@codexcrm/ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/trpc';

// Define types for our timeline data
interface TimelineEvent {
  id: string;
  type: 'session' | 'email' | 'call' | 'note' | 'status_change';
  title: string;
  description?: string;
  date: string;
  icon?: React.ReactNode;
  iconBackground?: string;
  metadata?: Record<string, any>;
}

interface ContactTimelineProps {
  contactId: string;
  limit?: number;
}

export function ContactTimeline({ contactId, limit = 10 }: ContactTimelineProps) {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isCompact, setIsCompact] = useState(false);

  // Fetch sessions for this contact
  const {
    data: sessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = api.sessions.list.useQuery(
    { contactId },
    {
      enabled: !!contactId,
      staleTime: 30000, // Cache for 30 seconds
    }
  );

  // Transform sessions into timeline events
  useEffect(() => {
    if (sessions) {
      const events: TimelineEvent[] = sessions.map((session) => {
        // Determine icon and background color based on session type
        let icon = <Calendar className="h-4 w-4" />;
        let iconBackground = '#4CAF50'; // Default green

        if (session.session_type) {
          switch (session.session_type.toLowerCase()) {
            case 'consultation':
              icon = <User className="h-4 w-4" />;
              iconBackground = '#2196F3'; // Blue
              break;
            case 'follow-up':
              icon = <CheckCircle className="h-4 w-4" />;
              iconBackground = '#4CAF50'; // Green
              break;
            case 'assessment':
              icon = <FileText className="h-4 w-4" />;
              iconBackground = '#9C27B0'; // Purple
              break;
            case 'emergency':
              icon = <AlertCircle className="h-4 w-4" />;
              iconBackground = '#F44336'; // Red
              break;
            case 'group':
              icon = <Tag className="h-4 w-4" />;
              iconBackground = '#FF9800'; // Orange
              break;
            default:
              // Keep default
              break;
          }
        }

        return {
          id: session.id,
          type: 'session',
          title: session.session_type || 'Session',
          description: session.notes || undefined,
          date: session.session_time,
          icon,
          iconBackground,
          metadata: {
            duration: session.duration_minutes,
            location: session.location,
            virtualMeetingLink: session.virtual_meeting_link,
            keyTopics: session.key_topics,
            outcomes: session.outcomes,
            followUpNeeded: session.follow_up_needed,
            followUpDetails: session.follow_up_details,
            status: session.status,
            sentiment: session.sentiment,
            aiInsights: session.ai_insights,
          },
        };
      });

      // Sort events by date (newest first)
      events.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      // Apply limit if specified
      const limitedEvents = limit ? events.slice(0, limit) : events;
      
      setTimelineEvents(limitedEvents);
    }
  }, [sessions, limit]);

  // Loading state
  if (isLoadingSessions) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (sessionsError) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <h3 className="font-medium">Error loading timeline</h3>
        <p className="text-sm">{sessionsError.message}</p>
      </div>
    );
  }

  // Empty state
  if (timelineEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Contact Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No sessions yet</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            This contact doesn't have any recorded sessions or interactions.
          </p>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Group events by month/year for separators
  const groupedEvents: Record<string, TimelineEvent[]> = {};
  timelineEvents.forEach((event) => {
    const date = new Date(event.date);
    const monthYear = format(date, 'MMMM yyyy');
    
    if (!groupedEvents[monthYear]) {
      groupedEvents[monthYear] = [];
    }
    
    groupedEvents[monthYear].push(event);
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          Contact Timeline
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCompact(!isCompact)}
          >
            {isCompact ? 'Detailed View' : 'Compact View'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Timeline compact={isCompact}>
          {Object.entries(groupedEvents).map(([monthYear, events], groupIndex) => (
            <div key={monthYear}>
              {groupIndex > 0 && <TimelineSeparator label={monthYear} />}
              {events.map((event, eventIndex) => (
                <TimelineItem
                  key={event.id}
                  active={eventIndex === 0} // Mark the most recent event as active
                  icon={event.icon}
                  iconBackground={event.iconBackground}
                  connector={eventIndex < events.length - 1 || groupIndex < Object.keys(groupedEvents).length - 1}
                >
                  <TimelineContent
                    title={event.title}
                    date={format(parseISO(event.date), 'PPp')} // Format date as "Jan 1, 2025, 12:00 PM"
                  >
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    )}
                    
                    {!isCompact && event.metadata && (
                      <div className="mt-3 space-y-2">
                        {/* Session details */}
                        {event.type === 'session' && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {event.metadata.duration && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.metadata.duration} min
                              </Badge>
                            )}
                            {event.metadata.location && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {event.metadata.location}
                              </Badge>
                            )}
                            {event.metadata.status && (
                              <Badge 
                                variant={event.metadata.status === 'completed' ? 'default' : 'secondary'} 
                                className="flex items-center gap-1"
                              >
                                <CheckCircle className="h-3 w-3" />
                                {event.metadata.status}
                              </Badge>
                            )}
                            {event.metadata.followUpNeeded && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Follow-up needed
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {/* AI Insights */}
                        {event.metadata.aiInsights && (
                          <div className="mt-3 bg-purple-50 p-2 rounded-md border border-purple-100">
                            <div className="flex items-center gap-1 text-sm font-medium text-purple-700 mb-1">
                              <Sparkles className="h-3 w-3" />
                              AI Insights
                            </div>
                            <p className="text-xs text-purple-800">
                              {typeof event.metadata.aiInsights === 'string' 
                                ? event.metadata.aiInsights 
                                : JSON.stringify(event.metadata.aiInsights)}
                            </p>
                          </div>
                        )}
                        
                        {/* Quick Actions */}
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Add Note
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Schedule Follow-up
                          </Button>
                        </div>
                      </div>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </div>
          ))}
        </Timeline>
        
        {timelineEvents.length >= limit && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" size="sm">
              View All History
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}