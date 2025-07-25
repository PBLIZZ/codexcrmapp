'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@codexcrm/ui';

/**
 * DynamicBreadcrumb - Shows the current page path as breadcrumbs
 */
export function DynamicBreadcrumb() {
  const pathname = usePathname();

  if (!pathname || pathname === '/') {
    return (
      <Breadcrumb className=''>
        <BreadcrumbList className=''>
          <BreadcrumbItem className=''>
            <BreadcrumbPage className=''>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const segments = pathname.split('/').filter(Boolean);

  return (
    <Breadcrumb className=''>
      <BreadcrumbList className=''>
        <BreadcrumbItem className=''>
          <BreadcrumbLink href='/' className='' asChild={false}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;
          let label = segment.charAt(0).toUpperCase() + segment.slice(1);

          // Handle specific route patterns
          if (segment === 'contacts') {
            label = 'Contacts';
          } else if (segment === 'edit') {
            label = 'Edit Contact';
          } else if (segment === 'new') {
            label = 'New Contact';
          } else if (segment.match(/^[a-f0-9-]{36}$/)) {
            // This is a contact UUID - show as "Contact Details"
            label = 'Contact Details';
          }

          return (
            <div key={segment} className='flex items-center'>
              <BreadcrumbSeparator className='' />
              <BreadcrumbItem className=''>
                {isLast ? (
                  <BreadcrumbPage className=''>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} className='' asChild={false}>
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
