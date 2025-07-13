# Calendar Sidebar Design & Implementation

## Overview

The CalendarSidebar is designed to handle multiple calendar sources (native, Google, iCloud, Outlook) with different event types (business, personal, marketing campaigns) in a unified interface. This design supports your use case of managing everything from daily appointments to marketing campaign scheduling like "send Christmas retreat preview in April."

## Design Philosophy

### Multi-Calendar Integration
- **Native Calendar**: Built-in OmniCRM calendar for business events
- **External Calendars**: Google, iCloud, Outlook integration
- **Marketing Calendar**: Campaign events, content publishing, promotional activities
- **Unified View**: All calendars displayed together with clear visual distinction

### Event Categories
- **Business**: Client appointments, meetings, consultations
- **Personal**: Personal events that affect availability
- **Marketing**: Campaign launches, content publishing, promotional events
- **System**: Automated reminders, follow-ups, recurring tasks

## Mock Data Structure

```typescript
// Types for calendar events
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  category: 'business' | 'personal' | 'marketing' | 'system';
  calendar: 'native' | 'google' | 'icloud' | 'outlook';
  color: string;
  attendees?: string[];
  location?: string;
  isRecurring?: boolean;
  reminderMinutes?: number;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

interface CalendarSource {
  id: string;
  name: string;
  type: 'native' | 'google' | 'icloud' | 'outlook';
  isEnabled: boolean;
  color: string;
  isDefault?: boolean;
}
```

## CalendarSidebar Implementation

