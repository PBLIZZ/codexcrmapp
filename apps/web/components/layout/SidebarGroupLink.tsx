"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
  emoji?: string;
  color?: string; // Add color if you use it from groupRouter.list
  contactCount?: number; // <<<< CHANGE THIS: Expect 'contactCount'
}

export function SidebarGroupLink({ group }: { group: Group }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const isActive = params.get("group") === group.id && pathname === "/contacts";

  return (
    <button
      // ... (button props) ...
    >
      {group.emoji && <span className="text-sm">{group.emoji}</span>}
      <span className="pl-2 py-1 text-sm text-teal-600 font-medium truncate">{group.name}</span>
      {/* VVVV CHANGE THIS VVVV */}
      {typeof group.contactCount === 'number' && (
        <span className="ml-1 px-2 py-0.5 rounded-full-2 bg-teal-100 text-teal-600 text-xs font-medium">
          {group.contactCount}
        </span>
      )}
      {/* ^^^^ CHANGE THIS ^^^^ */}
    </button>
  );
}
