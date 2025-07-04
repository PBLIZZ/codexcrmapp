'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@codexcrm/ui/components/ui/card";
import { api } from "@/lib/trpc";
import { AlertCircle, ArrowRight, TrendingUp, TrendingDown, Users, Calendar, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@codexcrm/ui/components/ui/alert";
import { Button } from "@codexcrm/ui/components/ui/button";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Theme-consistent color constants - using the same color palette as the rest of the dashboard
const COLORS = ['#00afaf', '#ffaf00', '#8884d8', '#FF8042', '#00C49F'];

interface BusinessMetricsCardProps {
  className?: string;
}

export function BusinessMetricsCard({ className }: BusinessMetricsCardProps) {
  // Temporarily disabled API calls for auth testing - use mock data
  const apiData = null;
  const isLoading = false;
  const error = null;
  const apiContactMetrics = null;
  const apiSessionMetrics = null;

  // Mock data to use when API endpoints are not available
  const mockData = {
    totalContacts: 42,
    upcomingSessionsCount: 5,
  };

  const mockContactMetrics = {
    journeyStageDistribution: [
      { wellness_journey_stage: 'onboarding', count: 8 },
      { wellness_journey_stage: 'inquiry', count: 12 },
      { wellness_journey_stage: 'inactive', count: 5 },
      { wellness_journey_stage: 'maintenance', count: 10 },
      { wellness_journey_stage: 'active', count: 7 }
    ]
  };

  const mockSessionMetrics = {
    sessionTrend: [
      { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), count: 2 },
      { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), count: 3 },
      { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), count: 1 },
      { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), count: 4 },
      { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), count: 2 },
      { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), count: 3 },
      { date: new Date().toISOString(), count: 5 }
    ]
  };

  // Use API data if available, otherwise use mock data
  const data = apiData || mockData;
  const contactMetrics = apiContactMetrics || mockContactMetrics;
  const sessionMetrics = apiSessionMetrics || mockSessionMetrics;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Format journey stage data for pie chart with warmer terminology
  const journeyStageData = contactMetrics.journeyStageDistribution.map((stage: any, index: number) => {
    // Map the existing journey stage names to warmer, more relationship-focused terms
    let displayName = stage.wellness_journey_stage;
    
    // Transform the stage names to warmer terminology
    switch(stage.wellness_journey_stage.toLowerCase()) {
      case 'onboarding':
        displayName = 'Welcome';
        break;
      case 'inquiry':
        displayName = 'Inquiry'; // Keep English spelling
        break;
      case 'inactive':
        displayName = 'Needs Outreach';
        break;
      case 'maintenance':
        displayName = 'Relationship Development';
        break;
      case 'active':
        displayName = 'My Core Tribe';
        break;
    }
    
    return {
      name: displayName,
      value: stage.count,
      originalName: stage.wellness_journey_stage // Keep original for data integrity
    };
  }) || [];

  // Format session trend data for area chart
  const sessionTrendData = sessionMetrics.sessionTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sessions: item.count,
  })) || [];

  // Calculate retention risk (mock data - would be calculated based on engagement metrics)
  const retentionRisk = {
    high: Math.floor(Math.random() * 5),
    medium: Math.floor(Math.random() * 10),
    low: (data?.totalContacts || 0) - Math.floor(Math.random() * 15),
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {/* Upcoming Sessions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.upcomingSessionsCount || 0}</div>
          <p className="text-xs text-muted-foreground">
            {data?.upcomingSessionsCount === 1
              ? '1 session scheduled'
              : `${data?.upcomingSessionsCount || 0} sessions scheduled`}
          </p>
          <div className="mt-4 space-y-2">
            <div className="text-xs font-medium">Time-based grouping</div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-md bg-primary/10 p-2">
                <div className="font-medium">Today</div>
                <div>{Math.floor((data?.upcomingSessionsCount || 0) * 0.3)}</div>
              </div>
              <div className="rounded-md bg-primary/10 p-2">
                <div className="font-medium">This Week</div>
                <div>{Math.floor((data?.upcomingSessionsCount || 0) * 0.6)}</div>
              </div>
              <div className="rounded-md bg-primary/10 p-2">
                <div className="font-medium">Later</div>
                <div>{Math.floor((data?.upcomingSessionsCount || 0) * 0.1)}</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={{ pathname: '/calendar' }}>
              View Calendar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Retention Risk Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Retention Risk</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{retentionRisk.high}</div>
          <p className="text-xs text-muted-foreground">
            {retentionRisk.high} customers at high risk
          </p>
          <div className="mt-4 space-y-2">
            <div className="text-xs font-medium">Risk Distribution</div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-md bg-red-100 p-2">
                <div className="font-medium text-red-700">High</div>
                <div>{retentionRisk.high}</div>
              </div>
              <div className="rounded-md bg-amber-100 p-2">
                <div className="font-medium text-amber-700">Medium</div>
                <div>{retentionRisk.medium}</div>
              </div>
              <div className="rounded-md bg-green-100 p-2">
                <div className="font-medium text-green-700">Low</div>
                <div>{retentionRisk.low}</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={{ pathname: '/contacts', query: { risk: 'high' } }}>
              View At-Risk Customers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Goal Progress Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">68%</div>
          <p className="text-xs text-muted-foreground">
            Overall goal completion rate
          </p>
          <div className="mt-4 space-y-2">
            <div className="text-xs font-medium">Goal Categories</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs">Retreats</span>
                <span className="text-xs font-medium">75%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-primary/20">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: '75%' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Workshops</span>
                <span className="text-xs font-medium">50%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-primary/20">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: '50%' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Conversions</span>
                <span className="text-xs font-medium">80%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-primary/20">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={{ pathname: '/goals' }}>
              Manage Goals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Well-being Customer Journey */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Well-being Customer Journey</CardTitle>
          <CardDescription>
            Breakdown of your community by wellness journey stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {journeyStageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={journeyStageData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {journeyStageData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">No journey stage data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Trend - Improved visualization */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Session Trend</CardTitle>
          <CardDescription>
            Your wellness journey impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {sessionTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sessionTrendData}>
                  <defs>
                    <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00afaf" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00afaf" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis
                    dataKey="date"
                    tick={{fontSize: 12}}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{fontSize: 12}}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stroke="#00afaf"
                    strokeWidth={2}
                    fill="url(#sessionGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">No session trend data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}