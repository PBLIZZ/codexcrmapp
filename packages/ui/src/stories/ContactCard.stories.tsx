import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  ContactCard, 
  ContactAvatar, 
  ContactInfoItem,
  ContactCallButton,
  ContactEmailButton,
  ContactMessageButton
} from '../components/ui/contact-card';
import { ThemeProvider } from '../components/core/ThemeProvider';

const meta: Meta<typeof ContactCard> = {
  title: 'UI/ContactCard',
  component: ContactCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <div style={{ width: '400px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    name: { control: 'text' },
    title: { control: 'text' },
    company: { control: 'text' },
    layout: { 
      control: 'select', 
      options: ['horizontal', 'vertical'] 
    },
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
type Story = StoryObj<typeof ContactCard>;

// Basic contact card
export const Basic: Story = {
  args: {
    name: 'Jane Smith',
    title: 'Product Manager',
    company: 'Acme Inc.',
    size: 'md',
    variant: 'default',
    contactInfo: {
      email: 'jane.smith@example.com',
      phone: '(555) 123-4567',
    },
  },
};

// With avatar
export const WithAvatar: Story = {
  args: {
    ...Basic.args,
    avatar: {
      initials: 'JS',
      status: 'online',
    },
  },
};

// With avatar image
export const WithAvatarImage: Story = {
  args: {
    ...Basic.args,
    avatar: {
      src: 'https://i.pravatar.cc/300?img=28',
      status: 'online',
    },
  },
};

// With all contact info
export const WithAllContactInfo: Story = {
  args: {
    ...Basic.args,
    avatar: {
      src: 'https://i.pravatar.cc/300?img=28',
      status: 'online',
    },
    contactInfo: {
      email: 'jane.smith@example.com',
      phone: '(555) 123-4567',
      mobile: '(555) 987-6543',
      address: '123 Main St, Anytown, CA 94321',
      website: 'www.example.com',
      slack: '@janesmith',
    },
  },
};

// With action buttons
export const WithActions: Story = {
  args: {
    ...WithAvatar.args,
    actions: (
      <>
        <ContactCallButton />
        <ContactEmailButton />
        <ContactMessageButton />
      </>
    ),
  },
};

// With tags
export const WithTags: Story = {
  args: {
    ...WithAvatar.args,
    tags: ['Product', 'Design', 'Marketing'],
  },
};

// Horizontal layout
export const HorizontalLayout: Story = {
  args: {
    ...WithAvatar.args,
    layout: 'horizontal',
    actions: (
      <>
        <ContactCallButton />
        <ContactEmailButton />
      </>
    ),
  },
};

// Size variants
export const Small: Story = {
  args: {
    ...WithAvatar.args,
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    ...WithAvatar.args,
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    ...WithAvatar.args,
    size: 'lg',
  },
};

// Color variants
export const Default: Story = {
  args: {
    ...WithAvatar.args,
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    ...WithAvatar.args,
    variant: 'primary',
  },
};

export const Accent: Story = {
  args: {
    ...WithAvatar.args,
    variant: 'accent',
  },
};

export const Outline: Story = {
  args: {
    ...WithAvatar.args,
    variant: 'outline',
  },
};

// With hover and shadow
export const WithHoverAndShadow: Story = {
  args: {
    ...WithAvatar.args,
    withHover: true,
    withShadow: true,
  },
};

// Different status indicators
export const OnlineStatus: Story = {
  args: {
    ...Basic.args,
    avatar: {
      initials: 'JS',
      status: 'online',
    },
  },
};

export const OfflineStatus: Story = {
  args: {
    ...Basic.args,
    avatar: {
      initials: 'JS',
      status: 'offline',
    },
  },
};

export const AwayStatus: Story = {
  args: {
    ...Basic.args,
    avatar: {
      initials: 'JS',
      status: 'away',
    },
  },
};

export const BusyStatus: Story = {
  args: {
    ...Basic.args,
    avatar: {
      initials: 'JS',
      status: 'busy',
    },
  },
};

// With custom footer
export const WithFooter: Story = {
  args: {
    ...WithAvatar.args,
    footer: (
      <div className="text-xs text-muted-foreground pt-2">
        Last contacted: 3 days ago
      </div>
    ),
  },
};