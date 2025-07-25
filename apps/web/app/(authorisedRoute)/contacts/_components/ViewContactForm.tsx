'use client';

import {
  ArrowLeft,
  Bot,
  Building,
  Calendar,
  Clock,
  Edit,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  Tag,
  Trash2,
  Users,
  Heart,
  AlertCircle,
  Activity,
  Brain,
  Zap,
  Target,
  Star,
  Send,
  Video,
  Coffee,
  Globe,
  ExternalLink,
  Lightbulb,
  BookOpen,
  Briefcase,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@codexcrm/ui';
import { ContactAvatar } from './ContactAvatar';
import { api } from '@/lib/trpc';

// New data types for AI-first relationship intelligence
interface ContactInteraction {
  id: string;
  type: 'email' | 'meeting' | 'social' | 'note' | 'call' | 'session';
  date: Date;
  title: string;
  summary?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  outcome?: string;
  duration?: number; // minutes
  platform?: string; // for social interactions
}

interface AIInsight {
  id: string;
  type: 'summary' | 'career' | 'interests' | 'goals' | 'next_steps' | 'wellness_notes';
  content: string;
  confidence: number;
  lastUpdated: Date;
  source?: string;
}

interface SocialPlatform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  baseUrl: string;
  color: string;
}

interface ViewContactFormProps {
  contactId: string;
}

// Social media platform configuration
const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  linkedin: {
    name: 'LinkedIn',
    icon: ({ className }) => (
      <svg viewBox='0 0 24 24' className={className} fill='currentColor'>
        <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
      </svg>
    ),
    baseUrl: 'https://linkedin.com/in/',
    color: '#0077B5',
  },
  twitter: {
    name: 'Twitter/X',
    icon: ({ className }) => (
      <svg viewBox='0 0 24 24' className={className} fill='currentColor'>
        <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
      </svg>
    ),
    baseUrl: 'https://twitter.com/',
    color: '#000000',
  },
  instagram: {
    name: 'Instagram',
    icon: ({ className }) => (
      <svg viewBox='0 0 24 24' className={className} fill='currentColor'>
        <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
      </svg>
    ),
    baseUrl: 'https://instagram.com/',
    color: '#E4405F',
  },
  facebook: {
    name: 'Facebook',
    icon: ({ className }) => (
      <svg viewBox='0 0 24 24' className={className} fill='currentColor'>
        <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
      </svg>
    ),
    baseUrl: 'https://facebook.com/',
    color: '#1877F2',
  },
  youtube: {
    name: 'YouTube',
    icon: ({ className }) => (
      <svg viewBox='0 0 24 24' className={className} fill='currentColor'>
        <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
      </svg>
    ),
    baseUrl: 'https://youtube.com/@',
    color: '#FF0000',
  },
  tiktok: {
    name: 'TikTok',
    icon: ({ className }) => (
      <svg viewBox='0 0 24 24' className={className} fill='currentColor'>
        <path d='M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' />
      </svg>
    ),
    baseUrl: 'https://tiktok.com/@',
    color: '#000000',
  },
};

// Mock data for AI insights and interactions (will be replaced with real data)
const getMockAIInsights = (): AIInsight[] => [
  {
    id: '1',
    type: 'summary',
    content:
      "This contact is a wellness-focused professional showing strong engagement with mindfulness and holistic health approaches. Recent interactions suggest they're in a growth phase of their wellness journey and highly receptive to guidance.",
    confidence: 0.85,
    lastUpdated: new Date('2024-01-15'),
    source: 'Communication analysis',
  },
  {
    id: '2',
    type: 'interests',
    content:
      'Meditation, sustainable living, plant-based nutrition, work-life balance, stress management techniques',
    confidence: 0.78,
    lastUpdated: new Date('2024-01-12'),
    source: 'Social media activity',
  },
  {
    id: '3',
    type: 'goals',
    content:
      'Establishing a consistent morning routine, reducing work-related stress, building a supportive wellness community',
    confidence: 0.72,
    lastUpdated: new Date('2024-01-10'),
    source: 'Session notes analysis',
  },
  {
    id: '4',
    type: 'next_steps',
    content:
      'Schedule follow-up session to discuss progress on meditation practice. Recommend joining the Thursday evening mindfulness group.',
    confidence: 0.88,
    lastUpdated: new Date('2024-01-16'),
    source: 'AI recommendation engine',
  },
];

