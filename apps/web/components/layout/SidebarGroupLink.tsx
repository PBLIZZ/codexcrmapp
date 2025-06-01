"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
  emoji?: string;
  color?: string; // Add color if you use it from groupRouter.list
  contactCount?: number; 
}

export function SidebarGroupLink({ group }: { group: Group }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const isActive = params.get("group") === group.id && pathname === "/contacts";

  return (
    <button
      onClick={() => router.push(`/contacts?group=${group.id}`)}
      className={cn(
        "flex items-center justify-between ml-2 px-3 py-2 rounded-md cursor-pointer text-sm w-full text-left",
        isActive 
          ? "bg-primary/10 text-primary font-medium" 
          : "hover:bg-muted text-muted-foreground"
      )}
    >
      <div className="flex items-center">
        {group.emoji && <span className="text-sm mr-2">{group.emoji}</span>}
        <span className="text-sm font-medium truncate">{group.name}</span>
      </div>
      {typeof group.contactCount === 'number' && (
        <span className="ml-auto px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
          {group.contactCount}
        </span>
      )}
    </button>
  );
}