```typescript
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, CalendarDays, Clock, Plus, Settings, 
  Eye, EyeOff, Users, MapPin, Bell, Repeat,
  Mail, Megaphone, User, Briefcase, ChevronRight,
  Google, Apple, Outlook, CalendarCheck
} from 'lucide-react';
import { UserNav } from '@/components/layout/UserNav';
import { Badge } from '@codexcrm/ui';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar";

// Mock data for calendar sources
const mockCalendarSources: CalendarSource[] = [
  {
    id: 'native-business',
    name: 'OmniCRM Business',
    type: 'native',
    isEnabled: true,
    color: '#0ea5e9',
    isDefault: true
  },
  {
    id: 'google-personal',
    name: 'Personal (Google)',
    type: 'google',
    isEnabled: true,
    color: '#34d399'
  },
  {
    id: 'google-marketing',
    name: 'Marketing Campaigns',
    type: 'google',
    isEnabled: true,
    color: '#f59e0b'
  },
  {
    id: 'outlook-work',
    name: 'Work Calendar (Outlook)',
    type: 'outlook',
    isEnabled: false,
    color: '#8b5cf6'
  },
  {
    id: 'icloud-family',
    name: 'Family (iCloud)',
    type: 'icloud',
    isEnabled: true,
    color: '#ec4899'
  }
];

// Mock upcoming events
const mockUpcomingEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Client Consultation - Sarah Johnson',
    startTime: new Date(2024, 11, 15, 10, 0), // Today 10:00 AM
    endTime: new Date(2024, 11, 15, 11, 0),
    category: 'business',
    calendar: 'native',
    color: '#0ea5e9',
    location: 'Wellness Studio',
    status: 'confirmed'
  },
  {
    id: '2',
    title: 'Christmas Retreat Preview Email',
    startTime: new Date(2024, 3, 15, 9, 0), // April 15th 9:00 AM
    endTime: new Date(2024, 3, 15, 9, 30),
    category: 'marketing',
    calendar: 'google',
    color: '#f59e0b',
    description: 'Send preview of Christmas retreat to mailing list',
    status: 'confirmed'
  },
  {
    id: '3',
    title: 'Yoga Class - Advanced',
    startTime: new Date(2024, 11, 15, 18, 0), // Today 6:00 PM
    endTime: new Date(2024, 11, 15, 19, 30),
    category: 'business',
    calendar: 'native',
    color: '#0ea5e9',
    attendees: ['12 participants'],
    status: 'confirmed'
  },
  {
    id: '4',
    title: 'Family Dinner',
    startTime: new Date(2024, 11, 15, 19, 0), // Today 7:00 PM
    endTime: new Date(2024, 11, 15, 21, 0),
    category: 'personal',
    calendar: 'icloud',
    color: '#ec4899',
    status: 'confirmed'
  },
  {
    id: '5',
    title: 'Social Media Content Batch',
    startTime: new Date(2024, 11, 16, 14, 0), // Tomorrow 2:00 PM
    endTime: new Date(2024, 11, 16, 16, 0),
    category: 'marketing',
    calendar: 'google',
    color: '#f59e0b',
    description: 'Create and schedule week\'s social media posts',
    status: 'confirmed'
  },
  {
    id: '6',
    title: 'Monthly Business Review',
    startTime: new Date(2024, 11, 20, 15, 0), // Dec 20th 3:00 PM
    endTime: new Date(2024, 11, 20, 16, 30),
    category: 'business',
    calendar: 'native',
    color: '#0ea5e9',
    isRecurring: true,
    status: 'confirmed'
  }
];

// Mock calendar statistics
const mockCalendarStats = {
  todayEvents: 3,
  thisWeekEvents: 12,
  upcomingAppointments: 8,
  marketingEvents: 5,
  pendingInvites: 2
};

interface CalendarSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function CalendarSidebar(props: CalendarSidebarProps) {
  const pathname = usePathname();
  const [enabledCalendars, setEnabledCalendars] = React.useState<string[]>(
    mockCalendarSources.filter(cal => cal.isEnabled).map(cal => cal.id)
  );

  const toggleCalendar = (calendarId: string) => {
    setEnabledCalendars(prev => 
      prev.includes(calendarId) 
        ? prev.filter(id => id !== calendarId)
        : [...prev, calendarId]
    );
  };

  const getCalendarIcon = (type: CalendarSource['type']) => {
    switch (type) {
      case 'google': return Google;
      case 'outlook': return Outlook;
      case 'icloud': return Apple;
      default: return Calendar;
    }
  };

  const getCategoryIcon = (category: CalendarEvent['category']) => {
    switch (category) {
      case 'business': return Briefcase;
      case 'personal': return User;
      case 'marketing': return Megaphone;
      case 'system': return Bell;
      default: return Calendar;
    }
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatEventDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img src="/images/logo.png" alt="OmniCRM Logo" className="h-7" />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span>OmniCRM</span>
              <span className="text-xs">
                by{' '}
                <span className="text-teal-500">Omnipotency ai</span>
              </span>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Calendar Views */}
        <SidebarGroup>
          <SidebarGroupLabel>Calendar Views</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/calendar'}>
                <Link href="/calendar" className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4" />
                    <span>Month View</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/calendar/week" className="flex items-center w-full">
                  <CalendarDays className="w-4 h-4 mr-3" />
                  <span>Week View</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/calendar/day" className="flex items-center w-full">
                  <Clock className="w-4 h-4 mr-3" />
                  <span>Day View</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/calendar/agenda" className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="w-4 h-4" />
                    <span>Agenda</span>
                  </div>
                  <Badge variant="secondary" className="h-5 flex-shrink-0">
                    {mockCalendarStats.thisWeekEvents}
                  </Badge>
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
                <Link href="/calendar/new" className="flex items-center w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  <span>New Event</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/calendar/appointment" className="flex items-center w-full">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Schedule Appointment</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/calendar/availability" className="flex items-center w-full">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Set Availability</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/marketing/campaign-calendar" className="flex items-center w-full">
                  <Megaphone className="w-4 h-4 mr-2" />
                  <span>Marketing Event</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Calendar Sources */}
        <SidebarGroup>
          <SidebarGroupLabel>Calendar Sources</SidebarGroupLabel>
          <SidebarMenu>
            {mockCalendarSources.map((calendar) => {
              const IconComponent = getCalendarIcon(calendar.type);
              const isEnabled = enabledCalendars.includes(calendar.id);
              
              return (
                <SidebarMenuItem key={calendar.id}>
                  <SidebarMenuButton 
                    onClick={() => toggleCalendar(calendar.id)}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: calendar.color }}
                      />
                      <span className="truncate">{calendar.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {calendar.isDefault && (
                        <Badge variant="outline" className="h-4 text-xs">
                          Default
                        </Badge>
                      )}
                      {isEnabled ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Upcoming Events */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center justify-between w-full">
              <span>Upcoming Events</span>
              <Badge variant="secondary" className="h-4 text-xs">
                {mockUpcomingEvents.length}
              </Badge>
            </div>
          </SidebarGroupLabel>
          <SidebarMenu>
            {mockUpcomingEvents.slice(0, 5).map((event) => {
              const CategoryIcon = getCategoryIcon(event.category);
              
              return (
                <SidebarMenuItem key={event.id}>
                  <SidebarMenuButton asChild className="h-auto p-2">
                    <Link href={`/calendar/event/${event.id}`} className="flex items-start w-full">
                      <div className="flex items-start gap-2 w-full">
                        <div className="flex-shrink-0 mt-1">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: event.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {event.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <CategoryIcon className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {formatEventDate(event.startTime)} at {formatEventTime(event.startTime)}
                                </span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground truncate">
                                    {event.location}
                                  </span>
                                </div>
                              )}
                              {event.attendees && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Users className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {event.attendees[0]}
                                  </span>
                                </div>
                              )}
                              {event.isRecurring && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Repeat className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    Recurring
                                  </span>
                                </div>
                              )}
                            </div>
                            <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/calendar/events" className="flex items-center justify-center w-full text-sm text-muted-foreground">
                  View All Events
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Quick Stats */}
        <SidebarGroup>
          <SidebarGroupLabel>Today's Overview</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="px-2 py-1 group-data-[collapsible=icon]:hidden">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-600">
                      {mockCalendarStats.todayEvents}
                    </div>
                    <div className="text-blue-500">Today</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-semibold text-green-600">
                      {mockCalendarStats.upcomingAppointments}
                    </div>
                    <div className="text-green-500">This Week</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <div className="font-semibold text-orange-600">
                      {mockCalendarStats.marketingEvents}
                    </div>
                    <div className="text-orange-500">Marketing</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="font-semibold text-purple-600">
                      {mockCalendarStats.pendingInvites}
                    </div>
                    <div className="text-purple-500">Pending</div>
                  </div>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/calendar/integrations" className="flex items-center w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Calendar Integrations</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/calendar/notifications" className="flex items-center w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  <span>Notifications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/calendar/settings" className="flex items-center w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Calendar Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
```

