'use client';

import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from './ThemeProvider';
import { themeConfig } from '../../lib/theme';
import {
  ThemedCard,
  ThemedCardHeader,
  ThemedCardTitle,
  ThemedCardDescription,
  ThemedCardContent,
  ThemedCardFooter,
} from '../ui/themed-card';

export interface ThemeDemoProps {
  className?: string;
}

export function ThemeDemo({ className }: ThemeDemoProps) {
  const { theme, setTheme, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'colors' | 'components'>('colors');

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Theme Demonstration</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTheme('light')}
            className={cn(
              'px-3 py-1 rounded-md',
              theme === 'light'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={cn(
              'px-3 py-1 rounded-md',
              theme === 'dark'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme('system')}
            className={cn(
              'px-3 py-1 rounded-md',
              theme === 'system'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            System
          </button>
        </div>
      </div>

      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setActiveTab('colors')}
          className={cn(
            'px-4 py-2',
            activeTab === 'colors'
              ? 'border-b-2 border-primary font-medium'
              : 'text-muted-foreground'
          )}
        >
          Color Palette
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={cn(
            'px-4 py-2',
            activeTab === 'components'
              ? 'border-b-2 border-primary font-medium'
              : 'text-muted-foreground'
          )}
        >
          Components
        </button>
      </div>

      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Primary Colors (Teal)</h3>
            <div className="grid grid-cols-5 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={`primary-${shade}`} className="space-y-1.5">
                  <div
                    className={`h-10 w-full rounded-md`}
                    style={{ backgroundColor: `var(--primary-${shade})` }}
                  />
                  <div className="text-xs">
                    <div className="font-medium">Primary {shade}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Accent Colors (Orange)</h3>
            <div className="grid grid-cols-5 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={`accent-${shade}`} className="space-y-1.5">
                  <div
                    className={`h-10 w-full rounded-md`}
                    style={{ backgroundColor: `var(--accent-${shade})` }}
                  />
                  <div className="text-xs">
                    <div className="font-medium">Accent {shade}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">UI Colors</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <div
                  className={`h-10 w-full rounded-md`}
                  style={{ backgroundColor: `var(--background)` }}
                />
                <div className="text-xs">
                  <div className="font-medium">Background</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div
                  className={`h-10 w-full rounded-md`}
                  style={{ backgroundColor: `var(--foreground)` }}
                />
                <div className="text-xs">
                  <div className="font-medium">Foreground</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div
                  className={`h-10 w-full rounded-md`}
                  style={{ backgroundColor: `var(--card)` }}
                />
                <div className="text-xs">
                  <div className="font-medium">Card</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div
                  className={`h-10 w-full rounded-md`}
                  style={{ backgroundColor: `var(--card-foreground)` }}
                />
                <div className="text-xs">
                  <div className="font-medium">Card Foreground</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div
                  className={`h-10 w-full rounded-md`}
                  style={{ backgroundColor: `var(--muted)` }}
                />
                <div className="text-xs">
                  <div className="font-medium">Muted</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div
                  className={`h-10 w-full rounded-md`}
                  style={{ backgroundColor: `var(--muted-foreground)` }}
                />
                <div className="text-xs">
                  <div className="font-medium">Muted Foreground</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'components' && (
        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Card Variants</h3>
            <div className="grid grid-cols-2 gap-4">
              <ThemedCard>
                <ThemedCardHeader>
                  <ThemedCardTitle>Default Card</ThemedCardTitle>
                  <ThemedCardDescription>
                    This is a default card with no special styling
                  </ThemedCardDescription>
                </ThemedCardHeader>
                <ThemedCardContent>
                  <p>Card content goes here</p>
                </ThemedCardContent>
                <ThemedCardFooter>
                  <p className="text-sm text-muted-foreground">Last updated: Today</p>
                </ThemedCardFooter>
              </ThemedCard>

              <ThemedCard variant="primary">
                <ThemedCardHeader>
                  <ThemedCardTitle>Primary Card</ThemedCardTitle>
                  <ThemedCardDescription>
                    This card uses the primary color
                  </ThemedCardDescription>
                </ThemedCardHeader>
                <ThemedCardContent>
                  <p>Card content goes here</p>
                </ThemedCardContent>
                <ThemedCardFooter>
                  <p className="text-sm opacity-80">Last updated: Today</p>
                </ThemedCardFooter>
              </ThemedCard>

              <ThemedCard variant="accent">
                <ThemedCardHeader>
                  <ThemedCardTitle>Accent Card</ThemedCardTitle>
                  <ThemedCardDescription>
                    This card uses the accent color
                  </ThemedCardDescription>
                </ThemedCardHeader>
                <ThemedCardContent>
                  <p>Card content goes here</p>
                </ThemedCardContent>
                <ThemedCardFooter>
                  <p className="text-sm opacity-80">Last updated: Today</p>
                </ThemedCardFooter>
              </ThemedCard>

              <ThemedCard variant="outline" withShadow>
                <ThemedCardHeader>
                  <ThemedCardTitle>Outline Card with Shadow</ThemedCardTitle>
                  <ThemedCardDescription>
                    This card has an outline and shadow
                  </ThemedCardDescription>
                </ThemedCardHeader>
                <ThemedCardContent>
                  <p>Card content goes here</p>
                </ThemedCardContent>
                <ThemedCardFooter>
                  <p className="text-sm text-muted-foreground">Last updated: Today</p>
                </ThemedCardFooter>
              </ThemedCard>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Card Sizes</h3>
            <div className="grid grid-cols-3 gap-4">
              <ThemedCard size="sm">
                <ThemedCardHeader>
                  <ThemedCardTitle>Small Card</ThemedCardTitle>
                </ThemedCardHeader>
                <ThemedCardContent>
                  <p>Compact content</p>
                </ThemedCardContent>
              </ThemedCard>

              <ThemedCard size="md">
                <ThemedCardHeader>
                  <ThemedCardTitle>Medium Card</ThemedCardTitle>
                </ThemedCardHeader>
                <ThemedCardContent>
                  <p>Standard content</p>
                </ThemedCardContent>
              </ThemedCard>

              <ThemedCard size="lg">
                <ThemedCardHeader>
                  <ThemedCardTitle>Large Card</ThemedCardTitle>
                </ThemedCardHeader>
                <ThemedCardContent>
                  <p>Spacious content</p>
                </ThemedCardContent>
              </ThemedCard>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Interactive Cards</h3>
            <div className="grid grid-cols-2 gap-4">
              <ThemedCard withHover>
                <ThemedCardHeader>
                  <ThemedCardTitle>Hover Effect</ThemedCardTitle>
                  <ThemedCardDescription>
                    This card has a hover effect
                  </ThemedCardDescription>
                </ThemedCardHeader>
                <ThemedCardContent>
                  <p>Hover over me</p>
                </ThemedCardContent>
              </ThemedCard>

              <ThemedCard withHover withShadow>
                <ThemedCardHeader>
                  <ThemedCardTitle>Hover + Shadow</ThemedCardTitle>
                  <ThemedCardDescription>
                    This card has hover and shadow effects
                  </ThemedCardDescription>
                </ThemedCardHeader>
                <ThemedCardContent>
                  <p>Hover over me</p>
                </ThemedCardContent>
              </ThemedCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}