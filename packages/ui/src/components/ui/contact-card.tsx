'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../core/ThemeProvider';

// Status indicator component
export interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'busy' | 'custom';
  customColor?: string;
  className?: string;
}

export const StatusIndicator = ({
  status,
  customColor,
  className,
}: StatusIndicatorProps) => {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    custom: '',
  };

  return (
    <div
      className={cn(
        'h-3 w-3 rounded-full',
        status !== 'custom' && statusColors[status],
        className
      )}
      style={status === 'custom' && customColor ? { backgroundColor: customColor } : {}}
    />
  );
};

// Avatar component with optional status indicator
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

export const ContactAvatar = forwardRef<HTMLDivElement, ContactAvatarProps>(
  (
    {
      className,
      src,
      alt = 'Avatar',
      initials,
      size = 'md',
      status,
      statusColor,
      bordered = false,
      borderColor,
      ...props
    },
    ref
  ) => {
    const { isDarkMode } = useTheme();

    // Size classes
    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-12 w-12 text-sm',
      lg: 'h-16 w-16 text-base',
      xl: 'h-24 w-24 text-lg',
    };

    // Border classes
    const borderClass = bordered
      ? borderColor
        ? `border-2 border-solid`
        : `border-2 border-solid ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`
      : '';

    return (
      <div
        ref={ref}
        className={cn('relative rounded-full overflow-hidden', sizeClasses[size], borderClass, className)}
        style={borderColor ? { borderColor } : {}}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium">
            {initials || alt.charAt(0).toUpperCase()}
          </div>
        )}

        {status && (
          <div className="absolute bottom-0 right-0 translate-y-[20%] translate-x-[20%]">
            <StatusIndicator status={status} customColor={statusColor} />
          </div>
        )}
      </div>
    );
  }
);

ContactAvatar.displayName = 'ContactAvatar';

// Contact info item component
export interface ContactInfoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  label?: string;
  value: string;
  href?: string;
  copyable?: boolean;
}

export const ContactInfoItem = forwardRef<HTMLDivElement, ContactInfoItemProps>(
  ({ className, icon, label, value, href, copyable = false, ...props }, ref) => {
    const handleCopy = () => {
      if (copyable) {
        navigator.clipboard.writeText(value);
        // You could add a toast notification here
      }
    };

    const content = (
      <div
        ref={ref}
        className={cn('flex items-start space-x-2', className)}
        {...props}
      >
        {icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}
        <div className="flex-1 min-w-0">
          {label && <div className="text-xs text-muted-foreground">{label}</div>}
          <div className="text-sm truncate">{value}</div>
        </div>
        {copyable && (
          <button
            onClick={handleCopy}
            className="p-1 text-muted-foreground hover:text-foreground"
            aria-label="Copy to clipboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          </button>
        )}
      </div>
    );

    if (href) {
      return (
        <a
          href={href}
          className="hover:underline"
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {content}
        </a>
      );
    }

    return content;
  }
);

ContactInfoItem.displayName = 'ContactInfoItem';

// Action button component
export interface ContactActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const ContactActionButton = forwardRef<HTMLButtonElement, ContactActionButtonProps>(
  ({ className, icon, label, variant = 'outline', ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      outline: 'border border-border bg-transparent hover:bg-muted/50',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center p-2 rounded-md transition-colors',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="mb-1">{icon}</div>
        <span className="text-xs">{label}</span>
      </button>
    );
  }
);

ContactActionButton.displayName = 'ContactActionButton';

// Main contact card component
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

