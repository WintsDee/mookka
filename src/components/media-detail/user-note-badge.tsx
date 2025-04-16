
import React from "react";
import { StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface UserNoteBadgeProps {
  note: string;
  className?: string;
}

export function UserNoteBadge({ note, className }: UserNoteBadgeProps) {
  if (!note || note.trim().length === 0) return null;
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div 
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 cursor-help", 
            className
          )}
        >
          <StickyNote className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Note personnelle</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <p className="text-sm italic">{note}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
