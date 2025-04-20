
import React from "react";
import { cn } from "@/lib/utils";

/**
 * MediaBar acts as the fixed bottom bar for detailed media actions.
 * It adds more visual emphasis to the bar.
 */
export function MediaBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 flex justify-between items-center py-5 px-5 mx-2 mb-5 rounded-2xl",
        // Enhanced visibility
        "bg-primary/95 shadow-[0_6px_40px_6px_rgba(0,0,0,0.18)] border-2 border-primary/70 backdrop-blur-md",
        "pb-safe-area"
      )}
      style={{
        boxShadow: "0 0 24px 3px rgba(0,0,0,0.14), 0 4px 8px 0 rgba(22,41,80,0.08)",
      }}
    >
      {children}
    </div>
  );
}
