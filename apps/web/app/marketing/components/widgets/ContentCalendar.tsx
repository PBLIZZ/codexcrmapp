'use client';

import { useState } from 'react';
import {
  Calendar,
  ArrowRight,
  Sparkles,
  Clock as _Clock,
  CalendarDays,
  PlusCircle as _PlusCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

export function ContentCalendar() {
  const [contentTitle, setContentTitle] = useState('');

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <div className='space-y-6'>
        <div className='bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg'>
          <h2 className='text-2xl font-bold flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-300'>
            <Calendar className='h-6 w-6' />
            Content Calendar
          </h2>
          <p className='text-muted-foreground mb-6'>
            Plan, schedule, and automate your content across all platforms. Our intuitive calendar
            helps you maintain a consistent presence and engage your audience with timely, relevant
            content.
          </p>

          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium mb-1 block'>Content Title</label>
              <Input
                placeholder="e.g., '5 Mindfulness Practices for Busy Professionals'"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                className='bg-white dark:bg-blue-950/40'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium mb-1 block'>Content Type</label>
                <select className='w-full h-9 rounded-md border border-input bg-white dark:bg-blue-950/40 px-3 py-1 text-sm'>
                  <option value='blog'>Blog Post</option>
                  <option value='social'>Social Media Post</option>
                  <option value='email'>Email Newsletter</option>
                  <option value='video'>Video Content</option>
                </select>
              </div>
              <div>
                <label className='text-sm font-medium mb-1 block'>Schedule Date</label>
                <Input type='date' className='bg-white dark:bg-blue-950/40' />
              </div>
            </div>

            <Button className='w-full bg-teal-600 hover:bg-teal-100 hover:text-teal-800 text-white'>
              <Sparkles className='h-4 w-4 mr-2' />
              Add to Calendar
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg font-semibold'>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                <span className='text-sm'>
                  Visual content planning with drag-and-drop interface
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                <span className='text-sm'>Automated publishing to multiple platforms</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                <span className='text-sm'>Content recycling and repurposing suggestions</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                <span className='text-sm'>Performance analytics for published content</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-6'>
        <Card className='border-blue-100 dark:border-blue-900/50 py-0'>
          <CardHeader className='pt-6 pb-3 bg-blue-50 dark:bg-blue-950/20 rounded-t-lg'>
            <CardTitle className='text-lg font-semibold'>Calendar Preview</CardTitle>
            <CardDescription>Your upcoming content schedule</CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='border rounded-md p-4 bg-white dark:bg-blue-950/10'>
              <div className='text-sm font-medium mb-3 pb-2 border-b flex items-center justify-between'>
                <span>June 2025</span>
                <div className='flex gap-1'>
                  <button className='p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20'>
                    <ArrowRight className='h-4 w-4 rotate-180' />
                  </button>
                  <button className='p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20'>
                    <ArrowRight className='h-4 w-4' />
                  </button>
                </div>
              </div>

              {/* Simplified week view with colored bubbles and labels */}
              <div className='space-y-2'>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, idx) => (
                  <div key={d} className='flex items-start gap-3'>
                    <span className='w-10 text-right text-xs mt-1 font-medium'>{d}</span>
                    <div className='flex-1 space-y-1'>
                      {idx === 1 && (
                        <div className='bg-teal-100 text-teal-800 rounded px-2 py-1 text-xs inline-flex items-center gap-1'>
                          <CalendarDays className='h-3 w-3' /> Instagram –{' '}
                          {contentTitle || 'Mindfulness Reel'}
                        </div>
                      )}
                      {idx === 2 && (
                        <div className='bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs inline-flex items-center gap-1'>
                          <CalendarDays className='h-3 w-3' /> Blog – 5 Tips for Balance
                        </div>
                      )}
                      {idx === 4 && (
                        <div className='bg-purple-100 text-purple-800 rounded px-2 py-1 text-xs inline-flex items-center gap-1'>
                          <CalendarDays className='h-3 w-3' /> Newsletter – Weekend Reset
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t pt-4 pb-6'>
            <Button variant='outline' size='sm' asChild>
              <Link href={{ pathname: '/marketing/calendar/analytics' }}>View Analytics</Link>
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/30'
              asChild
            >
              <Link href={{ pathname: '/marketing/calendar' }}>
                Open Full Calendar
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className='bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg'>
          <h3 className='font-medium flex items-center gap-2 text-amber-700 dark:text-amber-300'>
            <Sparkles className='h-4 w-4' />
            Try Our Lead Magnet Studio
          </h3>
          <p className='text-sm text-muted-foreground mt-1'>
            Need content for your calendar? Our Lead Magnet Studio helps you create valuable
            downloadable resources to attract new clients.
          </p>
          <Button
            variant='link'
            className='text-amber-600 dark:text-amber-400 p-0 h-auto mt-2'
            onClick={() =>
              document.querySelector('[value="lead"]')?.dispatchEvent(new MouseEvent('click'))
            }
          >
            Explore Lead Magnet Studio
            <ArrowRight className='ml-1 h-3 w-3' />
          </Button>
        </div>
      </div>
    </div>
  );
}
