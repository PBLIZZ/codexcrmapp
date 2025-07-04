'use client';

// Import all the widget components
import { AiClientInsights } from '@/app/(authorisedRoute)/dashboard/components/ai-client-insights/AiClientInsights';
import { DailyInspirationCard } from '@/app/(authorisedRoute)/dashboard/components/daily-inspiration/DailyInspirationCard';
import { TherapistCheckIn } from '@/app/(authorisedRoute)/dashboard/components/therapist-check-in/TherapistCheckIn';
import { AiTaskPanel } from '@/app/(authorisedRoute)/dashboard/components/ai-task-panel/AiTaskPanel';
import { BusinessMetricsCard } from '@/app/(authorisedRoute)/dashboard/components/business-metrics/BusinessMetricsCard';
import { QuickActions } from '@/app/(authorisedRoute)/dashboard/components/quick-actions/QuickActions';

/**
 * DashboardWidgets component displays a grid of widgets on the dashboard.
 * It combines all the individual widget components into a responsive layout.
 */
export function DashboardWidgets() {
  return (
    <div className='space-y-6'>
      {/* Top Row - 3 equal widgets */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <AiClientInsights className='h-full' />
        <DailyInspirationCard className='h-full' />
        <TherapistCheckIn className='h-full' />
      </div>

      {/* Middle Row - AI Task Panel */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <AiTaskPanel className='h-full' />
      </div>

      {/* Bottom Row - Business Metrics (full width) */}
      <BusinessMetricsCard />

      {/* Quick Actions Row */}
      <QuickActions className='mt-6' />
    </div>
  );
}
