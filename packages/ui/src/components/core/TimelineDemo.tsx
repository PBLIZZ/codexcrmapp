'use client';

import { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineDot,
} from '../ui/timeline';

export interface TimelineDemoProps {
  className?: string;
}

export function TimelineDemo({ className }: TimelineDemoProps) {
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical');

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Timeline Components</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setOrientation('vertical')}
            className={cn(
              'px-3 py-1 rounded-md',
              orientation === 'vertical'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            Vertical
          </button>
          <button
            onClick={() => setOrientation('horizontal')}
            className={cn(
              'px-3 py-1 rounded-md',
              orientation === 'horizontal'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            Horizontal
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Basic Timeline</h3>
          <div className="p-4 border border-border rounded-lg">
            <Timeline orientation={orientation}>
              <TimelineItem active orientation={orientation}>
                <TimelineContent
                  title="Project Created"
                  subtitle="Initial project setup and configuration"
                  date="June 1, 2025"
                >
                  <p className="text-sm">
                    Created the project repository and set up the initial development environment.
                  </p>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem active orientation={orientation}>
                <TimelineContent
                  title="Design Phase"
                  subtitle="UI/UX design and prototyping"
                  date="June 5, 2025"
                >
                  <p className="text-sm">
                    Completed the design mockups and user flow diagrams.
                  </p>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem active orientation={orientation}>
                <TimelineContent
                  title="Development Started"
                  subtitle="Frontend and backend implementation"
                  date="June 10, 2025"
                >
                  <p className="text-sm">
                    Started implementing the core features and functionality.
                  </p>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem orientation={orientation}>
                <TimelineContent
                  title="Testing Phase"
                  subtitle="QA and user testing"
                  date="June 20, 2025"
                >
                  <p className="text-sm">
                    Conducting comprehensive testing to ensure quality and reliability.
                  </p>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem orientation={orientation} connector={false}>
                <TimelineContent
                  title="Deployment"
                  subtitle="Production release"
                  date="June 30, 2025"
                >
                  <p className="text-sm">
                    Deploying the application to production environment.
                  </p>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Timeline with Custom Icons</h3>
          <div className="p-4 border border-border rounded-lg">
            <Timeline orientation={orientation}>
              <TimelineItem
                orientation={orientation}
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
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                }
              >
                <TimelineContent
                  title="Project Created"
                  date="June 1, 2025"
                />
              </TimelineItem>

              <TimelineItem
                orientation={orientation}
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
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                }
              >
                <TimelineContent
                  title="Documentation"
                  date="June 5, 2025"
                />
              </TimelineItem>

              <TimelineItem
                orientation={orientation}
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
                    <path d="m18 16 4-4-4-4" />
                    <path d="m6 8-4 4 4 4" />
                    <path d="m14.5 4-5 16" />
                  </svg>
                }
              >
                <TimelineContent
                  title="Development"
                  date="June 10, 2025"
                />
              </TimelineItem>

              <TimelineItem
                orientation={orientation}
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
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                }
              >
                <TimelineContent
                  title="Testing"
                  date="June 20, 2025"
                />
              </TimelineItem>

              <TimelineItem
                orientation={orientation}
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
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                }
              >
                <TimelineContent
                  title="Deployment"
                  date="June 30, 2025"
                />
              </TimelineItem>
            </Timeline>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Timeline with Separators</h3>
          <div className="p-4 border border-border rounded-lg">
            <Timeline orientation={orientation}>
              <TimelineSeparator label="Planning Phase" />

              <TimelineItem active orientation={orientation}>
                <TimelineContent
                  title="Requirements Gathering"
                  date="May 15, 2025"
                />
              </TimelineItem>

              <TimelineItem active orientation={orientation}>
                <TimelineContent
                  title="Project Scoping"
                  date="May 20, 2025"
                />
              </TimelineItem>

              <TimelineSeparator label="Design Phase" />

              <TimelineItem active orientation={orientation}>
                <TimelineContent
                  title="UI/UX Design"
                  date="June 1, 2025"
                />
              </TimelineItem>

              <TimelineItem active orientation={orientation}>
                <TimelineContent
                  title="Prototype Review"
                  date="June 10, 2025"
                />
              </TimelineItem>

              <TimelineSeparator label="Implementation Phase" />

              <TimelineItem orientation={orientation}>
                <TimelineContent
                  title="Development"
                  date="June 15, 2025"
                />
              </TimelineItem>

              <TimelineItem orientation={orientation} connector={false}>
                <TimelineContent
                  title="Testing & Deployment"
                  date="June 30, 2025"
                />
              </TimelineItem>
            </Timeline>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Timeline Variants</h3>
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium mb-3">Compact Timeline</h4>
            <Timeline orientation={orientation} compact>
              <TimelineItem active orientation={orientation}>
                <TimelineContent title="Step 1" date="9:00 AM" />
              </TimelineItem>
              <TimelineItem active orientation={orientation}>
                <TimelineContent title="Step 2" date="10:30 AM" />
              </TimelineItem>
              <TimelineItem active orientation={orientation}>
                <TimelineContent title="Step 3" date="12:00 PM" />
              </TimelineItem>
              <TimelineItem orientation={orientation}>
                <TimelineContent title="Step 4" date="2:30 PM" />
              </TimelineItem>
              <TimelineItem orientation={orientation} connector={false}>
                <TimelineContent title="Step 5" date="4:00 PM" />
              </TimelineItem>
            </Timeline>

            <h4 className="font-medium mt-6 mb-3">Dashed Connector</h4>
            <Timeline orientation={orientation}>
              <TimelineItem active orientation={orientation} connectorStyle="dashed">
                <TimelineContent title="Task 1" date="Monday" />
              </TimelineItem>
              <TimelineItem active orientation={orientation} connectorStyle="dashed">
                <TimelineContent title="Task 2" date="Tuesday" />
              </TimelineItem>
              <TimelineItem orientation={orientation} connectorStyle="dashed">
                <TimelineContent title="Task 3" date="Wednesday" />
              </TimelineItem>
              <TimelineItem orientation={orientation} connectorStyle="dashed" connector={false}>
                <TimelineContent title="Task 4" date="Thursday" />
              </TimelineItem>
            </Timeline>

            <h4 className="font-medium mt-6 mb-3">Colored Timeline</h4>
            <Timeline orientation={orientation}>
              <TimelineItem
                active
                orientation={orientation}
                iconBackground="#4CAF50"
                connectorColor="#4CAF50"
              >
                <TimelineContent title="Success" date="Completed" />
              </TimelineItem>
              <TimelineItem
                active
                orientation={orientation}
                iconBackground="#2196F3"
                connectorColor="#2196F3"
              >
                <TimelineContent title="Info" date="In Progress" />
              </TimelineItem>
              <TimelineItem
                orientation={orientation}
                iconBackground="#FFC107"
                connectorColor="#FFC107"
              >
                <TimelineContent title="Warning" date="Pending" />
              </TimelineItem>
              <TimelineItem
                orientation={orientation}
                iconBackground="#F44336"
                connectorColor="#F44336"
                connector={false}
              >
                <TimelineContent title="Error" date="Failed" />
              </TimelineItem>
            </Timeline>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Timeline Components</h3>
          <div className="p-4 border border-border rounded-lg space-y-4">
            <div>
              <h4 className="font-medium mb-2">Timeline Dots</h4>
              <div className="flex items-center space-x-4">
                <TimelineDot size="sm" />
                <TimelineDot size="md" />
                <TimelineDot size="lg" />
                <TimelineDot size="md" active />
                <TimelineDot size="md" variant="outlined" />
                <TimelineDot size="md" variant="outlined" active />
                <TimelineDot size="md" color="#4CAF50" />
                <TimelineDot size="md" color="#F44336" />
                <TimelineDot size="md" variant="outlined" color="#2196F3" />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Timeline Separators</h4>
              <TimelineSeparator label="Phase 1" />
              <TimelineSeparator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}