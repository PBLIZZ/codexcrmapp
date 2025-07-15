'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  CalendarDays,
  Clock,
  Plus,
  Settings,
  Eye,
  EyeOff,
  Users,
  MapPin,
  Repeat,
  Bell,
  ChevronDown,
  ChevronRight,
  Zap,
  Video,
  Coffee,
} from 'lucide-react';
import { Badge } from '@codexcrm/ui';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@codexcrm/ui';
import { cn } from '@/lib/utils';

// Mock data for calendar sources
const calendarSources = [
  {
    id: 'google-business',
    name: 'Google Business',
    type: 'google',
    visible: true,
    color: 'bg-blue-500',
    count: 12,
  },
  {
    id: 'google-personal',
    name: 'Google Personal',
    type: 'google',
    visible: true,
    color: 'bg-green-500',
    count: 8,
  },
  {
    id: 'icloud-main',
    name: 'iCloud Main',
    type: 'icloud',
    visible: false,
    color: 'bg-gray-500',
    count: 5,
  },
  {
    id: 'outlook-work',
    name: 'Outlook Work',
    type: 'outlook',
    visible: true,
    color: 'bg-orange-500',
    count: 15,
  },
  {
    id: 'native-crm',
    name: 'OmniCRM Events',
    type: 'native',
    visible: true,
    color: 'bg-teal-500',
    count: 6,
  },
];

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: '1',
    title: 'Client Consultation - Sarah M.',
    time: '10:00 AM',
    duration: '1h',
    type: 'business',
    location: 'Zoom',
    attendees: 2,
    isRecurring: false,
    source: 'google-business',
  },
  {
    id: '2',
    title: 'Marketing Campaign Review',
    time: '2:00 PM',
    duration: '30m',
    type: 'marketing',
    location: 'Conference Room A',
    attendees: 4,
    isRecurring: true,
    source: 'outlook-work',
  },
  {
    id: '3',
    title: 'Yoga Class',
    time: '6:00 PM',
    duration: '1h 30m',
    type: 'personal',
    location: 'Wellness Studio',
    attendees: 1,
    isRecurring: true,
    source: 'google-personal',
  },
];

// Mock data for marketing campaigns
const marketingCampaigns = [
  {
    id: '1',
    name: 'Christmas Retreat Preview',
    scheduledDate: 'April 15, 2024',
    type: 'Email Campaign',
    status: 'scheduled',
  },
  {
    id: '2',
    name: 'Spring Wellness Challenge',
    scheduledDate: 'March 1, 2024',
    type: 'Social Media',
    status: 'active',
  },
];

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'business':
      return Users;
    case 'personal':
      return Coffee;
    case 'marketing':
      return Zap;
    case 'system':
      return Settings;
    default:
      return Calendar;
  }
};

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'business':
      return 'text-blue-600';
    case 'personal':
      return 'text-green-600';
    case 'marketing':
      return 'text-purple-600';
    case 'system':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
};

