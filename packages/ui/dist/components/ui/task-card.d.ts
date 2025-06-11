export interface PriorityBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    priority: 'low' | 'medium' | 'high' | 'urgent' | 'custom';
    customColor?: string;
    size?: 'sm' | 'md' | 'lg';
}
export declare const PriorityBadge: import("react").ForwardRefExoticComponent<PriorityBadgeProps & import("react").RefAttributes<HTMLDivElement>>;
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked' | 'custom';
    customColor?: string;
    size?: 'sm' | 'md' | 'lg';
}
export declare const StatusBadge: import("react").ForwardRefExoticComponent<StatusBadgeProps & import("react").RefAttributes<HTMLDivElement>>;
export interface TaskProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}
export declare const TaskProgress: import("react").ForwardRefExoticComponent<TaskProgressProps & import("react").RefAttributes<HTMLDivElement>>;
export interface DueDateProps extends React.HTMLAttributes<HTMLDivElement> {
    date: Date | string;
    showIcon?: boolean;
    isPastDue?: boolean;
}
export declare const DueDate: import("react").ForwardRefExoticComponent<DueDateProps & import("react").RefAttributes<HTMLDivElement>>;
export interface AssigneeProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    avatar?: string;
    size?: 'sm' | 'md' | 'lg';
}
export declare const Assignee: import("react").ForwardRefExoticComponent<AssigneeProps & import("react").RefAttributes<HTMLDivElement>>;
export interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    status?: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
    progress?: number;
    dueDate?: Date | string;
    assignee?: {
        name: string;
        avatar?: string;
    };
    tags?: string[];
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'primary' | 'accent' | 'outline';
    withHover?: boolean;
    withShadow?: boolean;
    footer?: React.ReactNode;
}
export declare const TaskCard: import("react").ForwardRefExoticComponent<TaskCardProps & import("react").RefAttributes<HTMLDivElement>>;
export interface TaskListProps extends React.HTMLAttributes<HTMLDivElement> {
    tasks: TaskCardProps[];
    layout?: 'grid' | 'list';
    columns?: 1 | 2 | 3 | 4;
    gap?: 'sm' | 'md' | 'lg';
}
export declare const TaskList: import("react").ForwardRefExoticComponent<TaskListProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=task-card.d.ts.map