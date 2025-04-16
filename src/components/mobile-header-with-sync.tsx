
import React from "react";
import { SyncStatus } from "@/components/ui/sync-status";
import { realtimeSync } from "@/services/realtime/realtime-sync";

interface MobileHeaderWithSyncProps {
  title?: string;
  children?: React.ReactNode;
}

export function MobileHeaderWithSync({ title, children }: MobileHeaderWithSyncProps) {
  const syncStatus = realtimeSync.syncStatus;

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-10 border-b">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex-1">
          {title && <h1 className="text-lg font-semibold">{title}</h1>}
        </div>
        
        <div className="flex items-center gap-2">
          <SyncStatus status={syncStatus} />
          {children}
        </div>
      </div>
    </header>
  );
}
