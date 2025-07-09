'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { generateBreadcrumbs } from '@/lib/breadcrumb-config';

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  // Always show at least the home breadcrumb
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = item.icon;

          return (
            <div key={item.href} className="flex items-center">
              <BreadcrumbItem className={index === 0 ? 'hidden md:flex' : ''}>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={{ pathname: item.href }} className="flex items-center gap-1">
                      {Icon && <Icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className={index === 0 ? 'hidden md:block' : ''} />
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}