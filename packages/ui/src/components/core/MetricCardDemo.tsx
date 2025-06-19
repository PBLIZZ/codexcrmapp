'use client';

import { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  MetricCard,
  SimpleLineChart,
  ProgressIndicator,
  CircularProgress,
} from '../ui/metric-card';

export interface MetricCardDemoProps {
  className?: string;
}

export function MetricCardDemo({ className }: MetricCardDemoProps) {
  const [loading, setLoading] = useState(false);

  // Toggle loading state for demo purposes
  const toggleLoading = () => {
    setLoading((prev) => !prev);
  };

  // Sample data for charts
  const lineData1 = [10, 15, 8, 12, 18, 15, 20, 25, 22, 30];
  const lineData2 = [20, 15, 25, 18, 15, 20, 18, 15, 20, 18];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Metric Cards</h2>
        <button
          onClick={toggleLoading}
          className="px-3 py-1 rounded-md bg-primary text-primary-foreground"
        >
          {loading ? 'Show Data' : 'Show Loading'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Basic Metric Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Total Users"
              value="1,234"
              trend="up"
              trendValue="+12%"
              trendLabel="vs last month"
              loading={loading}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />

            <MetricCard
              title="Revenue"
              value="$45,678"
              trend="up"
              trendValue="+8.3%"
              trendLabel="vs last month"
              loading={loading}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            />

            <MetricCard
              title="Conversion Rate"
              value="3.2%"
              trend="down"
              trendValue="-0.5%"
              trendLabel="vs last month"
              loading={loading}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Metric Cards with Charts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Website Traffic"
              value="12,345"
              trend="up"
              trendValue="+15%"
              loading={loading}
              chart={
                <SimpleLineChart data={lineData1} color="var(--primary)" />
              }
            />

            <MetricCard
              title="Bounce Rate"
              value="42%"
              trend="down"
              trendValue="-3%"
              loading={loading}
              chart={<SimpleLineChart data={lineData2} color="var(--accent)" />}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Metric Cards with Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Storage Used"
              value="45 GB"
              trend="neutral"
              trendLabel="of 100 GB"
              loading={loading}
              chart={
                <ProgressIndicator value={45} max={100} showValue size="md" />
              }
            />

            <MetricCard
              title="Task Completion"
              value="75%"
              trend="up"
              trendValue="+5%"
              loading={loading}
              chart={
                <ProgressIndicator
                  value={75}
                  max={100}
                  color="var(--accent)"
                  size="md"
                />
              }
            />

            <MetricCard
              title="CPU Usage"
              value="28%"
              trend="down"
              trendValue="-12%"
              loading={loading}
              footer={
                <div className="flex justify-center">
                  <CircularProgress value={28} showValue size={60} />
                </div>
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Metric Card Variants</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Default"
              value="1,234"
              variant="default"
              loading={loading}
            />

            <MetricCard
              title="Primary"
              value="1,234"
              variant="primary"
              loading={loading}
            />

            <MetricCard
              title="Accent"
              value="1,234"
              variant="accent"
              loading={loading}
            />

            <MetricCard
              title="Outline"
              value="1,234"
              variant="outline"
              loading={loading}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Metric Card Sizes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Small"
              value="1,234"
              size="sm"
              loading={loading}
            />

            <MetricCard
              title="Medium"
              value="1,234"
              size="md"
              loading={loading}
            />

            <MetricCard
              title="Large"
              value="1,234"
              size="lg"
              loading={loading}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Interactive Metric Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="With Hover Effect"
              value="1,234"
              trend="up"
              trendValue="+12%"
              withHover
              loading={loading}
            />

            <MetricCard
              title="With Shadow"
              value="1,234"
              trend="up"
              trendValue="+12%"
              withShadow
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
