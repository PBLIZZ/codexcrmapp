'use client';

import _React, { useState } from 'react';
import { Download, ArrowRight, Sparkles, FileText, Gift } from 'lucide-react';
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
import { Textarea } from '@codexcrm/ui/components/ui/textarea';

export function LeadMagnetStudio() {
  const [leadMagnetTitle, setLeadMagnetTitle] = useState('');

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <div className='space-y-6'>
        <div className='bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg'>
          <h2 className='text-2xl font-bold flex items-center gap-2 mb-4 text-amber-700 dark:text-amber-300'>
            <Gift className='h-6 w-6' />
            Lead Magnet Studio
          </h2>
          <p className='text-muted-foreground mb-6'>
            Create valuable downloadable resources that attract new clients and grow your email
            list. Our AI-powered tools help you design professional lead magnets that convert
            visitors into leads.
          </p>

          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium mb-1 block'>Lead Magnet Title</label>
              <Input
                placeholder="e.g., '10 Essential Wellness Practices for Busy Professionals'"
                value={leadMagnetTitle}
                onChange={(e) => setLeadMagnetTitle(e.target.value)}
                className='bg-white dark:bg-amber-950/40'
              />
            </div>

            <div>
              <label className='text-sm font-medium mb-1 block'>Description</label>
              <Textarea
                placeholder='Briefly describe what your lead magnet will offer...'
                className='bg-white dark:bg-amber-950/40 min-h-[100px]'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium mb-1 block'>Lead Magnet Type</label>
                <select className='w-full h-9 rounded-md border border-input bg-white dark:bg-amber-950/40 px-3 py-1 text-sm'>
                  <option value='ebook'>E-Book / PDF Guide</option>
                  <option value='checklist'>Checklist</option>
                  <option value='worksheet'>Worksheet</option>
                  <option value='template'>Template</option>
                  <option value='minicourse'>Mini-Course</option>
                </select>
              </div>
              <div>
                <label className='text-sm font-medium mb-1 block'>Target Audience</label>
                <select className='w-full h-9 rounded-md border border-input bg-white dark:bg-amber-950/40 px-3 py-1 text-sm'>
                  <option value='new'>New Clients</option>
                  <option value='existing'>Existing Clients</option>
                  <option value='specific'>Specific Niche</option>
                  <option value='broad'>General Audience</option>
                </select>
              </div>
            </div>

            <Button className='w-full bg-amber-600 text-white hover:bg-teal-100 hover:text-teal-800'>
              <Sparkles className='h-4 w-4 mr-2' />
              Generate Lead Magnet
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
                <div className='h-2 w-2 rounded-full bg-amber-500'></div>
                <span className='text-sm'>AI-powered content generation</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-amber-500'></div>
                <span className='text-sm'>Professional design templates</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-amber-500'></div>
                <span className='text-sm'>Automated email capture forms</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-amber-500'></div>
                <span className='text-sm'>Performance tracking and analytics</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-6'>
        <Card className='border-amber-100 dark:border-amber-900/50 py-0'>
          <CardHeader className='pt-6 pb-3 bg-amber-50 dark:bg-amber-950/20 rounded-t-lg'>
            <CardTitle className='text-lg font-semibold'>Lead Magnet Preview</CardTitle>
            <CardDescription>How your lead magnet might look</CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='border rounded-md p-4 bg-white dark:bg-amber-950/10'>
              <div className='aspect-[3/4] flex flex-col border border-dashed border-amber-200 dark:border-amber-800 rounded-md overflow-hidden max-h-[400px]'>
                <div className='bg-amber-100 dark:bg-amber-900/30 p-4 text-center'>
                  <h3 className='font-medium text-lg'>
                    {leadMagnetTitle || '10 Essential Wellness Practices for Busy Professionals'}
                  </h3>
                  <p className='text-xs text-muted-foreground mt-1'>Your Practice Name</p>
                </div>
                <div className='flex-1 p-4 flex flex-col items-center justify-center text-center gap-2'>
                  <FileText className='h-12 w-12 text-amber-400' />
                  <p className='text-sm text-muted-foreground'>
                    Your professionally designed lead magnet content will appear here
                  </p>
                </div>
                <div className='bg-amber-50 dark:bg-amber-900/20 p-2 text-center'>
                  <p className='text-xs text-muted-foreground'>www.yourpractice.com</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t pt-4 pb-6'>
            <Button variant='outline' size='sm' asChild>
              <Link href={{ pathname: '/marketing/lead-magnets/templates' }}>Browse Templates</Link>
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-900/30'
              asChild
            >
              <Link href={{ pathname: '/marketing/lead-magnets' }}>
                View Lead Magnets
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className='bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg'>
          <h3 className='font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300'>
            <Download className='h-4 w-4' />
            Try Our Membership & Loyalty
          </h3>
          <p className='text-sm text-muted-foreground mt-1'>
            Ready to convert leads into loyal clients? Our Membership & Loyalty tools help you
            create compelling membership programs and loyalty incentives.
          </p>
          <Button
            variant='link'
            className='text-purple-600 dark:text-purple-400 p-0 h-auto mt-2'
            onClick={() =>
              document.querySelector('[value="membership"]')?.dispatchEvent(new MouseEvent('click'))
            }
          >
            Explore Membership & Loyalty
            <ArrowRight className='ml-1 h-3 w-3' />
          </Button>
        </div>
      </div>
    </div>
  );
}
