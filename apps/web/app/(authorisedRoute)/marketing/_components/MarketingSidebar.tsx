'use client';

import {
  Mail,
  Share2,
  Globe,
  FileText,
  Target,
  TrendingUp,
  Users,
  PenTool,
  Camera,
  Video,
  BookOpen,
  Gift,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Badge } from '@codexcrm/ui';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// Mock data for marketing campaigns
const mockCampaigns = [
  {
    id: '1',
    name: 'Spring Wellness Challenge',
    type: 'Email',
    status: 'Active',
    performance: '+12%',
  },
  {
    id: '2',
    name: 'Meditation Workshop Promo',
    type: 'Social',
    status: 'Scheduled',
    performance: 'N/A',
  },
  {
    id: '3',
    name: 'New Client Welcome Series',
    type: 'Email',
    status: 'Active',
    performance: '+8%',
  },
  {
    id: '4',
    name: 'Instagram Stories Campaign',
    type: 'Social',
    status: 'Draft',
    performance: 'N/A',
  },
];

export function MarketingSidebar() {
  const pathname = usePathname();

  return (
    <SidebarContent>
      {/* Marketing Tools */}
      <SidebarGroup>
        <SidebarGroupLabel>Marketing Tools</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/marketing'}>
              <Link href={{ pathname: '/marketing' }} className='flex items-center w-full'>
                <TrendingUp className='w-4 h-4 mr-3' />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/marketing/campaigns' }}
                className='flex items-center justify-between w-full'
              >
                <div className='flex items-center gap-3'>
                  <Target className='w-4 h-4' />
                  <span>Campaigns</span>
                </div>
                <Badge variant='secondary' className='h-5 flex-shrink-0'>
                  4
                </Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={{ pathname: '/marketing/email' }} className='flex items-center w-full'>
                <Mail className='w-4 h-4 mr-3' />
                <span>Email Marketing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={{ pathname: '/marketing/social' }} className='flex items-center w-full'>
                <Share2 className='w-4 h-4 mr-3' />
                <span>Social Media</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={{ pathname: '/marketing/content' }} className='flex items-center w-full'>
                <FileText className='w-4 h-4 mr-3' />
                <span>Content Library</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={{ pathname: '/marketing/website' }} className='flex items-center w-full'>
                <Globe className='w-4 h-4 mr-3' />
                <span>Website & SEO</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/marketing/referrals' }}
                className='flex items-center w-full'
              >
                <Users className='w-4 h-4 mr-3' />
                <span>Referral Program</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Content Creation */}
      <SidebarGroup>
        <SidebarGroupLabel>Create Content</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/marketing/create/email' }}
                className='flex items-center w-full'
              >
                <Mail className='w-4 h-4 mr-2' />
                <span>New Email Campaign</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/marketing/create/social' }}
                className='flex items-center w-full'
              >
                <Camera className='w-4 h-4 mr-2' />
                <span>Social Media Post</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/marketing/create/blog' }}
                className='flex items-center w-full'
              >
                <PenTool className='w-4 h-4 mr-2' />
                <span>Blog Post</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/marketing/create/video' }}
                className='flex items-center w-full'
              >
                <Video className='w-4 h-4 mr-2' />
                <span>Video Content</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/marketing/create/newsletter' }}
                className='flex items-center w-full'
              >
                <BookOpen className='w-4 h-4 mr-2' />
                <span>Newsletter</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/marketing/create/promotion' }}
                className='flex items-center w-full'
              >
                <Gift className='w-4 h-4 mr-2' />
                <span>Special Offer</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Active Campaigns */}
      <SidebarGroup>
        <SidebarGroupLabel>Active Campaigns</SidebarGroupLabel>
        <SidebarMenu>
          {mockCampaigns.slice(0, 3).map((campaign) => (
            <SidebarMenuItem key={campaign.id}>
              <SidebarMenuButton asChild className='h-auto p-2'>
                <Link
                  href={{ pathname: `/marketing/campaign/${campaign.id}` }}
                  className='flex items-start w-full'
                >
                  <div className='flex items-center gap-2 w-full'>
                    <div className='flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2'></div>
                    <div className='flex-1 min-w-0 group-data-[collapsible=icon]:hidden'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium truncate'>{campaign.name}</span>
                        <Badge
                          variant={campaign.status === 'Active' ? 'default' : 'secondary'}
                          className='h-4 text-xs ml-1'
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {campaign.type} • {campaign.performance}
                      </p>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      {/* Wellness Marketing Templates */}
      <SidebarGroup>
        <SidebarGroupLabel>Wellness Templates</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/marketing/templates/yoga' }}
                className='flex items-center w-full'
              >
                <span className='mr-2'>🧘‍♀️</span>
                <span className='group-data-[collapsible=icon]:hidden'>Yoga & Meditation</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/marketing/templates/nutrition' }}
                className='flex items-center w-full'
              >
                <span className='mr-2'>🥗</span>
                <span className='group-data-[collapsible=icon]:hidden'>Nutrition & Wellness</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/marketing/templates/mindfulness' }}
                className='flex items-center w-full'
              >
                <span className='mr-2'>🌱</span>
                <span className='group-data-[collapsible=icon]:hidden'>
                  Mindfulness & Self-Care
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/marketing/templates/seasonal' }}
                className='flex items-center w-full'
              >
                <span className='mr-2'>🍂</span>
                <span className='group-data-[collapsible=icon]:hidden'>Seasonal Campaigns</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Settings */}
      <SidebarGroup>
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={{ pathname: '/marketing/settings' }} className='flex items-center w-full'>
                <Settings className='w-4 h-4 mr-2' />
                <span>Marketing Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}