export function CalendarSidebar() {
  const pathname = usePathname();
  const [expandedSources, setExpandedSources] = React.useState(true);
  const [expandedCampaigns, setExpandedCampaigns] = React.useState(false);

  const toggleSourceVisibility = (sourceId: string) => {
    // In a real implementation, this would update the calendar source visibility
    console.log('Toggle visibility for:', sourceId);
  };

  return (
    <SidebarContent>
      {/* Calendar Navigation */}
      <SidebarGroup>
        <SidebarGroupLabel>Calendar</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/calendar'}>
              <Link href='/calendar' className='flex items-center w-full'>
                <Calendar className='w-4 h-4 mr-3' />
                <span>Calendar View</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/calendar/agenda' className='flex items-center w-full'>
                <CalendarDays className='w-4 h-4 mr-3' />
                <span>Agenda</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/calendar/schedule' className='flex items-center w-full'>
                <Clock className='w-4 h-4 mr-3' />
                <span>Schedule</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Quick Actions */}
      <SidebarGroup>
        <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/calendar/new' className='flex items-center w-full'>
                <Plus className='w-4 h-4 mr-2' />
                <span>New Event</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/calendar/availability' className='flex items-center w-full'>
                <Clock className='w-4 h-4 mr-2' />
                <span>Set Availability</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/calendar/booking-links' className='flex items-center w-full'>
                <Video className='w-4 h-4 mr-2' />
                <span>Booking Links</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Today's Events */}
      <SidebarGroup>
        <SidebarGroupLabel>Today&apos;s Events</SidebarGroupLabel>
        <SidebarMenu>
          {upcomingEvents.map((event) => {
            const IconComponent = getEventTypeIcon(event.type);
            return (
              <SidebarMenuItem key={event.id}>
                <SidebarMenuButton asChild className='h-auto p-2'>
                  <Link href={`/calendar/event/${event.id}`} className='flex items-start w-full'>
                    <div className='flex items-center gap-2 w-full'>
                      <IconComponent
                        className={cn(
                          'w-4 h-4 flex-shrink-0 mt-0.5',
                          getEventTypeColor(event.type)
                        )}
                      />
                      <div className='flex-1 min-w-0 group-data-[collapsible=icon]:hidden'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium truncate'>{event.title}</span>
                          <div className='flex items-center gap-1 ml-1'>
                            {event.isRecurring && (
                              <Repeat className='w-3 h-3 text-muted-foreground' />
                            )}
                            {event.location === 'Zoom' && (
                              <Video className='w-3 h-3 text-muted-foreground' />
                            )}
                          </div>
                        </div>
                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                          <span>{event.time}</span>
                          <span>•</span>
                          <span>{event.duration}</span>
                          {event.location && (
                            <>
                              <span>•</span>
                              <span className='flex items-center gap-1'>
                                <MapPin className='w-3 h-3' />
                                {event.location}
                              </span>
                            </>
                          )}
                        </div>
                        {event.attendees > 1 && (
                          <div className='flex items-center gap-1 text-xs text-muted-foreground mt-1'>
                            <Users className='w-3 h-3' />
                            <span>{event.attendees} attendees</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>

      {/* Calendar Sources */}
      <SidebarGroup>
        <div className='flex items-center justify-between'>
          <SidebarGroupLabel>Calendar Sources</SidebarGroupLabel>
          <Button
            variant='ghost'
            size='sm'
            className='h-4 w-4 p-0'
            onClick={() => setExpandedSources(!expandedSources)}
          >
            {expandedSources ? (
              <ChevronDown className='h-3 w-3' />
            ) : (
              <ChevronRight className='h-3 w-3' />
            )}
          </Button>
        </div>
        {expandedSources && (
          <SidebarMenu>
            {calendarSources.map((source) => (
              <SidebarMenuItem key={source.id}>
                <SidebarMenuButton asChild className='h-auto p-2'>
                  <div className='flex items-center gap-2 w-full'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-4 w-4 p-0 flex-shrink-0'
                      onClick={() => toggleSourceVisibility(source.id)}
                    >
                      {source.visible ? (
                        <Eye className='h-3 w-3' />
                      ) : (
                        <EyeOff className='h-3 w-3 text-muted-foreground' />
                      )}
                    </Button>
                    <div className={cn('w-2 h-2 rounded-full flex-shrink-0', source.color)}></div>
                    <div className='flex-1 min-w-0 group-data-[collapsible=icon]:hidden'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium truncate'>{source.name}</span>
                        <Badge variant='outline' className='h-4 text-xs ml-1'>
                          {source.count}
                        </Badge>
                      </div>
                      <p className='text-xs text-muted-foreground capitalize'>{source.type}</p>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
      </SidebarGroup>

      {/* Marketing Campaigns */}
      <SidebarGroup>
        <div className='flex items-center justify-between'>
          <SidebarGroupLabel>Marketing Campaigns</SidebarGroupLabel>
          <Button
            variant='ghost'
            size='sm'
            className='h-4 w-4 p-0'
            onClick={() => setExpandedCampaigns(!expandedCampaigns)}
          >
            {expandedCampaigns ? (
              <ChevronDown className='h-3 w-3' />
            ) : (
              <ChevronRight className='h-3 w-3' />
            )}
          </Button>
        </div>
        {expandedCampaigns && (
          <SidebarMenu>
            {marketingCampaigns.map((campaign) => (
              <SidebarMenuItem key={campaign.id}>
                <SidebarMenuButton asChild className='h-auto p-2'>
                  <Link
                    href={`/marketing/campaign/${campaign.id}`}
                    className='flex items-start w-full'
                  >
                    <div className='flex items-center gap-2 w-full'>
                      <Zap className='w-4 h-4 flex-shrink-0 text-purple-600 mt-0.5' />
                      <div className='flex-1 min-w-0 group-data-[collapsible=icon]:hidden'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium truncate'>{campaign.name}</span>
                          <Badge
                            variant={campaign.status === 'active' ? 'default' : 'secondary'}
                            className='h-4 text-xs ml-1'
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          <p>{campaign.type}</p>
                          <p className='flex items-center gap-1 mt-1'>
                            <Bell className='w-3 h-3' />
                            {campaign.scheduledDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
      </SidebarGroup>

      {/* Settings */}
      <SidebarGroup>
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/calendar/integrations' className='flex items-center w-full'>
                <Settings className='w-4 h-4 mr-2' />
                <span>Calendar Integrations</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/calendar/notifications' className='flex items-center w-full'>
                <Bell className='w-4 h-4 mr-2' />
                <span>Notifications</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}
