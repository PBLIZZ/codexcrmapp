'use client';

import React, { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@codexcrm/ui';
import { Heart, Save, CheckCircle } from 'lucide-react';

interface TherapistCheckInProps {
  className?: string;
}

export function TherapistCheckIn({ className }: TherapistCheckInProps) {
  const [mood, setMood] = useState<string | null>(null);
  const [connections, setConnections] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  // Mood options with emojis
  const moodOptions = [
    { label: 'Great', emoji: '😊' },
    { label: 'Good', emoji: '🙂' },
    { label: 'Okay', emoji: '😐' },
    { label: 'Stressed', emoji: '😓' },
  ];

  // Connection count options
  const connectionOptions = [0, 1, 2, 3, '4+'];

  // Handle save
  const handleSave = () => {
    // In a real implementation, this would save to an API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div>
          <CardTitle className='text-sm font-medium'>Daily Check-In</CardTitle>
          <CardDescription className='text-xs text-muted-foreground'>
            Track your wellbeing and client connections
          </CardDescription>
        </div>
        <Heart className='h-5 w-5 text-primary' />
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <p className='mb-2 text-sm font-medium'>How are you feeling today?</p>
          <div className='flex flex-wrap gap-2'>
            {moodOptions.map((option) => (
              <Button
                key={option.label}
                variant={mood === option.label ? 'default' : 'outline'}
                onClick={() => setMood(option.label)}
                size='sm'
                className='flex gap-1'
              >
                <span>{option.emoji}</span>
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className='mb-2 text-sm font-medium'>Client connections today:</p>
          <div className='flex flex-wrap gap-2'>
            {connectionOptions.map((option) => (
              <Button
                key={option.toString()}
                variant={connections === option ? 'default' : 'outline'}
                onClick={() => setConnections(typeof option === 'string' ? 4 : option)}
                size='sm'
                className='flex gap-1'
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <div className='flex justify-end gap-2 py-pt-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleSave}
            disabled={!mood || connections === null || saved}
            className='flex w-full gap-2'
          >
            {saved ? (
              <>
                <CheckCircle className='mr-2 h-4 w-4' />
                Saved
              </>
            ) : (
              <>
                <Save className='mr-2 h-4 w-4' />
                Save Check-In
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
