import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveDemo } from '../components/ui/responsive-demo';
import { ThemeProvider } from '../components/core/ThemeProvider';

const meta: Meta<typeof ResponsiveDemo> = {
  title: 'Demo/ResponsiveDemo',
  component: ResponsiveDemo,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <div className="p-6">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    showControls: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ResponsiveDemo>;

// Full demo with controls
export const FullDemo: Story = {
  args: {
    showControls: true,
  },
};

// Demo without controls
export const WithoutControls: Story = {
  args: {
    showControls: false,
  },
};

// Demo with light theme
export const LightTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light" disableToggle>
        <div className="p-6">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  args: {
    showControls: true,
  },
};

// Demo with dark theme
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="dark" disableToggle>
        <div className="p-6">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  args: {
    showControls: true,
  },
};