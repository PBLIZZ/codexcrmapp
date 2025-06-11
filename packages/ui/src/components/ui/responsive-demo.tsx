'use client';

import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../core/ThemeProvider';
import { 
  Container, 
  Grid, 
  GridItem, 
  Flex, 
  Stack, 
  HStack, 
  Responsive 
} from './responsive-layout';
import { MetricCard, SimpleLineChart, CircularProgress } from './metric-card';
import { ContactCard, ContactCallButton, ContactEmailButton, ContactMessageButton } from './contact-card';
import { TaskCard, TaskList } from './task-card';
import { Timeline, TimelineItem, TimelineContent } from './timeline';
import { 
  getResponsiveValue, 
  useBreakpoint, 
  responsiveClasses,
  isMobileDevice,
  supportsHover
} from '../../lib/responsive';

// Responsive demo component
export interface ResponsiveDemoProps extends React.HTMLAttributes<HTMLDivElement> {
  showControls?: boolean;
}

export const ResponsiveDemo = ({ className, showControls = true, ...props }: ResponsiveDemoProps) => {
  const { isDarkMode, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const currentBreakpoint = useBreakpoint();
  
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Sample data for components
  const metricData = [10, 25, 15, 30, 20, 35, 25, 40, 30, 45];
  const isMobile = isMobileDevice();
  const hasHover = supportsHover();

  return (
    <div className={cn('space-y-8', className)} {...props}>
      {/* Demo controls */}
      {showControls && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium">Responsive Demo</h2>
              <p className="text-sm text-muted-foreground">
                Current width: {windowWidth}px | Breakpoint: {currentBreakpoint}
              </p>
              <p className="text-sm text-muted-foreground">
                Device: {isMobile ? 'Mobile' : 'Desktop'} | Hover: {hasHover ? 'Supported' : 'Not supported'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
            >
              Toggle Theme ({isDarkMode ? 'Dark' : 'Light'})
            </button>
          </div>
        </div>
      )}

      {/* Responsive layout demo */}
      <section>
        <h3 className="text-lg font-medium mb-4">Responsive Layout</h3>
        <Container className="mb-4 p-4 border border-dashed border-border rounded-lg">
          <p className="text-center text-sm text-muted-foreground">Container (max-width adapts to breakpoint)</p>
        </Container>

        <Grid columns={{ xs: 12, sm: 12, md: 12, lg: 12 }} className="mb-4 gap-4">
          <GridItem colSpan={{ xs: 12, md: 6, lg: 4 }} className="p-4 bg-primary/10 rounded-lg">
            <p className="text-center text-sm">Full width on mobile, half on tablet, third on desktop</p>
          </GridItem>
          <GridItem colSpan={{ xs: 12, md: 6, lg: 4 }} className="p-4 bg-primary/10 rounded-lg">
            <p className="text-center text-sm">Full width on mobile, half on tablet, third on desktop</p>
          </GridItem>
          <GridItem colSpan={{ xs: 12, md: 12, lg: 4 }} className="p-4 bg-primary/10 rounded-lg">
            <p className="text-center text-sm">Full width on mobile and tablet, third on desktop</p>
          </GridItem>
        </Grid>

        <Flex
          direction="column"
          responsive={{
            md: { direction: 'row' }
          }}
          className="mb-4 gap-4"
        >
          <div className="flex-1 p-4 bg-accent/10 rounded-lg">
            <p className="text-center text-sm">Stacks vertically on mobile, horizontally on larger screens</p>
          </div>
          <div className="flex-1 p-4 bg-accent/10 rounded-lg">
            <p className="text-center text-sm">Stacks vertically on mobile, horizontally on larger screens</p>
          </div>
        </Flex>
      </section>

      {/* Responsive components demo */}
      <section>
        <h3 className="text-lg font-medium mb-4">Responsive Components</h3>
        
        <h4 className="text-md font-medium mb-2">Metric Cards</h4>
        <Grid columns={{ xs: 12, sm: 12, md: 12, lg: 12 }} className="mb-6 gap-4">
          <GridItem colSpan={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetricCard 
              title="Total Users" 
              value="1,234" 
              trend="up" 
              trendValue="+12%" 
              size={getResponsiveValue({ xs: 'sm', md: 'md' }, 'md')}
              withShadow
            />
          </GridItem>
          <GridItem colSpan={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetricCard 
              title="Revenue" 
              value="$12,345" 
              trend="up" 
              trendValue="+8%" 
              size={getResponsiveValue({ xs: 'sm', md: 'md' }, 'md')}
              withShadow
              chart={<SimpleLineChart data={metricData} height={30} />}
            />
          </GridItem>
          <GridItem colSpan={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetricCard 
              title="Conversion" 
              value="24%" 
              trend="down" 
              trendValue="-2%" 
              size={getResponsiveValue({ xs: 'sm', md: 'md' }, 'md')}
              withShadow
              footer={<CircularProgress value={24} size={36} showValue />}
            />
          </GridItem>
          <GridItem colSpan={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetricCard 
              title="Active Sessions" 
              value="256" 
              trend="neutral" 
              size={getResponsiveValue({ xs: 'sm', md: 'md' }, 'md')}
              withShadow
            />
          </GridItem>
        </Grid>
        
        <h4 className="text-md font-medium mb-2">Contact Cards</h4>
        <Grid columns={{ xs: 12, sm: 12, md: 12, lg: 12 }} className="mb-6 gap-4">
          <GridItem colSpan={{ xs: 12, md: 6 }}>
            <ContactCard
              name="Jane Smith"
              title="Product Manager"
              company="Wellness Tech Inc."
              avatar={{ 
                initials: "JS", 
                status: "online" 
              }}
              contactInfo={{
                email: "jane.smith@example.com",
                phone: "(555) 123-4567"
              }}
              layout={getResponsiveValue({ xs: 'vertical', md: 'horizontal' }, 'vertical')}
              size={getResponsiveValue({ xs: 'sm', md: 'md' }, 'md')}
              withShadow
              actions={
                <div className={responsiveClasses('flex', { xs: 'flex-row', md: 'flex-col' })}>
                  <ContactCallButton className="mr-2 md:mr-0 md:mb-2" />
                  <ContactEmailButton />
                </div>
              }
            />
          </GridItem>
          <GridItem colSpan={{ xs: 12, md: 6 }}>
            <ContactCard
              name="John Doe"
              title="Wellness Coach"
              company="Fitness First"
              avatar={{ 
                initials: "JD", 
                status: "busy" 
              }}
              contactInfo={{
                email: "john.doe@example.com",
                mobile: "(555) 987-6543"
              }}
              layout={getResponsiveValue({ xs: 'vertical', md: 'horizontal' }, 'vertical')}
              size={getResponsiveValue({ xs: 'sm', md: 'md' }, 'md')}
              withShadow
              actions={
                <div className={responsiveClasses('flex', { xs: 'flex-row', md: 'flex-col' })}>
                  <ContactCallButton className="mr-2 md:mr-0 md:mb-2" />
                  <ContactMessageButton />
                </div>
              }
            />
          </GridItem>
        </Grid>
        
        <h4 className="text-md font-medium mb-2">Task Cards</h4>
        <TaskList 
          layout="grid" 
          columns={getResponsiveValue({ xs: 1, md: 2, lg: 3 }, 2) as 1 | 2 | 3 | 4}
          gap="md"
          className="mb-6"
          tasks={[
            {
              title: "Update user dashboard",
              description: "Implement new metrics and charts for the wellness tracking dashboard",
              priority: "high",
              status: "in-progress",
              progress: 60,
              dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
              assignee: { name: "Jane Smith" },
              tags: ["UI", "Dashboard"],
              size: getResponsiveValue({ xs: 'sm', md: 'md' }, 'md'),
              withShadow: true
            },
            {
              title: "Fix mobile navigation",
              description: "Resolve issues with the mobile navigation menu on small screens",
              priority: "medium",
              status: "todo",
              dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
              assignee: { name: "John Doe" },
              tags: ["Mobile", "Bug"],
              size: getResponsiveValue({ xs: 'sm', md: 'md' }, 'md'),
              withShadow: true
            },
            {
              title: "Implement dark mode",
              description: "Add dark mode support to all components and pages",
              priority: "low",
              status: "review",
              progress: 90,
              dueDate: new Date(Date.now() + 86400000 * 1), // 1 day from now
              assignee: { name: "Alex Johnson" },
              tags: ["UI", "Theme"],
              size: getResponsiveValue({ xs: 'sm', md: 'md' }, 'md'),
              withShadow: true
            }
          ]}
        />
        
        <h4 className="text-md font-medium mb-2">Timeline</h4>
        <Timeline 
          orientation={getResponsiveValue({ xs: 'vertical', lg: 'horizontal' }, 'vertical')}
          compact={getResponsiveValue({ xs: true, md: false }, false)}
          className="mb-6"
        >
          <TimelineItem active>
            <TimelineContent 
              title="Project Started" 
              subtitle="Initial project setup and planning" 
              date="June 1, 2025"
            >
              <p className="text-sm">Created repository and set up development environment</p>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem active>
            <TimelineContent 
              title="Design Phase" 
              subtitle="UI/UX design and prototyping" 
              date="June 5, 2025"
            >
              <p className="text-sm">Completed wireframes and design system</p>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineContent 
              title="Development" 
              subtitle="Frontend and backend implementation" 
              date="June 10, 2025"
            />
          </TimelineItem>
          <TimelineItem>
            <TimelineContent 
              title="Testing" 
              subtitle="QA and user testing" 
              date="June 20, 2025"
            />
          </TimelineItem>
          <TimelineItem>
            <TimelineContent 
              title="Launch" 
              subtitle="Production deployment" 
              date="July 1, 2025"
            />
          </TimelineItem>
        </Timeline>
      </section>

      {/* Responsive behavior explanation */}
      <section className="p-4 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Responsive Design Implementation</h3>
        <p className="text-sm mb-2">This demo showcases the following responsive design patterns:</p>
        <ul className="text-sm list-disc list-inside space-y-1">
          <li>Mobile-first approach with progressive enhancement</li>
          <li>Responsive grid layouts that adapt to screen size</li>
          <li>Flexible components that change layout based on breakpoints</li>
          <li>Dynamic spacing and sizing based on viewport</li>
          <li>Touch-optimized interfaces for mobile devices</li>
          <li>Conditional rendering based on device capabilities</li>
        </ul>
      </section>
    </div>
  );
};

ResponsiveDemo.displayName = 'ResponsiveDemo';