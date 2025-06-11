import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  Timeline, 
  TimelineItem, 
  TimelineContent,
  TimelineSeparator,
  TimelineDot
} from '../components/ui/timeline';
import { ThemeProvider } from '../components/core/ThemeProvider';

const meta: Meta<typeof Timeline> = {
  title: 'UI/Timeline',
  component: Timeline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <div style={{ width: '500px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    orientation: { 
      control: 'select', 
      options: ['vertical', 'horizontal'] 
    },
    compact: { control: 'boolean' },
    reverse: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

// Basic vertical timeline
export const BasicVertical: Story = {
  render: () => (
    <Timeline>
      <TimelineItem active>
        <TimelineContent 
          title="Project Started" 
          subtitle="Initial project setup and planning" 
          date="Jan 15, 2025"
        >
          <p className="text-sm">Created repository and set up development environment.</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineContent 
          title="Design Phase" 
          subtitle="UI/UX design and prototyping" 
          date="Feb 1, 2025"
        >
          <p className="text-sm">Completed wireframes and design mockups.</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineContent 
          title="Development" 
          subtitle="Frontend and backend implementation" 
          date="Mar 10, 2025"
        />
      </TimelineItem>
      <TimelineItem connector={false}>
        <TimelineContent 
          title="Launch" 
          subtitle="Product release and marketing" 
          date="Apr 20, 2025"
        />
      </TimelineItem>
    </Timeline>
  ),
};

// Horizontal timeline
export const Horizontal: Story = {
  render: () => (
    <Timeline orientation="horizontal">
      <TimelineItem orientation="horizontal" active>
        <TimelineContent 
          title="Step 1" 
          subtitle="Planning"
        />
      </TimelineItem>
      <TimelineItem orientation="horizontal">
        <TimelineContent 
          title="Step 2" 
          subtitle="Design"
        />
      </TimelineItem>
      <TimelineItem orientation="horizontal">
        <TimelineContent 
          title="Step 3" 
          subtitle="Development"
        />
      </TimelineItem>
      <TimelineItem orientation="horizontal" connector={false}>
        <TimelineContent 
          title="Step 4" 
          subtitle="Launch"
        />
      </TimelineItem>
    </Timeline>
  ),
};

// Timeline with different connector styles
export const ConnectorStyles: Story = {
  render: () => (
    <Timeline>
      <TimelineItem active connectorStyle="solid">
        <TimelineContent 
          title="Solid Connector" 
          subtitle="Default connector style"
          date="Jan 15, 2025"
        />
      </TimelineItem>
      <TimelineItem connectorStyle="dashed">
        <TimelineContent 
          title="Dashed Connector" 
          subtitle="Dashed line style"
          date="Feb 1, 2025"
        />
      </TimelineItem>
      <TimelineItem connectorStyle="dotted">
        <TimelineContent 
          title="Dotted Connector" 
          subtitle="Dotted line style"
          date="Mar 10, 2025"
        />
      </TimelineItem>
      <TimelineItem connector={false}>
        <TimelineContent 
          title="No Connector" 
          subtitle="End of timeline"
          date="Apr 20, 2025"
        />
      </TimelineItem>
    </Timeline>
  ),
};

// Timeline with custom icons
export const CustomIcons: Story = {
  render: () => (
    <Timeline>
      <TimelineItem 
        active 
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        }
      >
        <TimelineContent 
          title="Project Initiated" 
          subtitle="Kickoff meeting and planning"
          date="Jan 15, 2025"
        />
      </TimelineItem>
      <TimelineItem 
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        }
      >
        <TimelineContent 
          title="Documentation" 
          subtitle="Project requirements and specifications"
          date="Feb 1, 2025"
        />
      </TimelineItem>
      <TimelineItem 
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
          </svg>
        }
      >
        <TimelineContent 
          title="Design Phase" 
          subtitle="UI/UX design and prototyping"
          date="Mar 10, 2025"
        />
      </TimelineItem>
      <TimelineItem 
        connector={false}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 9h6v6H9z" />
          </svg>
        }
      >
        <TimelineContent 
          title="Development" 
          subtitle="Frontend and backend implementation"
          date="Apr 20, 2025"
        />
      </TimelineItem>
    </Timeline>
  ),
};

