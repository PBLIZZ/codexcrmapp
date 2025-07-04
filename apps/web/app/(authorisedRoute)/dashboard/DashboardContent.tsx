'use client';

import { AiTaskPanel } from '@/app/(authorisedRoute)/dashboard/components/ai-task-panel/AiTaskPanel';
import { BusinessMetricsCard } from '@/app/(authorisedRoute)/dashboard/components/business-metrics/BusinessMetricsCard';
import { QuickActions } from '@/app/(authorisedRoute)/dashboard/components/quick-actions/QuickActions';

export default function DashboardContent() {
  return (
    <div className='py-6'>
      <div className='flex flex-col space-y-8'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground mt-1'>Welcome to your CRM dashboard</p>
        </div>

        {/* Business Metrics */}
        <BusinessMetricsCard />

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Takes 2/3 of the width on large screens */}
          <div className='lg:col-span-2 space-y-6'>
            {/* AI Task Panel */}
            <AiTaskPanel />
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            {/* Quick Actions */}
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
