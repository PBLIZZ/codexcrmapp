// apps/web/src/components/ui/ShadcnCalendarTest.tsx
'use client';

import * as React from 'react';

import { Calendar } from '@/components/ui/calendar'; // Path alias from components.json

export function ShadcnCalendarTest() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="mt-8 p-6 max-w-md mx-auto bg-orange-200 rounded-xl shadow-md flex flex-col items-center">
      <h3 className="text-lg font-medium text-teal-800 mb-4">
        Shadcn UI Calendar Test
      </h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
      {date && (
        <p className="mt-4 text-sm text-teal-700">
          Selected date: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
