'use client';

import { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  ContactCard,
  ContactAvatar,
  ContactInfoItem,
  ContactActionButton,
  ContactCallButton,
  ContactEmailButton,
  ContactMessageButton,
} from '../ui/contact-card';

export interface ContactCardDemoProps {
  className?: string;
}

export function ContactCardDemo({ className }: ContactCardDemoProps) {
  const [layout, setLayout] = useState<'vertical' | 'horizontal'>('vertical');

  // Sample contact data
  const contacts = [
    {
      name: 'Jane Smith',
      title: 'Marketing Director',
      company: 'Acme Corporation',
      avatar: {
        src: 'https://randomuser.me/api/portraits/women/32.jpg',
        status: 'online' as const,
      },
      contactInfo: {
        email: 'jane.smith@acme.com',
        phone: '(555) 123-4567',
        mobile: '(555) 987-6543',
        address: '123 Business Ave, Suite 400, San Francisco, CA 94107',
        website: 'www.acmecorp.com',
      },
      tags: ['Marketing', 'VIP', 'Enterprise'],
    },
    {
      name: 'John Doe',
      title: 'Software Engineer',
      company: 'Tech Innovations',
      avatar: {
        src: 'https://randomuser.me/api/portraits/men/44.jpg',
        status: 'busy' as const,
      },
      contactInfo: {
        email: 'john.doe@techinnovations.com',
        phone: '(555) 234-5678',
        mobile: '(555) 876-5432',
      },
      tags: ['Engineering', 'Developer'],
    },
    {
      name: 'Sarah Johnson',
      title: 'Financial Advisor',
      company: 'Wealth Management Inc.',
      avatar: {
        initials: 'SJ',
        status: 'away' as const,
      },
      contactInfo: {
        email: 'sarah.j@wealthmanagement.com',
        phone: '(555) 345-6789',
      },
      tags: ['Finance', 'Advisor'],
    },
    {
      name: 'Michael Chen',
      title: 'Product Manager',
      company: 'Innovative Solutions',
      avatar: {
        src: 'https://randomuser.me/api/portraits/men/67.jpg',
        status: 'offline' as const,
      },
      contactInfo: {
        email: 'michael.chen@innovative.com',
        phone: '(555) 456-7890',
      },
      tags: ['Product', 'Management'],
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contact Cards</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLayout('vertical')}
            className={cn(
              'px-3 py-1 rounded-md',
              layout === 'vertical'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            Vertical
          </button>
          <button
            onClick={() => setLayout('horizontal')}
            className={cn(
              'px-3 py-1 rounded-md',
              layout === 'horizontal'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            Horizontal
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Basic Contact Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((contact, index) => (
              <ContactCard
                key={index}
                name={contact.name}
                title={contact.title}
                company={contact.company}
                avatar={contact.avatar}
                contactInfo={contact.contactInfo}
                tags={contact.tags}
                layout={layout}
                actions={
                  <>
                    <ContactCallButton onClick={() => alert(`Calling ${contact.name}`)} />
                    <ContactEmailButton onClick={() => alert(`Emailing ${contact.name}`)} />
                    <ContactMessageButton onClick={() => alert(`Messaging ${contact.name}`)} />
                  </>
                }
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Contact Card Variants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ContactCard
              name="Default Variant"
              title="Software Engineer"
              avatar={{ initials: 'DV', status: 'online' }}
              contactInfo={{ email: 'default@example.com' }}
              variant="default"
              layout={layout}
            />

            <ContactCard
              name="Primary Variant"
              title="Product Manager"
              avatar={{ initials: 'PV', status: 'online' }}
              contactInfo={{ email: 'primary@example.com' }}
              variant="primary"
              layout={layout}
            />

            <ContactCard
              name="Accent Variant"
              title="Designer"
              avatar={{ initials: 'AV', status: 'online' }}
              contactInfo={{ email: 'accent@example.com' }}
              variant="accent"
              layout={layout}
            />

            <ContactCard
              name="Outline Variant"
              title="Marketing"
              avatar={{ initials: 'OV', status: 'online' }}
              contactInfo={{ email: 'outline@example.com' }}
              variant="outline"
              layout={layout}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Contact Card Sizes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ContactCard
              name="Small Size"
              title="Developer"
              avatar={{ initials: 'SS' }}
              contactInfo={{ email: 'small@example.com' }}
              size="sm"
              layout={layout}
            />

            <ContactCard
              name="Medium Size"
              title="Designer"
              avatar={{ initials: 'MS' }}
              contactInfo={{ email: 'medium@example.com' }}
              size="md"
              layout={layout}
            />

            <ContactCard
              name="Large Size"
              title="Manager"
              avatar={{ initials: 'LS' }}
              contactInfo={{ email: 'large@example.com' }}
              size="lg"
              layout={layout}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Interactive Contact Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContactCard
              name="Hover Effect"
              title="Software Engineer"
              avatar={{ initials: 'HE', status: 'online' }}
              contactInfo={{ email: 'hover@example.com' }}
              withHover
              layout={layout}
            />

            <ContactCard
              name="With Shadow"
              title="Product Manager"
              avatar={{ initials: 'WS', status: 'online' }}
              contactInfo={{ email: 'shadow@example.com' }}
              withShadow
              layout={layout}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Contact Card Components</h3>
          <div className="p-4 border border-border rounded-lg space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Contact Avatars</h4>
              <div className="flex flex-wrap gap-4">
                <ContactAvatar src="https://randomuser.me/api/portraits/women/32.jpg" alt="Jane Smith" size="sm" />
                <ContactAvatar src="https://randomuser.me/api/portraits/men/44.jpg" alt="John Doe" size="md" />
                <ContactAvatar initials="SJ" size="lg" />
                <ContactAvatar initials="MC" size="xl" />
                <ContactAvatar src="https://randomuser.me/api/portraits/women/32.jpg" alt="Jane Smith" status="online" size="md" />
                <ContactAvatar src="https://randomuser.me/api/portraits/men/44.jpg" alt="John Doe" status="busy" size="md" />
                <ContactAvatar initials="SJ" status="away" size="md" />
                <ContactAvatar initials="MC" status="offline" size="md" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Contact Info Items</h4>
              <div className="space-y-2 max-w-md">
                <ContactInfoItem
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
                  value="example@email.com"
                  href="mailto:example@email.com"
                  copyable
                />
                <ContactInfoItem
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
                  label="Phone"
                  value="(555) 123-4567"
                  href="tel:(555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Contact Action Buttons</h4>
              <div className="flex flex-wrap gap-2">
                <ContactCallButton />
                <ContactEmailButton />
                <ContactMessageButton />
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
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                  label="Map"
                  variant="primary"
                />
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
                  label="Chat"
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}