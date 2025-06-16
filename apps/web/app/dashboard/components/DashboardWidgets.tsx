'use client';

import * as React from 'react';

// Import all the widget components
import { AiClientInsights } from '@/components/dashboard/ai-client-insights/AiClientInsights';
import { DailyInspirationCard } from '@/components/dashboard/daily-inspiration/DailyInspirationCard';
import { TherapistCheckIn } from '@/components/dashboard/therapist-check-in/TherapistCheckIn';
import { CalendarPreview } from '@/components/dashboard/calendar-preview/CalendarPreview';
import { AiTaskPanel } from '@/components/dashboard/ai-task-panel/AiTaskPanel';
import { BusinessMetricsCard } from '@/components/dashboard/business-metrics/BusinessMetricsCard';
import { QuickActions } from '@/components/dashboard/quick-actions/QuickActions';

/**
 * DashboardWidgets component displays a grid of widgets on the dashboard.
 * It combines all the individual widget components into a responsive layout.
 */
export function DashboardWidgets() {
  return (
    <div className="space-y-6">
      {/* Top Row - 3 equal widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AiClientInsights className="h-full" />
        <DailyInspirationCard className="h-full" />
        <TherapistCheckIn className="h-full" />
      </div>

      {/* Middle Row - Calendar Preview and AI Task Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalendarPreview className="h-full" />
        <AiTaskPanel className="h-full" />
      </div>

      {/* Bottom Row - Business Metrics (full width) */}
      <BusinessMetricsCard />

      {/* Quick Actions Row */}
      <QuickActions className="mt-6" />
    </div>
  );
}