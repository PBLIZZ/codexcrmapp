export const metadata = {
  title: 'Marketing | CodexCRM',
  description: 'Create and manage marketing campaigns, content, and lead generation.',
  keywords: ['marketing', 'campaigns', 'lead generation', 'content'],
};

import { Sparkles } from 'lucide-react';
import { MarketingWidgets } from './_components/MarketingWidgets';

/**
 * Marketing Hub section showcasing marketing tools for wellness practitioners.
 *
 * This Server Component displays a collection of marketing widgets that help
 * practitioners grow their business and connect with clients.
 */
export default function MarketingPage() {
  return (
    <div className='flex flex-col h-full'>
      <main className='flex-1 overflow-y-auto p-4 md:p-6'>
        <div className='mb-6 text-center'>
          <h1 className='flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-primary'>
            <Sparkles className='h-6 w-6' />
            <span>Marketing Hub</span>
          </h1>
          <p className='text-muted-foreground mt-2 max-w-2xl mx-auto'>
            Tools to help you share your authentic gifts with the world, nurture your community, and
            grow your practice with intention and heart.
          </p>
        </div>

        <MarketingWidgets />
      </main>
    </div>
  );
}
