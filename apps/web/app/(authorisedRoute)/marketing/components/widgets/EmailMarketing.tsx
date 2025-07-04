'use client';

import _React, { useState } from 'react';
import { Mail, ArrowRight, Sparkles, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@codexcrm/ui/components/ui/input';
import { Button } from '@codexcrm/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@codexcrm/ui/components/ui/card';

export function EmailMarketing() {
  const [emailSubject, setEmailSubject] = useState('');

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <div className='space-y-6'>
        <div className='bg-teal-50 dark:bg-teal-950/20 p-6 rounded-lg'>
          <h2 className='text-2xl font-bold flex items-center gap-2 mb-4 text-teal-700 dark:text-teal-300'>
            <Mail className='h-6 w-6' />
            Email Marketing Automation
          </h2>
          <p className='text-muted-foreground mb-6'>
            Design automated email sequences that nurture leads and build lasting client
            relationships. Our intuitive email builder helps you create beautiful, personalized
            emails that resonate with your audience.
          </p>

          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium mb-1 block'>Email Subject Line</label>
              <Input
                placeholder="e.g., 'Your Wellness Journey Begins Today'"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className='bg-white dark:bg-teal-950/40'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium mb-1 block'>Audience</label>
                <select className='w-full h-9 rounded-md border border-input bg-white dark:bg-teal-950/40 px-3 py-1 text-sm'>
                  <option value='new'>New Subscribers</option>
                  <option value='existing'>Existing Clients</option>
                  <option value='inactive'>Inactive Clients</option>
                </select>
              </div>
              <div>
                <label className='text-sm font-medium mb-1 block'>Email Type</label>
                <select className='w-full h-9 rounded-md border border-input bg-white dark:bg-teal-950/40 px-3 py-1 text-sm'>
                  <option value='welcome'>Welcome Series</option>
                  <option value='newsletter'>Newsletter</option>
                  <option value='promotion'>Promotion</option>
                  <option value='event'>Event Invitation</option>
                </select>
              </div>
            </div>

            <Button className='w-full bg-teal-600 hover:bg-teal-100 hover:text-teal-800 text-white'>
              <Sparkles className='h-4 w-4 mr-2' />
              Generate Email Template
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
                <div className='h-2 w-2 rounded-full bg-teal-500'></div>
                <span className='text-sm'>Personalized templates with dynamic content</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-teal-500'></div>
                <span className='text-sm'>Behavior-based triggers and automations</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-teal-500'></div>
                <span className='text-sm'>Detailed performance analytics and insights</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-teal-500'></div>
                <span className='text-sm'>A/B testing to optimize open and click rates</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-6'>
        <Card className='border-teal-100 dark:border-teal-900/50 py-0'>
          <CardHeader className='pt-6 pb-3 bg-teal-50 dark:bg-teal-950/20 rounded-t-lg'>
            <CardTitle className='text-lg font-semibold'>Email Preview</CardTitle>
            <CardDescription>How your email might look to recipients</CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='border rounded-md p-4 bg-white dark:bg-teal-950/10'>
              <div className='border-b pb-2 mb-3'>
                <div className='font-medium'>
                  {emailSubject || 'Your Wellness Journey Begins Today'}
                </div>
                <div className='text-xs text-muted-foreground'>From: Your Practice Name</div>
              </div>
              <div className='space-y-3 text-sm'>
                <p>Dear [Client Name],</p>
                <p>
                  Thank you for joining our wellness community. We&apos;re excited to be part of
                  your journey toward balance and well-being.
                </p>{' '}
                {/* Escaped apostrophe */}
                <p>Here are some resources to get you started:</p>
                <ul className='list-disc pl-5 space-y-1'>
                  <li>Your free wellness assessment</li>
                  <li>Beginner&apos;s guide to mindfulness</li> {/* Escaped apostrophe */}
                  <li>Schedule your first session</li>
                </ul>
                <p>Looking forward to supporting you,</p>
                <p>Your Name</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t pt-4 pb-6'>
            <Button variant='outline' size='sm' asChild>
              <Link href={{ pathname: '/marketing/email/templates' }}>Browse Templates</Link>
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/20 dark:hover:bg-teal-900/30'
              asChild
            >
              <Link href={{ pathname: '/marketing/email' }}>
                Create Email Campaign
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className='bg-rose-50 dark:bg-rose-950/20 p-4 rounded-lg'>
          <h3 className='font-medium flex items-center gap-2 text-rose-700 dark:text-rose-300'>
            <Megaphone className='h-4 w-4' />
            Try Our Creator Studio
          </h3>
          <p className='text-sm text-muted-foreground mt-1'>
            Unlock limitless content potential with Creator Studio. Ideate blog posts, social
            captions, emails, and more — then let AI craft on-brand copy and visuals for you. Feed
            previous blogs or videos and watch the studio match your unique tone.
          </p>
          <Button
            variant='link'
            className='text-rose-600 dark:text-rose-400 p-0 h-auto mt-2'
            onClick={() =>
              document.querySelector('[value="creator"]')?.dispatchEvent(new MouseEvent('click'))
            }
          >
            Explore Creator Studio
            <ArrowRight className='ml-1 h-3 w-3' />
          </Button>
        </div>
      </div>
    </div>
  );
}
