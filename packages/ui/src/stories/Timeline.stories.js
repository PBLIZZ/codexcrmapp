import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Timeline, TimelineItem, TimelineContent, TimelineSeparator, TimelineDot } from '../components/ui/timeline';
import { ThemeProvider } from '../components/core/ThemeProvider';
const meta = {
    title: 'UI/Timeline',
    component: Timeline,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (_jsx(ThemeProvider, { defaultTheme: "light", children: _jsx("div", { style: { width: '500px' }, children: _jsx(Story, {}) }) })),
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
// Basic vertical timeline
export const BasicVertical = {
    render: () => (_jsxs(Timeline, { children: [_jsx(TimelineItem, { active: true, children: _jsx(TimelineContent, { title: "Project Started", subtitle: "Initial project setup and planning", date: "Jan 15, 2025", children: _jsx("p", { className: "text-sm", children: "Created repository and set up development environment." }) }) }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Design Phase", subtitle: "UI/UX design and prototyping", date: "Feb 1, 2025", children: _jsx("p", { className: "text-sm", children: "Completed wireframes and design mockups." }) }) }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Development", subtitle: "Frontend and backend implementation", date: "Mar 10, 2025" }) }), _jsx(TimelineItem, { connector: false, children: _jsx(TimelineContent, { title: "Launch", subtitle: "Product release and marketing", date: "Apr 20, 2025" }) })] })),
};
// Horizontal timeline
export const Horizontal = {
    render: () => (_jsxs(Timeline, { orientation: "horizontal", children: [_jsx(TimelineItem, { orientation: "horizontal", active: true, children: _jsx(TimelineContent, { title: "Step 1", subtitle: "Planning" }) }), _jsx(TimelineItem, { orientation: "horizontal", children: _jsx(TimelineContent, { title: "Step 2", subtitle: "Design" }) }), _jsx(TimelineItem, { orientation: "horizontal", children: _jsx(TimelineContent, { title: "Step 3", subtitle: "Development" }) }), _jsx(TimelineItem, { orientation: "horizontal", connector: false, children: _jsx(TimelineContent, { title: "Step 4", subtitle: "Launch" }) })] })),
};
// Timeline with different connector styles
export const ConnectorStyles = {
    render: () => (_jsxs(Timeline, { children: [_jsx(TimelineItem, { active: true, connectorStyle: "solid", children: _jsx(TimelineContent, { title: "Solid Connector", subtitle: "Default connector style", date: "Jan 15, 2025" }) }), _jsx(TimelineItem, { connectorStyle: "dashed", children: _jsx(TimelineContent, { title: "Dashed Connector", subtitle: "Dashed line style", date: "Feb 1, 2025" }) }), _jsx(TimelineItem, { connectorStyle: "dotted", children: _jsx(TimelineContent, { title: "Dotted Connector", subtitle: "Dotted line style", date: "Mar 10, 2025" }) }), _jsx(TimelineItem, { connector: false, children: _jsx(TimelineContent, { title: "No Connector", subtitle: "End of timeline", date: "Apr 20, 2025" }) })] })),
};
// Timeline with custom icons
export const CustomIcons = {
    render: () => (_jsxs(Timeline, { children: [_jsx(TimelineItem, { active: true, icon: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }), children: _jsx(TimelineContent, { title: "Project Initiated", subtitle: "Kickoff meeting and planning", date: "Jan 15, 2025" }) }), _jsx(TimelineItem, { icon: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }), _jsx("polyline", { points: "14 2 14 8 20 8" })] }), children: _jsx(TimelineContent, { title: "Documentation", subtitle: "Project requirements and specifications", date: "Feb 1, 2025" }) }), _jsx(TimelineItem, { icon: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "m8 3 4 8 5-5 5 15H2L8 3z" }) }), children: _jsx(TimelineContent, { title: "Design Phase", subtitle: "UI/UX design and prototyping", date: "Mar 10, 2025" }) }), _jsx(TimelineItem, { connector: false, icon: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }), _jsx("path", { d: "M9 9h6v6H9z" })] }), children: _jsx(TimelineContent, { title: "Development", subtitle: "Frontend and backend implementation", date: "Apr 20, 2025" }) })] })),
};
// Timeline with separators
export const WithSeparators = {
    render: () => (_jsxs(Timeline, { children: [_jsx(TimelineItem, { active: true, children: _jsx(TimelineContent, { title: "Q1 Planning", subtitle: "Strategic planning for Q1", date: "Jan 5, 2025" }) }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Q1 Implementation", subtitle: "Executing Q1 plans", date: "Feb 15, 2025" }) }), _jsx(TimelineSeparator, { label: "Q2 2025" }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Q2 Planning", subtitle: "Strategic planning for Q2", date: "Apr 5, 2025" }) }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Q2 Implementation", subtitle: "Executing Q2 plans", date: "May 15, 2025" }) }), _jsx(TimelineSeparator, { label: "Q3 2025" }), _jsx(TimelineItem, { connector: false, children: _jsx(TimelineContent, { title: "Q3 Planning", subtitle: "Strategic planning for Q3", date: "Jul 5, 2025" }) })] })),
};
// Compact timeline
export const Compact = {
    render: () => (_jsxs(Timeline, { compact: true, children: [_jsx(TimelineItem, { active: true, children: _jsx(TimelineContent, { title: "Task 1 Completed", date: "Jan 5, 2025" }) }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Task 2 Completed", date: "Jan 10, 2025" }) }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Task 3 Completed", date: "Jan 15, 2025" }) }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Task 4 Completed", date: "Jan 20, 2025" }) }), _jsx(TimelineItem, { connector: false, children: _jsx(TimelineContent, { title: "Task 5 Completed", date: "Jan 25, 2025" }) })] })),
};
// Reverse timeline
export const Reverse = {
    render: () => (_jsxs(Timeline, { reverse: true, children: [_jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Latest Event", subtitle: "Most recent activity", date: "Apr 20, 2025" }) }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Previous Event", subtitle: "Earlier activity", date: "Mar 10, 2025" }) }), _jsx(TimelineItem, { children: _jsx(TimelineContent, { title: "Earlier Event", subtitle: "Even earlier activity", date: "Feb 1, 2025" }) }), _jsx(TimelineItem, { active: true, connector: false, children: _jsx(TimelineContent, { title: "First Event", subtitle: "Where it all began", date: "Jan 15, 2025" }) })] })),
};
// Timeline with dots
export const WithDots = {
    render: () => (_jsxs(Timeline, { children: [_jsx(TimelineItem, { active: true, icon: _jsx(TimelineDot, { size: "md", active: true }), children: _jsx(TimelineContent, { title: "Active Step", subtitle: "Current progress", date: "Today" }) }), _jsx(TimelineItem, { icon: _jsx(TimelineDot, { size: "md" }), children: _jsx(TimelineContent, { title: "Upcoming Step", subtitle: "Next in line", date: "Tomorrow" }) }), _jsx(TimelineItem, { icon: _jsx(TimelineDot, { size: "md" }), children: _jsx(TimelineContent, { title: "Future Step", subtitle: "Coming soon", date: "Next week" }) }), _jsx(TimelineItem, { connector: false, icon: _jsx(TimelineDot, { size: "md" }), children: _jsx(TimelineContent, { title: "Final Step", subtitle: "Completion", date: "Next month" }) })] })),
};
// Timeline with custom colors
export const CustomColors = {
    render: () => (_jsxs(Timeline, { children: [_jsx(TimelineItem, { active: true, iconBackground: "#10b981", connectorColor: "#10b981", children: _jsx(TimelineContent, { title: "Completed", subtitle: "Task finished successfully", date: "Jan 15, 2025" }) }), _jsx(TimelineItem, { iconBackground: "#f59e0b", connectorColor: "#f59e0b", children: _jsx(TimelineContent, { title: "In Progress", subtitle: "Currently working on this", date: "Feb 1, 2025" }) }), _jsx(TimelineItem, { iconBackground: "#ef4444", connectorColor: "#ef4444", children: _jsx(TimelineContent, { title: "Blocked", subtitle: "Issues need to be resolved", date: "Mar 10, 2025" }) }), _jsx(TimelineItem, { connector: false, iconBackground: "#6366f1", children: _jsx(TimelineContent, { title: "Planned", subtitle: "Scheduled for future", date: "Apr 20, 2025" }) })] })),
};