const getMockInteractions = (): ContactInteraction[] => [
  {
    id: '1',
    type: 'session',
    date: new Date('2024-01-15T10:00:00'),
    title: 'Initial Wellness Consultation',
    summary:
      'Discussed current wellness goals and challenges. Strong interest in mindfulness practices.',
    sentiment: 'positive',
    outcome: 'Scheduled follow-up in 2 weeks',
    duration: 60,
  },
  {
    id: '2',
    type: 'email',
    date: new Date('2024-01-12T14:30:00'),
    title: 'Mindfulness Resources Shared',
    summary: 'Sent curated meditation guides and local class recommendations',
    sentiment: 'positive',
  },
  {
    id: '3',
    type: 'call',
    date: new Date('2024-01-08T16:15:00'),
    title: 'Quick Check-in Call',
    summary: 'Brief discussion about upcoming wellness program enrollment',
    sentiment: 'neutral',
    duration: 15,
  },
  {
    id: '4',
    type: 'social',
    date: new Date('2024-01-05T09:22:00'),
    title: 'LinkedIn Connection',
    summary: 'Connected after wellness conference networking event',
    sentiment: 'positive',
    platform: 'LinkedIn',
  },
];

// Helper function to detect social platform from handle
const detectSocialPlatform = (handle: string): { platform: string; cleanHandle: string } | null => {
  const lowerHandle = handle.toLowerCase();

  // LinkedIn patterns
  if (lowerHandle.includes('linkedin.com/in/') || lowerHandle.includes('linkedin.com/company/')) {
    return { platform: 'linkedin', cleanHandle: handle.split('/').pop() || handle };
  }

  // Twitter/X patterns
  if (
    lowerHandle.includes('twitter.com/') ||
    lowerHandle.includes('x.com/') ||
    (lowerHandle.startsWith('@') && !lowerHandle.includes('.'))
  ) {
    return { platform: 'twitter', cleanHandle: handle.replace('@', '').split('/').pop() || handle };
  }

  // Instagram patterns
  if (lowerHandle.includes('instagram.com/')) {
    return { platform: 'instagram', cleanHandle: handle.split('/').pop() || handle };
  }

  // Facebook patterns
  if (lowerHandle.includes('facebook.com/')) {
    return { platform: 'facebook', cleanHandle: handle.split('/').pop() || handle };
  }

  // YouTube patterns
  if (lowerHandle.includes('youtube.com/') || lowerHandle.includes('youtu.be/')) {
    return { platform: 'youtube', cleanHandle: handle.split('/').pop() || handle };
  }

  // TikTok patterns
  if (lowerHandle.includes('tiktok.com/')) {
    return { platform: 'tiktok', cleanHandle: handle.split('/').pop() || handle };
  }

  return null;
};

