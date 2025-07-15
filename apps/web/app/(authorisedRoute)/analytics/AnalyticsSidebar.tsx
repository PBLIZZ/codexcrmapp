'use client';

import {
  BarChart,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Mail,
  Calendar,
  LinkIcon,
  Code,
  Settings,
  Download,
  Filter,
  RefreshCw,
  Activity,
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

// Mock data for analytics metrics
const quickMetrics = [
  { label: 'Website Visitors', value: '2,847', change: '+12%', icon: Eye },
  { label: 'New Clients', value: '23', change: '+8%', icon: Users },
  { label: 'Conversion Rate', value: '3.4%', change: '+0.2%', icon: TrendingUp },
  { label: 'Avg Session Time', value: '4:32', change: '+15%', icon: Clock },
];

const integrationStatus = [
  { name: 'Google Analytics 4', status: 'Connected', color: 'green' },
  { name: 'Google Tag Manager', status: 'Connected', color: 'green' },
  { name: 'Facebook Pixel', status: 'Pending', color: 'yellow' },
  { name: 'Google Ads', status: 'Not Connected', color: 'gray' },
];

export function AnalyticsSidebar() {
  const pathname = usePathname();

  return (
    <SidebarContent>
      {/* Analytics Overview */}
      <SidebarGroup>
        <SidebarGroupLabel>Analytics</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/analytics'}>
              <Link href={{ pathname: '/analytics' }} className='flex items-center w-full'>
                <BarChart className='w-4 h-4 mr-3' />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={{ pathname: '/analytics/website' }} className='flex items-center w-full'>
                <Globe className='w-4 h-4 mr-3' />
                <span>Website Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/analytics/marketing' }}
                className='flex items-center w-full'
              >
                <TrendingUp className='w-4 h-4 mr-3' />
                <span>Marketing Performance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={{ pathname: '/analytics/clients' }} className='flex items-center w-full'>
                <Users className='w-4 h-4 mr-3' />
                <span>Client Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/analytics/appointments' }}
                className='flex items-center w-full'
              >
                <Calendar className='w-4 h-4 mr-3' />
                <span>Appointment Metrics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Quick Metrics */}
      <SidebarGroup>
        <SidebarGroupLabel>This Month</SidebarGroupLabel>
        <SidebarMenu>
          {quickMetrics.map((metric, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild className='h-auto p-2'>
                <Link
                  href={{ pathname: '/analytics/detailed' }}
                  className='flex items-center w-full'
                >
                  <div className='flex items-center gap-2 w-full'>
                    <metric.icon className='w-4 h-4 flex-shrink-0' />
                    <div className='flex-1 min-w-0 group-data-[collapsible=icon]:hidden'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>{metric.value}</span>
                        <Badge
                          variant={metric.change.startsWith('+') ? 'default' : 'secondary'}
                          className='h-4 text-xs'
                        >
                          {metric.change}
                        </Badge>
                      </div>
                      <p className='text-xs text-muted-foreground truncate'>{metric.label}</p>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      {/* Reports & Tools */}
      <SidebarGroup>
        <SidebarGroupLabel>Reports & Tools</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/analytics/utm-builder' }}
                className='flex items-center w-full'
              >
                <LinkIcon className='w-4 h-4 mr-2' />
                <span>UTM Builder</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/analytics/tracking-codes' }}
                className='flex items-center w-full'
              >
                <Code className='w-4 h-4 mr-2' />
                <span>Tracking Codes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/analytics/conversion-tracking' }}
                className='flex items-center w-full'
              >
                <MousePointer className='w-4 h-4 mr-2' />
                <span>Conversion Tracking</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/analytics/custom-reports' }}
                className='flex items-center w-full'
              >
                <Filter className='w-4 h-4 mr-2' />
                <span>Custom Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={{ pathname: '/analytics/export' }} className='flex items-center w-full'>
                <Download className='w-4 h-4 mr-2' />
                <span>Export Data</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Integration Status */}
      <SidebarGroup>
        <SidebarGroupLabel>Integrations</SidebarGroupLabel>
        <SidebarMenu>
          {integrationStatus.map((integration, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild className='h-auto p-2'>
                <Link
                  href={{ pathname: '/analytics/integrations' }}
                  className='flex items-center w-full'
                >
                  <div className='flex items-center gap-2 w-full'>
                    <div
                      className={`flex-shrink-0 w-2 h-2 rounded-full ${
                        integration.color === 'green'
                          ? 'bg-green-500'
                          : integration.color === 'yellow'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                      }`}
                    ></div>
                    <div className='flex-1 min-w-0 group-data-[collapsible=icon]:hidden'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium truncate'>{integration.name}</span>
                        <Badge
                          variant={integration.status === 'Connected' ? 'default' : 'secondary'}
                          className='h-4 text-xs ml-1'
                        >
                          {integration.status === 'Connected'
                            ? '✓'
                            : integration.status === 'Pending'
                              ? '⏳'
                              : '○'}
                        </Badge>
                      </div>
                      <p className='text-xs text-muted-foreground'>{integration.status}</p>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      {/* Data Sources */}
      <SidebarGroup>
        <SidebarGroupLabel>Data Sources</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/analytics/google-analytics' }}
                className='flex items-center w-full'
              >
                <Activity className='w-4 h-4 mr-2' />
                <span>Google Analytics 4</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/analytics/google-tag-manager' }}
                className='flex items-center w-full'
              >
                <Code className='w-4 h-4 mr-2' />
                <span>Google Tag Manager</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={{ pathname: '/analytics/crm-data' }} className='flex items-center w-full'>
                <Users className='w-4 h-4 mr-2' />
                <span>CRM Data</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={{ pathname: '/analytics/email-metrics' }}
                className='flex items-center w-full'
              >
                <Mail className='w-4 h-4 mr-2' />
                <span>Email Metrics</span>
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
              <Link href={{ pathname: '/analytics/sync' }} className='flex items-center w-full'>
                <RefreshCw className='w-4 h-4 mr-2' />
                <span>Sync Data</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={{ pathname: '/analytics/settings' }} className='flex items-center w-full'>
                <Settings className='w-4 h-4 mr-2' />
                <span>Analytics Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}
