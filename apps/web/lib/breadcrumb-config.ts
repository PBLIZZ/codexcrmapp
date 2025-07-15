import { Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface RouteConfig {
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  parent?: string;
}

export const routeConfig: Record<string, RouteConfig> = {
  '/': {
    label: 'Dashboard',
    icon: Home,
  },
  '/dashboard': {
    label: 'Dashboard',
    icon: Home,
  },
  '/contacts': {
    label: 'Contacts',
    parent: '/',
  },
  '/contacts/new': {
    label: 'New Contact',
    parent: '/contacts',
  },
  '/contacts/import': {
    label: 'Import',
    parent: '/contacts',
  },
  '/contacts/import/csv-upload-test': {
    label: 'CSV Upload Test',
    parent: '/contacts/import',
  },
  '/contacts/groups': {
    label: 'Groups',
    parent: '/contacts',
  },
  '/contacts/groups/create': {
    label: 'Create',
    parent: '/contacts/groups',
  },
  '/tasks': {
    label: 'Tasks',
    parent: '/',
  },
  '/marketing': {
    label: 'Marketing',
    parent: '/',
  },
  '/analytics': {
    label: 'Analytics',
    parent: '/',
  },
  '/calendar': {
    label: 'Calendar',
    parent: '/',
  },
  '/messages': {
    label: 'Messages',
    parent: '/',
  },
};

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = pathname;

  // Handle dynamic routes by finding the closest match
  if (!routeConfig[currentPath]) {
    // Check for dynamic route patterns
    const segments = currentPath.split('/').filter(Boolean);
    let testPath = '';

    for (let i = 0; i < segments.length; i++) {
      testPath += '/' + segments[i];
      if (routeConfig[testPath]) {
        currentPath = testPath;
        break;
      }

      // Check for dynamic segment patterns
      const possiblePaths = Object.keys(routeConfig).filter((path) => {
        const pathSegments = path.split('/').filter(Boolean);
        if (pathSegments.length !== segments.length) return false;

        return pathSegments.every((segment, index) => {
          return segment === segments[index] || segment.startsWith('[');
        });
      });

      if (possiblePaths.length > 0) {
        currentPath = possiblePaths[0];
        break;
      }
    }
  }

  // Build breadcrumb chain by traversing parents
  while (currentPath && routeConfig[currentPath]) {
    const config = routeConfig[currentPath];
    breadcrumbs.unshift({
      label: config.label,
      href: currentPath,
      icon: config.icon,
    });

    currentPath = config.parent || '';
  }

  return breadcrumbs;
}
