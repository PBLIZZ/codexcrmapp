'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckSquare, 
  Tag, 
  Clock, 
  Calendar, 
  BarChart3, 
  Filter,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/trpc';

export function TasksSidebar() {
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  
  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = api.tasks.getCategories.useQuery();

  return (
    <div className="w-64 border-r bg-white h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Tasks</h2>
        
        <div className="space-y-1">
          <Link href="/tasks" passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/tasks" && "bg-slate-100"
              )}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              All Tasks
            </Button>
          </Link>
          
          <Link href="/tasks?status=todo" passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/tasks" && new URLSearchParams(window.location.search).get('status') === 'todo' && "bg-slate-100"
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              To Do
            </Button>
          </Link>
          
          <Link href="/tasks?status=in-progress" passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/tasks" && new URLSearchParams(window.location.search).get('status') === 'in-progress' && "bg-slate-100"
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              In Progress
            </Button>
          </Link>
          
          <Link href="/tasks?status=done" passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/tasks" && new URLSearchParams(window.location.search).get('status') === 'done' && "bg-slate-100"
              )}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Done
            </Button>
          </Link>
        </div>
        
        <div className="mt-6">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
          >
            <div className="flex items-center">
              <Tag className="mr-2 h-4 w-4" />
              Categories
            </div>
            {categoriesOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          
          {categoriesOpen && (
            <div className="ml-6 mt-2 space-y-1">
              {categoriesLoading ? (
                <div className="text-sm text-gray-500 py-2">Loading...</div>
              ) : categories.length === 0 ? (
                <div className="text-sm text-gray-500 py-2">No categories found</div>
              ) : (
                categories.map((category) => (
                  <Link key={category} href={`/tasks?category=${encodeURIComponent(category)}`} passHref>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        pathname === "/tasks" && 
                        new URLSearchParams(window.location.search).get('category') === category && 
                        "bg-slate-100"
                      )}
                    >
                      {category}
                    </Button>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6 space-y-1">
          <Link href="/tasks?priority=high" passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/tasks" && new URLSearchParams(window.location.search).get('priority') === 'high' && "bg-slate-100"
              )}
            >
              <Filter className="mr-2 h-4 w-4" />
              High Priority
            </Button>
          </Link>
          
          <Link href="/tasks?due=today" passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/tasks" && new URLSearchParams(window.location.search).get('due') === 'today' && "bg-slate-100"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Due Today
            </Button>
          </Link>
          
          <Link href="/tasks?impact=high" passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === "/tasks" && new URLSearchParams(window.location.search).get('impact') === 'high' && "bg-slate-100"
              )}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              High Impact
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
