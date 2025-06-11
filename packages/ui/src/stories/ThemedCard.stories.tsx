import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  ThemedCard, 
  ThemedCardHeader, 
  ThemedCardTitle,
  ThemedCardDescription,
  ThemedCardContent,
  ThemedCardFooter
} from '../components/ui/themed-card';
import { ThemeProvider } from '../components/core/ThemeProvider';

const meta: Meta<typeof ThemedCard> = {
  title: 'UI/ThemedCard',
  component: ThemedCard,
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
    variant: { 
      control: 'select', 
      options: ['default', 'primary', 'accent', 'outline'] 
    },
    size: { 
      control: 'select', 
      options: ['sm', 'md', 'lg'] 
    },
    withHover: { control: 'boolean' },
    withShadow: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ThemedCard>;

// Basic card
export const Basic: Story = {
  render: () => (
    <ThemedCard>
      <ThemedCardHeader>
        <ThemedCardTitle>Card Title</ThemedCardTitle>
        <ThemedCardDescription>Card Description</ThemedCardDescription>
      </ThemedCardHeader>
      <ThemedCardContent>
        <p>This is the main content of the card. It can contain any elements.</p>
      </ThemedCardContent>
      <ThemedCardFooter>
        <p className="text-sm text-muted-foreground">Footer content</p>
      </ThemedCardFooter>
    </ThemedCard>
  ),
};

// Card with different title levels
export const TitleLevels: Story = {
  render: () => (
    <div className="space-y-4">
      <ThemedCard>
        <ThemedCardHeader>
          <ThemedCardTitle level={1}>H1 Title</ThemedCardTitle>
          <ThemedCardDescription>Level 1 heading</ThemedCardDescription>
        </ThemedCardHeader>
      </ThemedCard>
      <ThemedCard>
        <ThemedCardHeader>
          <ThemedCardTitle level={2}>H2 Title</ThemedCardTitle>
          <ThemedCardDescription>Level 2 heading</ThemedCardDescription>
        </ThemedCardHeader>
      </ThemedCard>
      <ThemedCard>
        <ThemedCardHeader>
          <ThemedCardTitle level={3}>H3 Title</ThemedCardTitle>
          <ThemedCardDescription>Level 3 heading (default)</ThemedCardDescription>
        </ThemedCardHeader>
      </ThemedCard>
      <ThemedCard>
        <ThemedCardHeader>
          <ThemedCardTitle level={4}>H4 Title</ThemedCardTitle>
          <ThemedCardDescription>Level 4 heading</ThemedCardDescription>
        </ThemedCardHeader>
      </ThemedCard>
      <ThemedCard>
        <ThemedCardHeader>
          <ThemedCardTitle level={5}>H5 Title</ThemedCardTitle>
          <ThemedCardDescription>Level 5 heading</ThemedCardDescription>
        </ThemedCardHeader>
      </ThemedCard>
      <ThemedCard>
        <ThemedCardHeader>
          <ThemedCardTitle level={6}>H6 Title</ThemedCardTitle>
          <ThemedCardDescription>Level 6 heading</ThemedCardDescription>
        </ThemedCardHeader>
      </ThemedCard>
    </div>
  ),
};

// Size variants
export const Small: Story = {
  render: () => (
    <ThemedCard size="sm">
      <ThemedCardHeader>
        <ThemedCardTitle>Small Card</ThemedCardTitle>
        <ThemedCardDescription>This is a small card</ThemedCardDescription>
      </ThemedCardHeader>
      <ThemedCardContent>
        <p>Content with small padding</p>
      </ThemedCardContent>
    </ThemedCard>
  ),
};

export const Medium: Story = {
  render: () => (
    <ThemedCard size="md">
      <ThemedCardHeader>
        <ThemedCardTitle>Medium Card</ThemedCardTitle>
        <ThemedCardDescription>This is a medium card (default)</ThemedCardDescription>
      </ThemedCardHeader>
      <ThemedCardContent>
        <p>Content with medium padding</p>
      </ThemedCardContent>
    </ThemedCard>
  ),
};

export const Large: Story = {
  render: () => (
    <ThemedCard size="lg">
      <ThemedCardHeader>
        <ThemedCardTitle>Large Card</ThemedCardTitle>
        <ThemedCardDescription>This is a large card</ThemedCardDescription>
      </ThemedCardHeader>
      <ThemedCardContent>
        <p>Content with large padding</p>
      </ThemedCardContent>
    </ThemedCard>
  ),
};

// Color variants
export const Default: Story = {
  render: () => (
    <ThemedCard variant="default">
      <ThemedCardHeader>
        <ThemedCardTitle>Default Card</ThemedCardTitle>
        <ThemedCardDescription>This is a default card</ThemedCardDescription>
      </ThemedCardHeader>
      <ThemedCardContent>
        <p>Content with default styling</p>
      </ThemedCardContent>
    </ThemedCard>
  ),
};

export const Primary: Story = {
  render: () => (
    <ThemedCard variant="primary">
      <ThemedCardHeader>
        <ThemedCardTitle>Primary Card</ThemedCardTitle>
        <ThemedCardDescription>This is a primary card</ThemedCardDescription>
      </ThemedCardHeader>
      <ThemedCardContent>
        <p>Content with primary styling</p>
      </ThemedCardContent>
    </ThemedCard>
  ),
};

export const Accent: Story = {
  render: () => (
    <ThemedCard variant="accent">
      <ThemedCardHeader>
        <ThemedCardTitle>Accent Card</ThemedCardTitle>
        <ThemedCardDescription>This is an accent card</ThemedCardDescription>
      </ThemedCardHeader>
      <ThemedCardContent>
        <p>Content with accent styling</p>
      </ThemedCardContent>
    </ThemedCard>
  ),
};

export const Outline: Story = {
  render: () => (
    <ThemedCard variant="outline">
      <ThemedCardHeader>
        <ThemedCardTitle>Outline Card</ThemedCardTitle>
        <ThemedCardDescription>This is an outline card</ThemedCardDescription>
      </ThemedCardHeader>
      <ThemedCardContent>
        <p>Content with outline styling</p>
      </ThemedCardContent>
    </ThemedCard>
  ),
};

// With hover and shadow
export const WithHoverAndShadow: Story = {
  render: () => (
    <ThemedCard withHover withShadow>
      <ThemedCardHeader>
        <ThemedCardTitle>Interactive Card</ThemedCardTitle>
        <ThemedCardDescription>This card has hover and shadow effects</ThemedCardDescription>
      </ThemedCardHeader>
      <ThemedCardContent>
        <p>Hover over this card to see the effect</p>
      </ThemedCardContent>
    </ThemedCard>
  ),
};

// Card with footer actions
export const WithFooterActions: Story = {
  render: () => (
    <ThemedCard>
      <ThemedCardHeader>
        <ThemedCardTitle>Card with Actions</ThemedCardTitle>
        <ThemedCardDescription>This card has action buttons in the footer</ThemedCardDescription>
      </ThemedCardHeader>
      <ThemedCardContent>
        <p>Content with some information that requires action</p>
      </ThemedCardContent>
      <ThemedCardFooter className="justify-end space-x-2">
        <button className="px-4 py-2 rounded-md bg-muted text-muted-foreground text-sm">
          Cancel
        </button>
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">
          Save
        </button>
      </ThemedCardFooter>
    </ThemedCard>
  ),
};

// Dark theme card
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="dark">
        <div style={{ width: '350px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  render: () => (
    <ThemedCard withShadow>
      <ThemedCardHeader>
        <ThemedCardTitle>Dark Theme Card</ThemedCardTitle>
        <ThemedCardDescription>This card is shown in dark theme</ThemedCardDescription>
      </ThemedCardHeader>
      <ThemedCardContent>
        <p>Content with dark theme styling</p>
      </ThemedCardContent>
    </ThemedCard>
  ),
};