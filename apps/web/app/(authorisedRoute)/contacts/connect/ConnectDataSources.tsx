'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Calendar,
  MessageCircle,
  Linkedin,
  Phone,
  Globe,
  Brain,
  Mic,
  Bot,
  Users,
  Zap,
} from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@codexcrm/ui';

interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'communication' | 'social' | 'ai' | 'voice';
  status: 'available' | 'coming_soon' | 'beta';
  connects: string[];
}

const dataSources: DataSource[] = [
  {
    id: 'email',
    name: 'Email Integration',
    description: 'Auto-create contacts from email interactions and signatures',
    icon: <Mail className='h-6 w-6' />,
    category: 'communication',
    status: 'coming_soon',
    connects: ['Gmail', 'Outlook', 'Apple Mail'],
  },
  {
    id: 'calendar',
    name: 'Calendar Sync',
    description: 'Extract contacts from meeting attendees and appointments',
    icon: <Calendar className='h-6 w-6' />,
    category: 'communication',
    status: 'coming_soon',
    connects: ['Google Calendar', 'Outlook Calendar', 'Apple Calendar'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Connections',
    description: 'Import professional connections with enriched profiles',
    icon: <Linkedin className='h-6 w-6' />,
    category: 'social',
    status: 'coming_soon',
    connects: ['LinkedIn API'],
  },
  {
    id: 'phone',
    name: 'Phone Contacts',
    description: 'Sync with your device contacts and call logs',
    icon: <Phone className='h-6 w-6' />,
    category: 'communication',
    status: 'coming_soon',
    connects: ['iOS Contacts', 'Android Contacts'],
  },
  {
    id: 'ai_chat',
    name: 'AI Chat Creation',
    description: 'Describe contacts in natural language and let AI create them',
    icon: <Bot className='h-6 w-6' />,
    category: 'ai',
    status: 'beta',
    connects: ['Natural Language Processing'],
  },
  {
    id: 'voice_input',
    name: 'Voice Contact Creation',
    description: 'Speak contact details and let AI transcribe and create contacts',
    icon: <Mic className='h-6 w-6' />,
    category: 'voice',
    status: 'coming_soon',
    connects: ['Speech Recognition', 'AI Transcription'],
  },
  {
    id: 'web_enrichment',
    name: 'Web Profile Enrichment',
    description: 'Auto-enrich contacts with public profile information',
    icon: <Globe className='h-6 w-6' />,
    category: 'ai',
    status: 'beta',
    connects: ['Public APIs', 'Social Media'],
  },
  {
    id: 'meeting_intelligence',
    name: 'Meeting Intelligence',
    description: 'Extract contacts and insights from meeting transcripts',
    icon: <Brain className='h-6 w-6' />,
    category: 'ai',
    status: 'coming_soon',
    connects: ['Zoom', 'Teams', 'Google Meet'],
  },
];

export function ConnectDataSources() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Sources', icon: <Zap className='h-4 w-4' /> },
    { id: 'communication', name: 'Communication', icon: <Mail className='h-4 w-4' /> },
    { id: 'social', name: 'Social', icon: <Users className='h-4 w-4' /> },
    { id: 'ai', name: 'AI-Powered', icon: <Brain className='h-4 w-4' /> },
    { id: 'voice', name: 'Voice', icon: <Mic className='h-4 w-4' /> },
  ];

  const filteredSources =
    selectedCategory === 'all'
      ? dataSources
      : dataSources.filter((source) => source.category === selectedCategory);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <Badge variant='default' className='bg-green-100 text-green-800'>
            Available
          </Badge>
        );
      case 'beta':
        return (
          <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
            Beta
          </Badge>
        );
      case 'coming_soon':
        return (
          <Badge variant='outline' className='bg-gray-100 text-gray-800'>
            Coming Soon
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className='container mx-auto py-8 px-4'>
      {/* Header */}
      <div className='flex items-center gap-4 mb-8'>
        <Button variant='outline' onClick={() => router.push('/contacts')}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Contacts
        </Button>
        <div>
          <h1 className='text-3xl font-bold'>Connect Data Sources</h1>
          <p className='text-muted-foreground mt-2'>
            Connect your existing data sources to automatically populate contacts with AI-powered
            intelligence
          </p>
        </div>
      </div>

      {/* AI-First Approach Info */}
      <Card className='mb-8 border-blue-200 bg-blue-50/50'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Brain className='h-5 w-5 text-blue-600' />
            AI-First Contact Management
          </CardTitle>
          <CardDescription>
            Unlike traditional CSV imports, our AI-first approach connects to your existing
            workflows and automatically enriches contact data with relationship intelligence.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Category Filter */}
      <div className='flex gap-2 mb-6 overflow-x-auto'>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
            className='flex items-center gap-2 whitespace-nowrap'
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>

      {/* Data Sources Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredSources.map((source) => (
          <Card key={source.id} className='hover:shadow-md transition-shadow'>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-primary/10 rounded-lg text-primary'>{source.icon}</div>
                  <div>
                    <CardTitle className='text-lg'>{source.name}</CardTitle>
                    {getStatusBadge(source.status)}
                  </div>
                </div>
              </div>
              <CardDescription className='mt-2'>{source.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground mb-2'>Connects to:</p>
                  <div className='flex flex-wrap gap-1'>
                    {source.connects.map((platform) => (
                      <Badge key={platform} variant='outline' className='text-xs'>
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  className='w-full'
                  disabled={source.status !== 'available'}
                  variant={source.status === 'available' ? 'default' : 'outline'}
                >
                  {source.status === 'available'
                    ? 'Connect Now'
                    : source.status === 'beta'
                      ? 'Join Beta'
                      : 'Coming Soon'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Migration Notice */}
      <Card className='mt-8 border-orange-200 bg-orange-50/50'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MessageCircle className='h-5 w-5 text-orange-600' />
            Moving Beyond CSV Imports
          </CardTitle>
          <CardDescription>
            Traditional CSV imports are being phased out in favor of intelligent data connections
            that provide richer context and maintain data relationships. Need to import legacy data?
            Contact our support team for migration assistance.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
