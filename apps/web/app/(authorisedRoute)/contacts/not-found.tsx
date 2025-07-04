import Link from 'next/link';
import { Button } from '@codexcrm/ui/components/ui/button';
import { FileX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='flex min-h-[400px] flex-col items-center justify-center space-y-4 p-6'>
      <div className='flex items-center space-x-2 text-muted-foreground'>
        <FileX className='h-8 w-8' />
        <h2 className='text-xl font-semibold'>Not Found</h2>
      </div>
      <p className='text-sm text-muted-foreground text-center max-w-md'>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild>
        <Link href='/'>Return Home</Link>
      </Button>
    </div>
  );
}