// Timeline with separators
export const WithSeparators: Story = {
  render: () => (
    <Timeline>
      <TimelineItem active>
        <TimelineContent 
          title="Q1 Planning" 
          subtitle="Strategic planning for Q1"
          date="Jan 5, 2025"
        />
      </TimelineItem>
      <TimelineItem>
        <TimelineContent 
          title="Q1 Implementation" 
          subtitle="Executing Q1 plans"
          date="Feb 15, 2025"
        />
      </TimelineItem>
      <TimelineSeparator label="Q2 2025" />
      <TimelineItem>
        <TimelineContent 
          title="Q2 Planning" 
          subtitle="Strategic planning for Q2"
          date="Apr 5, 2025"
        />
      </TimelineItem>
      <TimelineItem>
        <TimelineContent 
          title="Q2 Implementation" 
          subtitle="Executing Q2 plans"
          date="May 15, 2025"
        />
      </TimelineItem>
      <TimelineSeparator label="Q3 2025" />
      <TimelineItem connector={false}>
        <TimelineContent 
          title="Q3 Planning" 
          subtitle="Strategic planning for Q3"
          date="Jul 5, 2025"
        />
      </TimelineItem>
    </Timeline>
  ),
};

// Compact timeline
export const Compact: Story = {
  render: () => (
    <Timeline compact>
      <TimelineItem active>
        <TimelineContent 
          title="Task 1 Completed" 
          date="Jan 5, 2025"
        />
      </TimelineItem>
      <TimelineItem>
        <TimelineContent 
          title="Task 2 Completed" 
          date="Jan 10, 2025"
        />
      </TimelineItem>
      <TimelineItem>
        <TimelineContent 
          title="Task 3 Completed" 
          date="Jan 15, 2025"
        />
      </TimelineItem>
      <TimelineItem>
        <TimelineContent 
          title="Task 4 Completed" 
          date="Jan 20, 2025"
        />
      </TimelineItem>
      <TimelineItem connector={false}>
        <TimelineContent 
          title="Task 5 Completed" 
          date="Jan 25, 2025"
        />
      </TimelineItem>
    </Timeline>
  ),
};

// Reverse timeline
export const Reverse: Story = {
  render: () => (
    <Timeline reverse>
      <TimelineItem>
        <TimelineContent 
          title="Latest Event" 
          subtitle="Most recent activity"
          date="Apr 20, 2025"
        />
      </TimelineItem>
      <TimelineItem>
        <TimelineContent 
          title="Previous Event" 
          subtitle="Earlier activity"
          date="Mar 10, 2025"
        />
      </TimelineItem>
      <TimelineItem>
        <TimelineContent 
          title="Earlier Event" 
          subtitle="Even earlier activity"
          date="Feb 1, 2025"
        />
      </TimelineItem>
      <TimelineItem active connector={false}>
        <TimelineContent 
          title="First Event" 
          subtitle="Where it all began"
          date="Jan 15, 2025"
        />
      </TimelineItem>
    </Timeline>
  ),
};

// Timeline with dots
export const WithDots: Story = {
  render: () => (
    <Timeline>
      <TimelineItem 
        active 
        icon={<TimelineDot size="md" active />}
      >
        <TimelineContent 
          title="Active Step" 
          subtitle="Current progress"
          date="Today"
        />
      </TimelineItem>
      <TimelineItem 
        icon={<TimelineDot size="md" />}
      >
        <TimelineContent 
          title="Upcoming Step" 
          subtitle="Next in line"
          date="Tomorrow"
        />
      </TimelineItem>
      <TimelineItem 
        icon={<TimelineDot size="md" />}
      >
        <TimelineContent 
          title="Future Step" 
          subtitle="Coming soon"
          date="Next week"
        />
      </TimelineItem>
      <TimelineItem 
        connector={false}
        icon={<TimelineDot size="md" />}
      >
        <TimelineContent 
          title="Final Step" 
          subtitle="Completion"
          date="Next month"
        />
      </TimelineItem>
    </Timeline>
  ),
};

// Timeline with custom colors
export const CustomColors: Story = {
  render: () => (
    <Timeline>
      <TimelineItem 
        active 
        iconBackground="#10b981"
        connectorColor="#10b981"
      >
        <TimelineContent 
          title="Completed" 
          subtitle="Task finished successfully"
          date="Jan 15, 2025"
        />
      </TimelineItem>
      <TimelineItem 
        iconBackground="#f59e0b"
        connectorColor="#f59e0b"
      >
        <TimelineContent 
          title="In Progress" 
          subtitle="Currently working on this"
          date="Feb 1, 2025"
        />
      </TimelineItem>
      <TimelineItem 
        iconBackground="#ef4444"
        connectorColor="#ef4444"
      >
        <TimelineContent 
          title="Blocked" 
          subtitle="Issues need to be resolved"
          date="Mar 10, 2025"
        />
      </TimelineItem>
      <TimelineItem 
        connector={false}
        iconBackground="#6366f1"
      >
        <TimelineContent 
          title="Planned" 
          subtitle="Scheduled for future"
          date="Apr 20, 2025"
        />
      </TimelineItem>
    </Timeline>
  ),
};