export function ViewContactForm({ contactId }: ViewContactFormProps) {
  const router = useRouter();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch contact data
  const {
    data: contact,
    isLoading,
    error,
  } = api.contacts.getById.useQuery(
    { contactId },
    {
      retry: 1,
    }
  );

  // Delete mutation
  const deleteMutation = api.contacts.delete.useMutation({
    onSuccess: () => {
      router.push('/contacts');
    },
    onError: (error) => {
      setDeleteError(`Failed to delete contact: ${error.message}`);
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary/50'></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !contact) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <Alert variant='destructive' className='max-w-4xl mx-auto'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error ? error.message : 'Contact not found'}</AlertDescription>
        </Alert>
        <div className='flex justify-center mt-8'>
          <Button variant='outline' onClick={() => router.push('/contacts')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Contacts
          </Button>
        </div>
      </div>
    );
  }

  const handleDeleteContact = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${contact.fullName}? This action cannot be undone.`
      )
    ) {
      try {
        await deleteMutation.mutateAsync({ contactId });
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  // Get relationship stage information
  const getRelationshipStage = () => {
    if (!contact.groups || contact.groups.length === 0)
      return { stage: 'unassigned', color: 'bg-gray-500' };

    const primaryGroup = contact.groups[0];
    const groupInfo = {
      newly_interested: { stage: 'Newly Interested', color: 'bg-blue-500' },
      new_clients: { stage: 'New Client', color: 'bg-green-500' },
      core_clients: { stage: 'Core Client', color: 'bg-purple-500' },
      inner_circle: { stage: 'Inner Circle', color: 'bg-amber-500' },
      ambassadors: { stage: 'Ambassador', color: 'bg-pink-500' },
      collaboration_partners: { stage: 'Partner', color: 'bg-indigo-500' },
      reconnection: { stage: 'Reconnection', color: 'bg-orange-500' },
    };

    return (
      groupInfo[primaryGroup as keyof typeof groupInfo] || {
        stage: 'Unknown',
        color: 'bg-gray-500',
      }
    );
  };

  // Process social handles to show platform icons
  const processSocialHandles = () => {
    if (!contact.socialHandles || contact.socialHandles.length === 0) return [];

    return contact.socialHandles.map((handle, index) => {
      const platformInfo = detectSocialPlatform(handle);
      if (platformInfo && SOCIAL_PLATFORMS[platformInfo.platform]) {
        const platform = SOCIAL_PLATFORMS[platformInfo.platform];
        return {
          id: index.toString(),
          platform: platformInfo.platform,
          handle: platformInfo.cleanHandle,
          name: platform.name,
          icon: platform.icon,
          color: platform.color,
          url: `${platform.baseUrl}${platformInfo.cleanHandle}`,
          originalHandle: handle,
        };
      }
      return {
        id: index.toString(),
        platform: 'unknown',
        handle: handle,
        name: 'Social',
        icon: Globe,
        color: '#6B7280',
        url: handle.startsWith('http') ? handle : `https://${handle}`,
        originalHandle: handle,
      };
    });
  };

  // Mock data (will be replaced with real data from API)
  const aiInsights = getMockAIInsights();
  const interactions = getMockInteractions();
  const socialProfiles = processSocialHandles();
  const relationshipStage = getRelationshipStage();

  // Helper components
  const QuickActionButton = ({
    icon,
    label,
    variant = 'outline',
    onClick,
    disabled = false,
    tooltip,
  }: {
    icon: React.ReactNode;
    label: string;
    variant?: 'default' | 'outline' | 'secondary';
    onClick: () => void;
    disabled?: boolean;
    tooltip?: string;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size='sm'
            onClick={onClick}
            disabled={disabled}
            className='flex items-center gap-2'
          >
            {icon}
            <span className='hidden sm:inline'>{label}</span>
          </Button>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  const SentimentIndicator = ({
    sentiment,
  }: {
    sentiment?: 'positive' | 'neutral' | 'negative';
  }) => {
    const config = {
      positive: { color: 'text-green-600', bg: 'bg-green-100', icon: '●' },
      neutral: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '●' },
      negative: { color: 'text-red-600', bg: 'bg-red-100', icon: '●' },
    };

    if (!sentiment) return null;
    const { color, bg, icon } = config[sentiment];

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bg}`}>
        <span className={`${color} mr-1`}>{icon}</span>
        {sentiment}
      </span>
    );
  };

  const InteractionIcon = ({
    type,
    className = 'h-4 w-4',
  }: {
    type: string;
    className?: string;
  }) => {
    const icons = {
      session: Heart,
      email: Mail,
      call: Phone,
      meeting: Video,
      social: Globe,
      note: MessageSquare,
    };
    const Icon = icons[type as keyof typeof icons] || MessageSquare;
    return <Icon className={className} />;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/10 dark:to-indigo-950/10'>
      <div className='container mx-auto py-6 px-4 max-w-6xl'>
        {/* Delete Error Alert */}
        {deleteError && (
          <Alert variant='destructive' className='mb-6'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        )}

        {/* Navigation & Quick Actions Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
          <Button variant='outline' onClick={() => router.push('/contacts')} className='self-start'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Contacts
          </Button>

          <div className='flex items-center gap-3'>
            <QuickActionButton
              icon={<Bot className='h-4 w-4' />}
              label='AI Chat'
              variant='default'
              onClick={() => console.log('AI Chat about:', contact.fullName)}
              tooltip='Start AI-powered conversation about this contact'
            />
            <QuickActionButton
              icon={<Edit className='h-4 w-4' />}
              label='Edit'
              onClick={() => router.push(`/contacts/${contactId}/edit`)}
              tooltip='Edit contact information'
            />
            <QuickActionButton
              icon={<Trash2 className='h-4 w-4' />}
              label='Delete'
              variant='outline'
              onClick={handleDeleteContact}
              disabled={deleteMutation.isPending}
              tooltip='Delete this contact permanently'
            />
          </div>
        </div>

        {/* Header Card - Avatar Prominent Design */}
        <Card className='mb-6 border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm'>
          <CardContent className='p-6'>
            <div className='flex flex-col md:flex-row items-start gap-6'>
              {/* Avatar Section */}
              <div className='flex flex-col items-center gap-3'>
                <ContactAvatar
                  profileImageUrl={contact.profileImageUrl}
                  fullName={contact.fullName}
                  size='xl'
                  className='w-24 h-24 border-4 border-white shadow-xl dark:border-slate-800'
                />
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${relationshipStage.color}`}
                >
                  {relationshipStage.stage}
                </div>
              </div>

              {/* Main Header Info */}
              <div className='flex-1 min-w-0'>
                <div className='flex flex-col sm:flex-row sm:items-start gap-4 mb-4'>
                  <div className='flex-1'>
                    <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2'>
                      {contact.fullName}
                    </h1>
                    {(contact.jobTitle || contact.companyName) && (
                      <div className='flex flex-col sm:flex-row sm:items-center gap-2 text-slate-600 dark:text-slate-400 mb-3'>
                        {contact.jobTitle && (
                          <span className='font-medium'>{contact.jobTitle}</span>
                        )}
                        {contact.jobTitle && contact.companyName && (
                          <span className='hidden sm:inline'>•</span>
                        )}
                        {contact.companyName && (
                          <span className='flex items-center gap-1'>
                            <Building className='h-4 w-4' />
                            {contact.companyName}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Social Media Icons */}
                    {socialProfiles.length > 0 && (
                      <div className='flex items-center gap-3 mb-4'>
                        {socialProfiles.slice(0, 5).map((profile) => {
                          const IconComponent = profile.icon;
                          return (
                            <TooltipProvider key={profile.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    onClick={() => window.open(profile.url, '_blank')}
                                  >
                                    <IconComponent
                                      className='h-4 w-4'
                                      style={{ color: profile.color }}
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {profile.name}: {profile.handle}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                        {socialProfiles.length > 5 && (
                          <Badge variant='secondary' className='text-xs'>
                            +{socialProfiles.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Quick Contact Actions */}
                    <div className='flex flex-wrap gap-3'>
                      {contact.email && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => window.open(`mailto:${contact.email}`)}
                          className='flex items-center gap-2'
                        >
                          <Mail className='h-4 w-4' />
                          Email
                        </Button>
                      )}
                      {contact.phone && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => window.open(`tel:${contact.phone}`)}
                          className='flex items-center gap-2'
                        >
                          <Phone className='h-4 w-4' />
                          Call
                        </Button>
                      )}
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => console.log('Schedule meeting')}
                        className='flex items-center gap-2'
                      >
                        <Calendar className='h-4 w-4' />
                        Schedule
                      </Button>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className='flex flex-col items-end gap-2'>
                    {contact.lastContactedAt && (
                      <Badge variant='secondary' className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        {new Date(contact.lastContactedAt).toLocaleDateString()}
                      </Badge>
                    )}
                    {contact.source && (
                      <Badge variant='outline' className='flex items-center gap-1'>
                        <Tag className='h-3 w-3' />
                        {contact.source}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
          {/* Left Column - AI Insights & Relationship Intelligence */}
          <div className='xl:col-span-2 space-y-6'>
            {/* AI Summary Card */}
            <Card className='border-0 shadow-lg bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-blue-900 dark:text-blue-100'>
                  <Brain className='h-5 w-5' />
                  Relationship Intelligence
                </CardTitle>
                <CardDescription>AI-powered insights about your relationship</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {aiInsights
                  .filter((i) => i.type === 'summary')
                  .map((insight) => (
                    <div
                      key={insight.id}
                      className='p-4 bg-white/60 dark:bg-slate-900/40 rounded-lg border border-blue-200/50 dark:border-blue-800/50'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <h4 className='font-semibold text-slate-900 dark:text-slate-100'>
                          Latest Interaction Summary
                        </h4>
                        <Badge variant='secondary' className='text-xs'>
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className='text-slate-700 dark:text-slate-300 text-sm leading-relaxed'>
                        {insight.content}
                      </p>
                      <div className='flex items-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400'>
                        <Sparkles className='h-3 w-3' />
                        Updated {insight.lastUpdated.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* About Section - AI Generated */}
            <Card className='border-0 shadow-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Lightbulb className='h-5 w-5 text-amber-600' />
                  About
                </CardTitle>
                <CardDescription>AI-generated summary of what we know</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {['interests', 'goals'].map((type) => {
                  const insight = aiInsights.find((i) => i.type === type);
                  if (!insight) return null;

                  return (
                    <div key={type} className='p-4 bg-slate-50/80 dark:bg-slate-900/40 rounded-lg'>
                      <div className='flex items-center gap-2 mb-2'>
                        {type === 'interests' && <Star className='h-4 w-4 text-purple-600' />}
                        {type === 'goals' && <Target className='h-4 w-4 text-green-600' />}
                        <h4 className='font-medium capitalize'>{type}</h4>
                        <Badge variant='outline' className='text-xs ml-auto'>
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className='text-sm text-slate-600 dark:text-slate-400'>
                        {insight.content}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Interaction Timeline */}
            <Card className='border-0 shadow-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Activity className='h-5 w-5 text-green-600' />
                  Recent Interactions
                </CardTitle>
                <CardDescription>
                  Timeline of meetings, sessions, and communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-96 overflow-y-auto'>
                  <div className='space-y-4'>
                    {interactions.map((interaction) => (
                      <div
                        key={interaction.id}
                        className='flex gap-4 pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0'
                      >
                        <div className='flex-shrink-0'>
                          <div className='w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center'>
                            <InteractionIcon
                              type={interaction.type}
                              className='h-4 w-4 text-slate-600 dark:text-slate-400'
                            />
                          </div>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between'>
                            <div>
                              <h4 className='font-medium text-slate-900 dark:text-slate-100'>
                                {interaction.title}
                              </h4>
                              <p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
                                {interaction.summary}
                              </p>
                              {interaction.outcome && (
                                <p className='text-sm text-green-700 dark:text-green-400 mt-2 font-medium'>
                                  → {interaction.outcome}
                                </p>
                              )}
                            </div>
                            <div className='flex flex-col items-end gap-2'>
                              <time className='text-xs text-slate-500 dark:text-slate-400'>
                                {interaction.date.toLocaleDateString()}
                              </time>
                              <SentimentIndicator sentiment={interaction.sentiment} />
                              {interaction.duration && (
                                <Badge variant='outline' className='text-xs'>
                                  {interaction.duration}m
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Details */}
          <div className='space-y-6'>
            {/* Wellness Practitioner Quick Actions */}
            <Card className='border-0 shadow-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Zap className='h-5 w-5 text-yellow-600' />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button variant='outline' className='w-full justify-start gap-3' size='sm'>
                  <Heart className='h-4 w-4 text-pink-600' />
                  Log Session Notes
                </Button>
                <Button variant='outline' className='w-full justify-start gap-3' size='sm'>
                  <Send className='h-4 w-4 text-blue-600' />
                  Send Check-in
                </Button>
                <Button variant='outline' className='w-full justify-start gap-3' size='sm'>
                  <BookOpen className='h-4 w-4 text-green-600' />
                  Assign Resources
                </Button>
                <Button variant='outline' className='w-full justify-start gap-3' size='sm'>
                  <Users className='h-4 w-4 text-purple-600' />
                  Refer to Group
                </Button>
                <Button variant='outline' className='w-full justify-start gap-3' size='sm'>
                  <Coffee className='h-4 w-4 text-amber-600' />
                  Schedule Coffee Chat
                </Button>
              </CardContent>
            </Card>

            {/* AI Next Steps */}
            {aiInsights
              .filter((i) => i.type === 'next_steps')
              .map((insight) => (
                <Card
                  key={insight.id}
                  className='border-0 shadow-lg bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20'
                >
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-green-900 dark:text-green-100'>
                      <Target className='h-5 w-5' />
                      Recommended Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='p-4 bg-white/60 dark:bg-slate-900/40 rounded-lg'>
                      <p className='text-sm text-slate-700 dark:text-slate-300 leading-relaxed'>
                        {insight.content}
                      </p>
                      <div className='flex items-center justify-between mt-3'>
                        <div className='flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400'>
                          <Bot className='h-3 w-3' />
                          AI Recommended
                        </div>
                        <Badge variant='secondary' className='text-xs'>
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Contact Details */}
            <Card className='border-0 shadow-lg'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Briefcase className='h-5 w-5 text-slate-600' />
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-3'>
                  {contact.email && (
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-slate-600 dark:text-slate-400'>Email</span>
                      <span className='text-sm font-medium'>{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-slate-600 dark:text-slate-400'>Phone</span>
                      <span className='text-sm font-medium'>{contact.phone}</span>
                    </div>
                  )}
                  {contact.website && (
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-slate-600 dark:text-slate-400'>Website</span>
                      <Button
                        variant='link'
                        size='sm'
                        className='p-0 h-auto text-sm'
                        onClick={() =>
                          window.open(
                            contact.website!.startsWith('http')
                              ? contact.website!
                              : `https://${contact.website}`,
                            '_blank'
                          )
                        }
                      >
                        <ExternalLink className='h-3 w-3 mr-1' />
                        Visit
                      </Button>
                    </div>
                  )}
                  {contact.tags && contact.tags.length > 0 && (
                    <div>
                      <span className='text-sm text-slate-600 dark:text-slate-400 block mb-2'>
                        Tags
                      </span>
                      <div className='flex flex-wrap gap-1'>
                        {contact.tags.map((tag, index) => (
                          <Badge key={index} variant='outline' className='text-xs'>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {contact.notes && (
                  <div className='pt-4 border-t border-slate-200 dark:border-slate-700'>
                    <h4 className='text-sm font-medium text-slate-900 dark:text-slate-100 mb-2'>
                      Notes
                    </h4>
                    <div className='text-sm text-slate-600 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-900/40 p-3 rounded-lg'>
                      {contact.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
