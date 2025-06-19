export interface StatusIndicatorProps {
    status: 'online' | 'offline' | 'away' | 'busy' | 'custom';
    customColor?: string;
    className?: string;
}
export declare const StatusIndicator: ({ status, customColor, className, }: StatusIndicatorProps) => import("react/jsx-runtime").JSX.Element;
export interface ContactAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    initials?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'away' | 'busy' | 'custom';
    statusColor?: string;
    bordered?: boolean;
    borderColor?: string;
}
export declare const ContactAvatar: import("react").ForwardRefExoticComponent<ContactAvatarProps & import("react").RefAttributes<HTMLDivElement>>;
export interface ContactInfoItemProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: React.ReactNode;
    label?: string;
    value: string;
    href?: string;
    copyable?: boolean;
}
export declare const ContactInfoItem: import("react").ForwardRefExoticComponent<ContactInfoItemProps & import("react").RefAttributes<HTMLDivElement>>;
export interface ContactActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    label: string;
    variant?: 'primary' | 'secondary' | 'outline';
}
export declare const ContactActionButton: import("react").ForwardRefExoticComponent<ContactActionButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
export interface ContactCardProps extends React.HTMLAttributes<HTMLDivElement> {
    avatar?: {
        src?: string;
        alt?: string;
        initials?: string;
        status?: 'online' | 'offline' | 'away' | 'busy' | 'custom';
        statusColor?: string;
    };
    name: string;
    title?: string;
    company?: string;
    contactInfo?: {
        email?: string;
        phone?: string;
        mobile?: string;
        address?: string;
        website?: string;
        [key: string]: string | undefined;
    };
    actions?: React.ReactNode;
    tags?: string[];
    layout?: 'horizontal' | 'vertical';
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'primary' | 'accent' | 'outline';
    withHover?: boolean;
    withShadow?: boolean;
    footer?: React.ReactNode;
}
export declare const ContactCard: import("react").ForwardRefExoticComponent<ContactCardProps & import("react").RefAttributes<HTMLDivElement>>;
export declare const ContactCallButton: (props: Omit<ContactActionButtonProps, "icon" | "label">) => import("react/jsx-runtime").JSX.Element;
export declare const ContactEmailButton: (props: Omit<ContactActionButtonProps, "icon" | "label">) => import("react/jsx-runtime").JSX.Element;
export declare const ContactMessageButton: (props: Omit<ContactActionButtonProps, "icon" | "label">) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=contact-card.d.ts.map