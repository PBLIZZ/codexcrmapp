"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
  emoji?: string;
  _count?: {
    contacts: number;
  };
}

export function SidebarGroupLink({ group }: { group: Group }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const isActive = params.get("group") === group.id && pathname === "/contacts";

  return (
    <button
      onClick={() => {
        // Replace only the query-string so history back works nicely
        const url = new URL(window.location.href);
        url.searchParams.set("group", group.id);
        router.push(url.pathname + url.search);
      }}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted w-full text-left",      
        isActive && "bg-purple-100 text-purple-700 font-medium",
      )}
    >
      {group.emoji && <span className="mr-1">{group.emoji}</span>}
      <span className="truncate">{group.name}</span>
      {group._count && (
        <span className="ml-auto text-xs opacity-70">{group._count.contacts}</span>
      )}
    </button>
  );
}