export const ContactCard = forwardRef<HTMLDivElement, ContactCardProps>(
  (
    {
      className,
      avatar,
      name,
      title,
      company,
      contactInfo,
      actions,
      tags,
      layout = 'vertical',
      size = 'md',
      variant = 'default',
      withHover = false,
      withShadow = false,
      footer,
      ...props
    },
    ref
  ) => {
    const { isDarkMode } = useTheme();

    // Size classes
    const sizeClasses = {
      sm: 'p-3 space-y-2',
      md: 'p-4 space-y-3',
      lg: 'p-6 space-y-4',
    };

    // Avatar size based on card size
    const avatarSize = {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    } as const;

    // Variant classes based on theme
    const variantClasses = {
      default: 'bg-card text-card-foreground',
      primary: 'bg-primary text-primary-foreground',
      accent: 'bg-accent text-accent-foreground',
      outline: 'border border-border bg-transparent',
    };

    // Shadow classes
    const shadowClass = withShadow ? (isDarkMode ? 'shadow-md shadow-black/20' : 'shadow-md shadow-black/10') : '';

    // Hover effect classes
    const hoverClass = withHover
      ? variant === 'default'
        ? 'hover:bg-muted/50 transition-colors'
        : variant === 'primary'
        ? 'hover:bg-primary/90 transition-colors'
        : variant === 'accent'
        ? 'hover:bg-accent/90 transition-colors'
        : 'hover:bg-muted/10 transition-colors'
      : '';

    // Email icon
    const emailIcon = (
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
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );

    // Phone icon
    const phoneIcon = (
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
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );

    // Mobile icon
    const mobileIcon = (
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
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    );

    // Address icon
    const addressIcon = (
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
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );

    // Website icon
    const websiteIcon = (
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
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    );

    // Company icon
    const companyIcon = (
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
        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
        <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
        <path d="M9 22V12" />
        <path d="M15 22V12" />
      </svg>
    );

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg',
          variantClasses[variant],
          shadowClass,
          hoverClass,
          layout === 'vertical' ? sizeClasses[size] : 'p-0',
          className
        )}
        {...props}
      >
        {layout === 'horizontal' ? (
          <div className="flex">
            <div className={cn('flex-shrink-0 p-4', sizeClasses[size])}>
              {avatar && (
                <ContactAvatar
                  src={avatar.src}
                  alt={avatar.alt || name}
                  initials={avatar.initials || name.charAt(0)}
                  status={avatar.status}
                  statusColor={avatar.statusColor}
                  size={avatarSize[size]}
                />
              )}
            </div>
            <div className="flex-1 p-4 min-w-0">
              <div className="space-y-1 mb-2">
                <h3 className="font-medium truncate">{name}</h3>
                {title && <p className="text-sm text-muted-foreground truncate">{title}</p>}
                {company && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    {companyIcon}
                    <span className="ml-1 truncate">{company}</span>
                  </div>
                )}
              </div>

              {contactInfo && (
                <div className="space-y-1 mb-3">
                  {contactInfo.email && (
                    <ContactInfoItem
                      icon={emailIcon}
                      value={contactInfo.email}
                      href={`mailto:${contactInfo.email}`}
                      copyable
                    />
                  )}
                  {contactInfo.phone && (
                    <ContactInfoItem
                      icon={phoneIcon}
                      value={contactInfo.phone}
                      href={`tel:${contactInfo.phone}`}
                    />
                  )}
                  {contactInfo.mobile && (
                    <ContactInfoItem
                      icon={mobileIcon}
                      value={contactInfo.mobile}
                      href={`tel:${contactInfo.mobile}`}
                    />
                  )}
                </div>
              )}

              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {actions && (
              <div className="flex items-center p-4 border-l border-border">
                {actions}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-3">
              {avatar && (
                <ContactAvatar
                  src={avatar.src}
                  alt={avatar.alt || name}
                  initials={avatar.initials || name.charAt(0)}
                  status={avatar.status}
                  statusColor={avatar.statusColor}
                  size={avatarSize[size]}
                />
              )}
              <div className="min-w-0">
                <h3 className="font-medium truncate">{name}</h3>
                {title && <p className="text-sm text-muted-foreground truncate">{title}</p>}
                {company && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="truncate">{company}</span>
                  </div>
                )}
              </div>
            </div>

            {contactInfo && (
              <div className="space-y-1">
                {contactInfo.email && (
                  <ContactInfoItem
                    icon={emailIcon}
                    value={contactInfo.email}
                    href={`mailto:${contactInfo.email}`}
                    copyable
                  />
                )}
                {contactInfo.phone && (
                  <ContactInfoItem
                    icon={phoneIcon}
                    value={contactInfo.phone}
                    href={`tel:${contactInfo.phone}`}
                  />
                )}
                {contactInfo.mobile && (
                  <ContactInfoItem
                    icon={mobileIcon}
                    value={contactInfo.mobile}
                    href={`tel:${contactInfo.mobile}`}
                  />
                )}
                {contactInfo.address && (
                  <ContactInfoItem
                    icon={addressIcon}
                    value={contactInfo.address}
                    copyable
                  />
                )}
                {contactInfo.website && (
                  <ContactInfoItem
                    icon={websiteIcon}
                    value={contactInfo.website}
                    href={contactInfo.website.startsWith('http') ? contactInfo.website : `https://${contactInfo.website}`}
                  />
                )}
                {Object.entries(contactInfo)
                  .filter(([key]) => !['email', 'phone', 'mobile', 'address', 'website'].includes(key))
                  .map(([key, value]) => (
                    <ContactInfoItem
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={value || ''}
                    />
                  ))}
              </div>
            )}

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}

            {footer && <div className="pt-2 border-t border-border/50">{footer}</div>}
          </>
        )}
      </div>
    );
  }
);

ContactCard.displayName = 'ContactCard';

// Default action buttons
export const ContactCallButton = (props: Omit<ContactActionButtonProps, 'icon' | 'label'>) => (
  <ContactActionButton
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
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    }
    label="Call"
    {...props}
  />
);

export const ContactEmailButton = (props: Omit<ContactActionButtonProps, 'icon' | 'label'>) => (
  <ContactActionButton
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
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    }
    label="Email"
    {...props}
  />
);

export const ContactMessageButton = (props: Omit<ContactActionButtonProps, 'icon' | 'label'>) => (
  <ContactActionButton
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
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    }
    label="Message"
    {...props}
  />
);