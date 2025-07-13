'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ColoredSidebarWrapperProps {
  children: ReactNode;
}

// Color mapping for each section
const getSectionColor = (pathname: string) => {
  if (pathname.startsWith('/dashboard') || pathname === '/') {
    return 'teal';
  }
  if (pathname.startsWith('/contacts')) {
    return 'rose';
  }
  if (pathname.startsWith('/tasks')) {
    return 'yellow';
  }
  if (pathname.startsWith('/calendar')) {
    return 'indigo';
  }
  if (pathname.startsWith('/messages')) {
    return 'sky';
  }
  if (pathname.startsWith('/marketing')) {
    return 'orange';
  }
  if (pathname.startsWith('/analytics')) {
    return 'violet';
  }
  return 'teal'; // default
};

// Generate color classes for subtle sidebar accents
const getColorClasses = (color: string) => {
  const colorMap = {
    teal: {
      border: 'border-l-teal-400/80 dark:border-l-teal-400',
      gradient: 'bg-gradient-to-r from-teal-50/80 to-transparent dark:from-teal-950/60',
      accent: 'before:bg-teal-400/20 dark:before:bg-teal-400/30',
    },
    rose: {
      border: 'border-l-rose-400/80 dark:border-l-rose-400',
      gradient: 'bg-gradient-to-r from-rose-50/80 to-transparent dark:from-rose-950/60',
      accent: 'before:bg-rose-400/20 dark:before:bg-rose-400/30',
    },
    yellow: {
      border: 'border-l-yellow-400/80 dark:border-l-yellow-400',
      gradient: 'bg-gradient-to-r from-yellow-50/80 to-transparent dark:from-yellow-950/60',
      accent: 'before:bg-yellow-400/20 dark:before:bg-yellow-400/30',
    },
    indigo: {
      border: 'border-l-indigo-400/80 dark:border-l-indigo-400',
      gradient: 'bg-gradient-to-r from-indigo-50/80 to-transparent dark:from-indigo-950/60',
      accent: 'before:bg-indigo-400/20 dark:before:bg-indigo-400/30',
    },
    sky: {
      border: 'border-l-sky-400/80 dark:border-l-sky-400',
      gradient: 'bg-gradient-to-r from-sky-50/80 to-transparent dark:from-sky-950/60',
      accent: 'before:bg-sky-400/20 dark:before:bg-sky-400/30',
    },
    orange: {
      border: 'border-l-orange-400/80 dark:border-l-orange-400',
      gradient: 'bg-gradient-to-r from-orange-50/80 to-transparent dark:from-orange-950/60',
      accent: 'before:bg-orange-400/20 dark:before:bg-orange-400/30',
    },
    violet: {
      border: 'border-l-violet-400/80 dark:border-l-violet-400',
      gradient: 'bg-gradient-to-r from-violet-50/80 to-transparent dark:from-violet-950/60',
      accent: 'before:bg-violet-400/20 dark:before:bg-violet-400/30',
    },
  };

  return colorMap[color as keyof typeof colorMap] || colorMap.teal;
};

export function ColoredSidebarWrapper({ children }: ColoredSidebarWrapperProps) {
  const pathname = usePathname();
  const sectionColor = getSectionColor(pathname);
  const colorClasses = getColorClasses(sectionColor);

  return (
    <div
      className={`
        colored-sidebar-wrapper relative h-full w-full
        ${colorClasses.gradient}
        ${colorClasses.border}
        border-l-4
        before:absolute before:inset-0 before:pointer-events-none
        ${colorClasses.accent}
        before:opacity-60
        transition-all duration-300 ease-in-out
      `}
    >
      {children}
    </div>
  );
}