## Key Features Implemented

### 1. **Multi-Calendar Support**
- Native OmniCRM calendar (default)
- Google Calendar integration
- iCloud calendar support  
- Outlook calendar integration
- Visual calendar source management with toggle visibility

### 2. **Event Categories**
- **Business**: Client appointments, consultations, classes
- **Personal**: Family events, personal appointments
- **Marketing**: Campaign events, content scheduling, promotional activities
- **System**: Automated reminders and recurring tasks

### 3. **Marketing Campaign Integration**
- Dedicated marketing events (like "Christmas Retreat Preview Email")
- Campaign scheduling and content calendar integration
- Marketing-specific quick actions

### 4. **Rich Event Display**
- Color-coded events by calendar source
- Category icons for quick identification
- Location, attendees, and recurring event indicators
- Smart date formatting (Today, Tomorrow, specific dates)

### 5. **Quick Actions**
- New Event creation
- Appointment scheduling
- Availability management
- Marketing event creation

### 6. **Calendar Management**
- Toggle calendar visibility
- Default calendar designation
- Integration status indicators
- Calendar-specific color coding

### 7. **Overview Statistics**
- Today's event count
- Weekly overview
- Marketing events tracking
- Pending invitations

## Usage Examples

### Business Scenario
```typescript
// Client consultation appointment
{
  title: 'Client Consultation - Sarah Johnson',
  category: 'business',
  calendar: 'native',
  location: 'Wellness Studio',
  attendees: ['Sarah Johnson'],
  reminderMinutes: 15
}
```

### Marketing Campaign Scenario
```typescript
// Marketing campaign event
{
  title: 'Christmas Retreat Preview Email',
  category: 'marketing',
  calendar: 'google',
  description: 'Send preview of Christmas retreat to mailing list',
  startTime: new Date(2024, 3, 15, 9, 0), // April 15th
  // This allows scheduling marketing activities months in advance
}
```

### Personal Integration
```typescript
// Personal event affecting availability
{
  title: 'Family Dinner',
  category: 'personal',
  calendar: 'icloud',
  // This shows in unified view but marked as personal
}
```

## Integration Points

### 1. **Calendar API Integration** (Future)
```typescript
// When ready to implement real APIs
interface CalendarIntegration {
  google: GoogleCalendarAPI;
  outlook: OutlookCalendarAPI;
  icloud: iCloudCalendarAPI;
  native: NativeCalendarAPI;
}
```

### 2. **Marketing System Integration**
- Links to marketing campaign creation
- Content calendar synchronization
- Automated campaign event creation

### 3. **Business Logic Integration**
- Client appointment booking system
- Availability management
- Recurring appointment handling

This design provides a comprehensive calendar management system that scales from simple appointment scheduling to complex multi-calendar marketing campaign management, all while maintaining a clean, intuitive interface.