'use client';

import { useState } from 'react';
import { Palette, ArrowRight, Sparkles, Image, Layers, Wand2 } from 'lucide-react';
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

export function CreatorStudio() {
  const [promptText, setPromptText] = useState('');

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <div className='space-y-6'>
        <div className='bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg'>
          <h2 className='text-2xl font-bold flex items-center gap-2 mb-4 text-purple-700 dark:text-purple-300'>
            <Palette className='h-6 w-6' />
            Creator Studio
          </h2>
          <p className='text-muted-foreground mb-6'>
            Go beyond visuals—ideate, write, and design any marketing asset in one place. Creator
            Studio uses AI to craft on-brand blog posts, email sequences, captions, and eye-catching
            graphics from a single prompt or your past content.
          </p>

          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium mb-1 block'>Design Prompt</label>
              <Input
                placeholder="e.g., 'Calming yoga pose in nature with soft lighting'"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className='bg-white dark:bg-purple-950/40'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium mb-1 block'>Content Type</label>
                <select className='w-full h-9 rounded-md border border-input bg-white dark:bg-purple-950/40 px-3 py-1 text-sm'>
                  <option value='social'>Social Media Post</option>
                  <option value='banner'>Website Banner</option>
                  <option value='flyer'>Digital Flyer</option>
                  <option value='logo'>Logo Design</option>
                </select>
              </div>
              <div>
                <label className='text-sm font-medium mb-1 block'>Style</label>
                <select className='w-full h-9 rounded-md border border-input bg-white dark:bg-purple-950/40 px-3 py-1 text-sm'>
                  <option value='minimalist'>Minimalist</option>
                  <option value='vibrant'>Vibrant & Colorful</option>
                  <option value='serene'>Serene & Calm</option>
                  <option value='professional'>Professional</option>
                </select>
              </div>
            </div>

            <Button className='w-full bg-purple-600 text-white hover:bg-teal-100 hover:text-teal-800'>
              <Sparkles className='h-4 w-4 mr-2' />
              Generate Content
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
                <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                <span className='text-sm'>AI-powered image generation with your brand style</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                <span className='text-sm'>Customizable templates for all social platforms</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                <span className='text-sm'>Brand kit integration for consistent visuals</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                <span className='text-sm'>One-click resize for different platforms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-6'>
        <Card className='border-purple-100 dark:border-purple-900/50 py-0'>
          <CardHeader className='pt-6 pb-3 bg-purple-50 dark:bg-purple-950/20 rounded-t-lg'>
            <CardTitle className='text-lg font-semibold'>Design Preview</CardTitle>
            <CardDescription>How your generated design might look</CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='border rounded-md p-4 bg-white dark:bg-purple-950/10 aspect-square flex items-center justify-center relative overflow-hidden'>
              {promptText ? (
                <div className='text-center space-y-4'>
                  <Layers className='h-16 w-16 mx-auto text-purple-400' />
                  <p className='text-sm text-muted-foreground'>
                    Your design based on: &quot;{promptText}&quot;<br />
                    would appear here after generation
                  </p>
                </div>
              ) : (
                <div className='text-center space-y-4'>
                  <Image className='h-16 w-16 mx-auto text-purple-300' />
                  <p className='text-sm text-muted-foreground z-10'>
                    Enter a prompt and click &apos;Generate Content&apos;
                    <br />
                    to create your custom visual
                  </p>
                  <Wand2 className='absolute -bottom-4 -left-4 h-24 w-24 text-purple-100/50 dark:text-purple-900/50 rotate-12' />
                  <Layers className='absolute -top-5 -right-5 h-20 w-20 text-purple-100/50 dark:text-purple-900/50 rotate-12' />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t pt-4 pb-6'>
            <Button variant='outline' size='sm' asChild>
              <Link href={{ pathname: '/marketing/creator/templates' }}>Browse Templates</Link>
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-900/30'
              asChild
            >
              <Link href={{ pathname: '/marketing/creator' }}>
                Open Creator Studio
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className='bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg'>
          <h3 className='font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300'>
            <Sparkles className='h-4 w-4' />
            Try Our Content Calendar
          </h3>
          <p className='text-sm text-muted-foreground mt-1'>
            Ready to schedule your new designs? Our Content Calendar helps you plan and automate
            your content across all platforms.
          </p>
          <Button
            variant='link'
            className='text-blue-600 dark:text-blue-400 p-0 h-auto mt-2'
            onClick={() =>
              document.querySelector('[value="calendar"]')?.dispatchEvent(new MouseEvent('click'))
            }
          >
            Explore Content Calendar
            <ArrowRight className='ml-1 h-3 w-3' />
          </Button>
        </div>
      </div>
    </div>
  );
}
