import { jsx as _jsx } from "react/jsx-runtime";
import { MetricCard, SimpleLineChart, ProgressIndicator, CircularProgress } from '../components/ui/metric-card';
import { ThemeProvider } from '../components/core/ThemeProvider';
// Example icon
const ExampleIcon = () => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }) }));
// Sample data for charts
const sampleData = [10, 25, 15, 30, 20, 35, 25, 40, 30, 45];
const meta = {
    title: 'UI/MetricCard',
    component: MetricCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (_jsx(ThemeProvider, { defaultTheme: "light", children: _jsx("div", { style: { width: '300px' }, children: _jsx(Story, {}) }) })),
    ],
    argTypes: {
        title: { control: 'text' },
        value: { control: 'text' },
        trend: {
            control: 'select',
            options: ['up', 'down', 'neutral']
        },
        trendValue: { control: 'text' },
        trendLabel: { control: 'text' },
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
        loading: { control: 'boolean' },
    },
};
export default meta;
// Basic metric card
export const Basic = {
    args: {
        title: 'Total Users',
        value: '1,234',
        trend: 'up',
        trendValue: '+12%',
        size: 'md',
        variant: 'default',
    },
};
// With icon
export const WithIcon = {
    args: {
        ...Basic.args,
        title: 'Revenue',
        value: '$12,345',
        icon: _jsx(ExampleIcon, {}),
    },
};
// With line chart
export const WithLineChart = {
    args: {
        ...Basic.args,
        title: 'Weekly Sales',
        value: '$8,540',
        chart: _jsx(SimpleLineChart, { data: sampleData, height: 40 }),
    },
};
// With progress indicator
export const WithProgressIndicator = {
    args: {
        ...Basic.args,
        title: 'Project Completion',
        value: '65%',
        trend: 'neutral',
        footer: _jsx(ProgressIndicator, { value: 65, showValue: true }),
    },
};
// With circular progress
export const WithCircularProgress = {
    args: {
        ...Basic.args,
        title: 'Disk Usage',
        value: '78%',
        trend: 'up',
        trendValue: '+5%',
        footer: (_jsx("div", { className: "flex justify-center mt-2", children: _jsx(CircularProgress, { value: 78, size: 60, showValue: true }) })),
    },
};
// Loading state
export const Loading = {
    args: {
        ...Basic.args,
        loading: true,
    },
};
// Size variants
export const Small = {
    args: {
        ...Basic.args,
        size: 'sm',
    },
};
export const Medium = {
    args: {
        ...Basic.args,
        size: 'md',
    },
};
export const Large = {
    args: {
        ...Basic.args,
        size: 'lg',
    },
};
// Color variants
export const Default = {
    args: {
        ...Basic.args,
        variant: 'default',
    },
};
export const Primary = {
    args: {
        ...Basic.args,
        variant: 'primary',
    },
};
export const Accent = {
    args: {
        ...Basic.args,
        variant: 'accent',
    },
};
export const Outline = {
    args: {
        ...Basic.args,
        variant: 'outline',
    },
};
// With hover and shadow
export const WithHoverAndShadow = {
    args: {
        ...Basic.args,
        withHover: true,
        withShadow: true,
    },
};
// Negative trend
export const NegativeTrend = {
    args: {
        ...Basic.args,
        title: 'Bounce Rate',
        value: '24%',
        trend: 'down',
        trendValue: '-3%',
        trendLabel: 'Compared to last month',
    },
};
// Neutral trend with label
export const WithTrendLabel = {
    args: {
        ...Basic.args,
        title: 'Avg. Session',
        value: '4m 32s',
        trend: 'neutral',
        trendLabel: 'No significant change',
    },
};
