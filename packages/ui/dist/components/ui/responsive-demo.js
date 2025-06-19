'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../core/ThemeProvider';
import { Container, Grid, GridItem, Flex } from './responsive-layout';
import { MetricCard, SimpleLineChart, CircularProgress } from './metric-card';
import { ContactCard, ContactCallButton, ContactEmailButton, ContactMessageButton, } from './contact-card';
import { TaskList } from './task-card';
import { Timeline, TimelineItem, TimelineContent } from './timeline';
import { getResponsiveValue, useBreakpoint, responsiveClasses, isMobileDevice, supportsHover, } from '../../lib/responsive';
export const ResponsiveDemo = ({ className, showControls = true, ...props }) => {
    const { isDarkMode, setTheme } = useTheme();
    const toggleTheme = () => {
        setTheme(isDarkMode ? 'light' : 'dark');
    };
    const [windowWidth, setWindowWidth] = useState(0);
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
    return (_jsxs("div", { className: cn('space-y-8', className), ...props, children: [showControls && (_jsx("div", { className: "p-4 bg-muted/30 rounded-lg", children: _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-medium", children: "Responsive Demo" }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Current width: ", windowWidth, "px | Breakpoint: ", currentBreakpoint] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Device: ", isMobile ? 'Mobile' : 'Desktop', " | Hover:", ' ', hasHover ? 'Supported' : 'Not supported'] })] }), _jsxs("button", { onClick: toggleTheme, className: "px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm", children: ["Toggle Theme (", isDarkMode ? 'Dark' : 'Light', ")"] })] }) })), _jsxs("section", { children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Responsive Layout" }), _jsx(Container, { className: "mb-4 p-4 border border-dashed border-border rounded-lg", children: _jsx("p", { className: "text-center text-sm text-muted-foreground", children: "Container (max-width adapts to breakpoint)" }) }), _jsxs(Grid, { columns: { xs: 12, sm: 12, md: 12, lg: 12 }, className: "mb-4 gap-4", children: [_jsx(GridItem, { colSpan: { xs: 12, md: 6, lg: 4 }, className: "p-4 bg-primary/10 rounded-lg", children: _jsx("p", { className: "text-center text-sm", children: "Full width on mobile, half on tablet, third on desktop" }) }), _jsx(GridItem, { colSpan: { xs: 12, md: 6, lg: 4 }, className: "p-4 bg-primary/10 rounded-lg", children: _jsx("p", { className: "text-center text-sm", children: "Full width on mobile, half on tablet, third on desktop" }) }), _jsx(GridItem, { colSpan: { xs: 12, md: 12, lg: 4 }, className: "p-4 bg-primary/10 rounded-lg", children: _jsx("p", { className: "text-center text-sm", children: "Full width on mobile and tablet, third on desktop" }) })] }), _jsxs(Flex, { direction: "column", responsive: {
                            md: { direction: 'row' },
                        }, className: "mb-4 gap-4", children: [_jsx("div", { className: "flex-1 p-4 bg-accent/10 rounded-lg", children: _jsx("p", { className: "text-center text-sm", children: "Stacks vertically on mobile, horizontally on larger screens" }) }), _jsx("div", { className: "flex-1 p-4 bg-accent/10 rounded-lg", children: _jsx("p", { className: "text-center text-sm", children: "Stacks vertically on mobile, horizontally on larger screens" }) })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Responsive Components" }), _jsx("h4", { className: "text-md font-medium mb-2", children: "Metric Cards" }), _jsxs(Grid, { columns: { xs: 12, sm: 12, md: 12, lg: 12 }, className: "mb-6 gap-4", children: [_jsx(GridItem, { colSpan: { xs: 12, sm: 6, md: 4, lg: 3 }, children: _jsx(MetricCard, { title: "Total Users", value: "1,234", trend: "up", trendValue: "+12%", size: getResponsiveValue({ xs: 'sm', md: 'md' }, 'md'), withShadow: true }) }), _jsx(GridItem, { colSpan: { xs: 12, sm: 6, md: 4, lg: 3 }, children: _jsx(MetricCard, { title: "Revenue", value: "$12,345", trend: "up", trendValue: "+8%", size: getResponsiveValue({ xs: 'sm', md: 'md' }, 'md'), withShadow: true, chart: _jsx(SimpleLineChart, { data: metricData, height: 30 }) }) }), _jsx(GridItem, { colSpan: { xs: 12, sm: 6, md: 4, lg: 3 }, children: _jsx(MetricCard, { title: "Conversion", value: "24%", trend: "down", trendValue: "-2%", size: getResponsiveValue({ xs: 'sm', md: 'md' }, 'md'), withShadow: true, footer: _jsx(CircularProgress, { value: 24, size: 36, showValue: true }) }) }), _jsx(GridItem, { colSpan: { xs: 12, sm: 6, md: 4, lg: 3 }, children: _jsx(MetricCard, { title: "Active Sessions", value: "256", trend: "neutral", size: getResponsiveValue({ xs: 'sm', md: 'md' }, 'md'), withShadow: true }) })] }), _jsx("h4", { className: "text-md font-medium mb-2", children: "Contact Cards" }), _jsxs(Grid, { columns: { xs: 12, sm: 12, md: 12, lg: 12 }, className: "mb-6 gap-4", children: [_jsx(GridItem, { colSpan: { xs: 12, md: 6 }, children: _jsx(ContactCard, { name: "Jane Smith", title: "Product Manager", company: "Wellness Tech Inc.", avatar: {
                                        initials: 'JS',
                                        status: 'online',
                                    }, contactInfo: {
                                        email: 'jane.smith@example.com',
                                        phone: '(555) 123-4567',
                                    }, layout: getResponsiveValue({ xs: 'vertical', md: 'horizontal' }, 'vertical'), size: getResponsiveValue({ xs: 'sm', md: 'md' }, 'md'), withShadow: true, actions: _jsxs("div", { className: responsiveClasses('flex', {
                                            xs: 'flex-row',
                                            md: 'flex-col',
                                        }), children: [_jsx(ContactCallButton, { className: "mr-2 md:mr-0 md:mb-2" }), _jsx(ContactEmailButton, {})] }) }) }), _jsx(GridItem, { colSpan: { xs: 12, md: 6 }, children: _jsx(ContactCard, { name: "John Doe", title: "Wellness Coach", company: "Fitness First", avatar: {
                                        initials: 'JD',
                                        status: 'busy',
                                    }, contactInfo: {
                                        email: 'john.doe@example.com',
                                        mobile: '(555) 987-6543',
                                    }, layout: getResponsiveValue({ xs: 'vertical', md: 'horizontal' }, 'vertical'), size: getResponsiveValue({ xs: 'sm', md: 'md' }, 'md'), withShadow: true, actions: _jsxs("div", { className: responsiveClasses('flex', {
                                            xs: 'flex-row',
                                            md: 'flex-col',
                                        }), children: [_jsx(ContactCallButton, { className: "mr-2 md:mr-0 md:mb-2" }), _jsx(ContactMessageButton, {})] }) }) })] }), _jsx("h4", { className: "text-md font-medium mb-2", children: "Task Cards" }), _jsx(TaskList, { layout: "grid", columns: getResponsiveValue({ xs: 1, md: 2, lg: 3 }, 2), gap: "md", className: "mb-6", tasks: [
                            {
                                title: 'Update user dashboard',
                                description: 'Implement new metrics and charts for the wellness tracking dashboard',
                                priority: 'high',
                                status: 'in-progress',
                                progress: 60,
                                dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
                                assignee: { name: 'Jane Smith' },
                                tags: ['UI', 'Dashboard'],
                                size: getResponsiveValue({ xs: 'sm', md: 'md' }, 'md'),
                                withShadow: true,
                            },
                            {
                                title: 'Fix mobile navigation',
                                description: 'Resolve issues with the mobile navigation menu on small screens',
                                priority: 'medium',
                                status: 'todo',
                                dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
                                assignee: { name: 'John Doe' },
                                tags: ['Mobile', 'Bug'],
                                size: getResponsiveValue({ xs: 'sm', md: 'md' }, 'md'),
                                withShadow: true,
                            },
                            {
                                title: 'Implement dark mode',
                                description: 'Add dark mode support to all components and pages',
                                priority: 'low',
                                status: 'review',
                                progress: 90,
                                dueDate: new Date(Date.now() + 86400000 * 1), // 1 day from now
                                assignee: { name: 'Alex Johnson' },
                                tags: ['UI', 'Theme'],
                                size: getResponsiveValue({ xs: 'sm', md: 'md' }, 'md'),
                                withShadow: true,
                            },
                        ] }), _jsx("h4", { className: "text-md font-medium mb-2", children: "Timeline" }), _jsxs(Timeline, { orientation: getResponsiveValue({ xs: 'vertical', lg: 'horizontal' }, 'vertical'), compact: getResponsiveValue({ xs: true, md: false }, false), className: "mb-6", children: [_jsx(TimelineItem, { active: true, children: _jsx(TimelineContent, { title: "Project Started", subtitle: "Initial project setup and planning", date: "June 1, 2025", children: _jsx("p", { className: "text-sm", children: "Created repository and set up development environment" }) }) }), _jsx(TimelineItem, { active: true, children: _jsx(TimelineContent, { title: "Design Phase", subtitle: "UI/UX design and prototyping", date: "June 5, 2025", children: _jsx("p", { className: "text-sm", children: "Completed wireframes and design system" }) }) }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Development", subtitle: "Frontend and backend implementation", date: "June 10, 2025" }) }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Testing", subtitle: "QA and user testing", date: "June 20, 2025" }) }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Launch", subtitle: "Production deployment", date: "July 1, 2025" }) })] })] }), _jsxs("section", { className: "p-4 bg-muted/30 rounded-lg", children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Responsive Design Implementation" }), _jsx("p", { className: "text-sm mb-2", children: "This demo showcases the following responsive design patterns:" }), _jsxs("ul", { className: "text-sm list-disc list-inside space-y-1", children: [_jsx("li", { children: "Mobile-first approach with progressive enhancement" }), _jsx("li", { children: "Responsive grid layouts that adapt to screen size" }), _jsx("li", { children: "Flexible components that change layout based on breakpoints" }), _jsx("li", { children: "Dynamic spacing and sizing based on viewport" }), _jsx("li", { children: "Touch-optimized interfaces for mobile devices" }), _jsx("li", { children: "Conditional rendering based on device capabilities" })] })] })] }));
};
ResponsiveDemo.displayName = 'ResponsiveDemo';
//# sourceMappingURL=responsive-demo.js.map