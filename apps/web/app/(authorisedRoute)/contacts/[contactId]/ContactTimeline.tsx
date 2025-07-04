'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertCircle,
  Tag,
  User,
  Sparkles,
} from 'lucide-react';

import { Timeline, TimelineItem, TimelineContent, TimelineSeparator } from '@codexcrm/ui';
import { Badge } from '@codexcrm/ui/components/ui/badge';
import { Button } from '@codexcrm/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@codexcrm/ui/components/ui/card';

interface TimelineEvent {
  id: string;
  type: 'session' | 'email' | 'call' | 'note' | 'status_change';
  title: string;
  description?: string;
  date: string;
  icon: React.ReactNode;
  iconBackground: string;
  metadata?: {
    duration?: number;
    location?: string;
    status?: string;
    sentiment?: string;
    aiInsights?: string;
    followUpNeeded?: boolean;
  };
}

interface ContactTimelineProps {
  contactId: string;
  limit?: number;
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'session',
    title: 'Initial Consultation',
    description: 'First meeting to discuss goals and establish treatment plan. Client expressed anxiety about upcoming work presentation.',
    date: '2024-12-15T10:00:00Z',
    icon: <User className='h-4 w-4' />,
    iconBackground: '#2196F3',
    metadata: {
      duration: 60,
      location: 'In-Person',
      status: 'completed',
      sentiment: 'positive',
      aiInsights: 'Client shows strong motivation for change and has clear goals.',
      followUpNeeded: true,
    },
  },
  {
    id: '2',
    type: 'email',
    title: 'Follow-up Email Sent',
    description: 'Sent homework exercises and mindfulness techniques discussed in session.',
    date: '2024-12-16T14:30:00Z',
    icon: <MessageSquare className='h-4 w-4' />,
    iconBackground: '#4CAF50',
  },
  {
    id: '3',
    type: 'session',
    title: 'Therapy Session',
    description: 'Worked on cognitive behavioral techniques. Client reported improvement in sleep patterns.',
    date: '2024-12-22T11:00:00Z',
    icon: <CheckCircle className='h-4 w-4' />,
    iconBackground: '#4CAF50',
    metadata: {
      duration: 50,
      location: 'Virtual',
      status: 'completed',
      sentiment: 'positive',
      aiInsights: 'Significant progress noted in managing anxiety symptoms.',
    },
  },
  {
    id: '4',
    type: 'note',
    title: 'Clinical Note Added',
    description: 'Updated treatment plan based on progress. Adjusted goals for next quarter.',
    date: '2024-12-23T09:15:00Z',
    icon: <FileText className='h-4 w-4' />,
    iconBackground: '#9C27B0',
  },
  {
    id: '5',
    type: 'call',
    title: 'Crisis Check-in Call',
    description: 'Brief check-in call after client reported difficult day. Provided coping strategies.',
    date: '2025-01-02T16:45:00Z',
    icon: <AlertCircle className='h-4 w-4' />,
    iconBackground: '#F44336',
    metadata: {
      duration: 15,
      location: 'Phone',
      status: 'completed',
      followUpNeeded: true,
    },
  },
  {
    id: '6',
    type: 'session',
    title: 'Group Therapy Session',
    description: 'Participated in weekly anxiety support group. Shared personal progress with group.',
    date: '2025-01-08T18:00:00Z',
    icon: <Tag className='h-4 w-4' />,
    iconBackground: '#FF9800',
    metadata: {
      duration: 90,
      location: 'In-Person',
      status: 'completed',
      sentiment: 'positive',
    },
  },
];

export function ContactTimeline({ contactId: _contactId, limit = 10 }: ContactTimelineProps) {
  const [isCompact, setIsCompact] = useState(false);

  const timelineEvents = limit ? mockTimelineEvents.slice(0, limit) : mockTimelineEvents;

  const groupedEvents: Record<string, TimelineEvent[]> = {};
  timelineEvents.forEach((event) => {
    const date = new Date(event.date);
    const monthYear = format(date, 'MMMM yyyy');

    groupedEvents[monthYear] ??= [];
    groupedEvents[monthYear].push(event);
  });

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='flex items-center gap-2'>
          <Calendar className='h-5 w-5 text-muted-foreground' />
          Contact Timeline (Mock Display)
        </CardTitle>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' onClick={() => setIsCompact(!isCompact)}>
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
                  active={eventIndex === 0}
                  icon={event.icon}
                  iconBackground={event.iconBackground}
                  connector={
                    eventIndex < events.length - 1 ||
                    groupIndex < Object.keys(groupedEvents).length - 1
                  }
                >
                  <TimelineContent
                    title={event.title}
                    date={format(new Date(event.date), 'PPp')}
                  >
                    {event.description && (
                      <p className='text-sm text-muted-foreground mt-1'>{event.description}</p>
                    )}

                    {!isCompact && event.metadata && (
                      <div className='mt-3 space-y-2'>
                        {event.type === 'session' && (
                          <div className='flex flex-wrap gap-2 mt-2'>
                            {event.metadata.duration && (
                              <Badge variant='outline' className='flex items-center gap-1'>
                                <Clock className='h-3 w-3' />
                                {event.metadata.duration} min
                              </Badge>
                            )}
                            {event.metadata.location && (
                              <Badge variant='outline' className='flex items-center gap-1'>
                                <Tag className='h-3 w-3' />
                                {event.metadata.location}
                              </Badge>
                            )}
                            {event.metadata.status && (
                              <Badge
                                variant={
                                  event.metadata.status === 'completed' ? 'default' : 'secondary'
                                }
                                className='flex items-center gap-1'
                              >
                                <CheckCircle className='h-3 w-3' />
                                {event.metadata.status}
                              </Badge>
                            )}
                            {event.metadata.followUpNeeded && (
                              <Badge variant='destructive' className='flex items-center gap-1'>
                                <AlertCircle className='h-3 w-3' />
                                Follow-up needed
                              </Badge>
                            )}
                          </div>
                        )}

                        {event.metadata.aiInsights && (
                          <div className='mt-3 bg-purple-50 p-2 rounded-md border border-purple-100'>
                            <div className='flex items-center gap-1 text-sm font-medium text-purple-700 mb-1'>
                              <Sparkles className='h-3 w-3' />
                              AI Insights
                            </div>
                            <p className='text-xs text-purple-800'>
                              {event.metadata.aiInsights}
                            </p>
                          </div>
                        )}

                        <div className='flex gap-2 mt-3'>
                          <Button variant='outline' size='sm' className='h-7 px-2 text-xs'>
                            <MessageSquare className='h-3 w-3 mr-1' />
                            Add Note
                          </Button>
                          <Button variant='outline' size='sm' className='h-7 px-2 text-xs'>
                            <Calendar className='h-3 w-3 mr-1' />
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
          <div className='flex justify-center mt-6'>
            <Button variant='outline' size='sm'>
              View All History
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}