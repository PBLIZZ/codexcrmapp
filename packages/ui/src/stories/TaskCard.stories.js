import { jsx as _jsx } from "react/jsx-runtime";
import { TaskCard, TaskList } from '../components/ui/task-card';
import { ThemeProvider } from '../components/core/ThemeProvider';
const meta = {
    title: 'UI/TaskCard',
    component: TaskCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (_jsx(ThemeProvider, { defaultTheme: "light", children: _jsx("div", { style: { width: '350px' }, children: _jsx(Story, {}) }) })),
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
// Basic task card
export const Basic = {
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
export const WithProgress = {
    args: {
        ...Basic.args,
        status: 'in-progress',
        progress: 45,
    },
};
// With due date
export const WithDueDate = {
    args: {
        ...Basic.args,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
};
// With past due date
export const WithPastDueDate = {
    args: {
        ...Basic.args,
        status: 'in-progress',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
};
// With assignee
export const WithAssignee = {
    args: {
        ...Basic.args,
        assignee: {
            name: 'John Doe',
        },
    },
};
// With assignee avatar
export const WithAssigneeAvatar = {
    args: {
        ...Basic.args,
        assignee: {
            name: 'John Doe',
            avatar: 'https://i.pravatar.cc/300?img=12',
        },
    },
};
// With tags
export const WithTags = {
    args: {
        ...Basic.args,
        tags: ['Frontend', 'Authentication', 'Security'],
    },
};
// Complete task card
export const CompleteTaskCard = {
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
export const LowPriority = {
    args: {
        ...Basic.args,
        priority: 'low',
    },
};
export const MediumPriority = {
    args: {
        ...Basic.args,
        priority: 'medium',
    },
};
export const HighPriority = {
    args: {
        ...Basic.args,
        priority: 'high',
    },
};
export const UrgentPriority = {
    args: {
        ...Basic.args,
        priority: 'urgent',
    },
};
// Status variants
export const TodoStatus = {
    args: {
        ...Basic.args,
        status: 'todo',
    },
};
export const InProgressStatus = {
    args: {
        ...Basic.args,
        status: 'in-progress',
    },
};
export const ReviewStatus = {
    args: {
        ...Basic.args,
        status: 'review',
    },
};
export const DoneStatus = {
    args: {
        ...Basic.args,
        status: 'done',
    },
};
export const BlockedStatus = {
    args: {
        ...Basic.args,
        status: 'blocked',
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
// With custom footer
export const WithFooter = {
    args: {
        ...Basic.args,
        footer: (_jsx("div", { className: "text-xs text-muted-foreground pt-2", children: "Created by: Alex Johnson \u2022 Last updated: 2 days ago" })),
    },
};
// Task List component
const meta2 = {
    title: 'UI/TaskList',
    component: TaskList,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (_jsx(ThemeProvider, { defaultTheme: "light", children: _jsx("div", { style: { maxWidth: '1200px', margin: '0 auto' }, children: _jsx(Story, {}) }) })),
    ],
};
export const TaskListGrid = {
    render: () => (_jsx(TaskList, { layout: "grid", columns: 2, gap: "md", tasks: [
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
        ] })),
};
export const TaskListList = {
    render: () => (_jsx(TaskList, { layout: "list", gap: "md", tasks: [
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
        ] })),
};
