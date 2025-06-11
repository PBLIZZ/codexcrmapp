import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  TaskCard, 
  TaskList,
  PriorityBadge,
  StatusBadge,
  TaskProgress,
  DueDate,
  Assignee
} from '../components/ui/task-card';
import { ThemeProvider } from '../components/core/ThemeProvider';

const meta: Meta<typeof TaskCard> = {
  title: 'UI/TaskCard',
  component: TaskCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <div style={{ width: '350px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    priority: { 
      control: 'select', 
      options: ['low', 'medium', 'high', 'urgent'] 
    },
    status: { 
      control: 'select', 
      options: ['todo', 'in-progress', 'review', 'done', 'blocked'] 
    },
    progress: { control: 'number', min: 0, max: 100 },
    size: { 
      control: 'select', 
      options: ['sm', 'md', 'lg'] 
    },
    variant: { 
      control: 'select', 
      options: ['default', 'primary', 'accent', 'outline'] 
    },
    withHover: { control: 'boolean' },
    withShadow: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

// Basic task card
export const Basic: Story = {
  args: {
    title: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens',
    priority: 'medium',
    status: 'todo',
    size: 'md',
    variant: 'default',
  },
};

// With progress
export const WithProgress: Story = {
  args: {
    ...Basic.args,
    status: 'in-progress',
    progress: 45,
  },
};

// With due date
export const WithDueDate: Story = {
  args: {
    ...Basic.args,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
};

// With past due date
export const WithPastDueDate: Story = {
  args: {
    ...Basic.args,
    status: 'in-progress',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
};

// With assignee
export const WithAssignee: Story = {
  args: {
    ...Basic.args,
    assignee: {
      name: 'John Doe',
    },
  },
};

// With assignee avatar
export const WithAssigneeAvatar: Story = {
  args: {
    ...Basic.args,
    assignee: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/300?img=12',
    },
  },
};

// With tags
export const WithTags: Story = {
  args: {
    ...Basic.args,
    tags: ['Frontend', 'Authentication', 'Security'],
  },
};

// Complete task card
export const CompleteTaskCard: Story = {
  args: {
    ...Basic.args,
    status: 'in-progress',
    progress: 65,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    assignee: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/300?img=12',
    },
    tags: ['Frontend', 'Authentication', 'Security'],
  },
};

// Priority variants
export const LowPriority: Story = {
  args: {
    ...Basic.args,
    priority: 'low',
  },
};

export const MediumPriority: Story = {
  args: {
    ...Basic.args,
    priority: 'medium',
  },
};

export const HighPriority: Story = {
  args: {
    ...Basic.args,
    priority: 'high',
  },
};

export const UrgentPriority: Story = {
  args: {
    ...Basic.args,
    priority: 'urgent',
  },
};

// Status variants
export const TodoStatus: Story = {
  args: {
    ...Basic.args,
    status: 'todo',
  },
};

export const InProgressStatus: Story = {
  args: {
    ...Basic.args,
    status: 'in-progress',
  },
};

export const ReviewStatus: Story = {
  args: {
    ...Basic.args,
    status: 'review',
  },
};

export const DoneStatus: Story = {
  args: {
    ...Basic.args,
    status: 'done',
  },
};

export const BlockedStatus: Story = {
  args: {
    ...Basic.args,
    status: 'blocked',
  },
};

// Size variants
export const Small: Story = {
  args: {
    ...Basic.args,
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    ...Basic.args,
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    ...Basic.args,
    size: 'lg',
  },
};

// Color variants
export const Default: Story = {
  args: {
    ...Basic.args,
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    ...Basic.args,
    variant: 'primary',
  },
};

export const Accent: Story = {
  args: {
    ...Basic.args,
    variant: 'accent',
  },
};

export const Outline: Story = {
  args: {
    ...Basic.args,
    variant: 'outline',
  },
};

// With hover and shadow
export const WithHoverAndShadow: Story = {
  args: {
    ...Basic.args,
    withHover: true,
    withShadow: true,
  },
};

// With custom footer
export const WithFooter: Story = {
  args: {
    ...Basic.args,
    footer: (
      <div className="text-xs text-muted-foreground pt-2">
        Created by: Alex Johnson • Last updated: 2 days ago
      </div>
    ),
  },
};

// Task List component
const meta2: Meta<typeof TaskList> = {
  title: 'UI/TaskList',
  component: TaskList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export const TaskListGrid: StoryObj<typeof TaskList> = {
  render: () => (
    <TaskList
      layout="grid"
      columns={2}
      gap="md"
      tasks={[
        {
          title: 'Implement user authentication',
          description: 'Add login and registration functionality with JWT tokens',
          priority: 'high',
          status: 'in-progress',
          progress: 65,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          assignee: {
            name: 'John Doe',
            avatar: 'https://i.pravatar.cc/300?img=12',
          },
          tags: ['Frontend', 'Authentication'],
        },
        {
          title: 'Design database schema',
          description: 'Create tables and relationships for user data',
          priority: 'medium',
          status: 'todo',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          assignee: {
            name: 'Jane Smith',
            avatar: 'https://i.pravatar.cc/300?img=28',
          },
          tags: ['Database', 'Design'],
        },
        {
          title: 'Implement API endpoints',
          description: 'Create RESTful API endpoints for user management',
          priority: 'medium',
          status: 'todo',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          tags: ['Backend', 'API'],
        },
        {
          title: 'Write unit tests',
          description: 'Create comprehensive test suite for authentication',
          priority: 'low',
          status: 'todo',
          tags: ['Testing', 'Quality'],
        },
      ]}
    />
  ),
};

export const TaskListList: StoryObj<typeof TaskList> = {
  render: () => (
    <TaskList
      layout="list"
      gap="md"
      tasks={[
        {
          title: 'Implement user authentication',
          description: 'Add login and registration functionality with JWT tokens',
          priority: 'high',
          status: 'in-progress',
          progress: 65,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          assignee: {
            name: 'John Doe',
            avatar: 'https://i.pravatar.cc/300?img=12',
          },
          tags: ['Frontend', 'Authentication'],
        },
        {
          title: 'Design database schema',
          description: 'Create tables and relationships for user data',
          priority: 'medium',
          status: 'todo',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          assignee: {
            name: 'Jane Smith',
            avatar: 'https://i.pravatar.cc/300?img=28',
          },
          tags: ['Database', 'Design'],
        },
        {
          title: 'Implement API endpoints',
          description: 'Create RESTful API endpoints for user management',
          priority: 'medium',
          status: 'todo',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          tags: ['Backend', 'API'],
        },
      ]}
    />
  ),
};