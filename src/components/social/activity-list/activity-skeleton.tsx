
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const ActivitySkeleton = () => {
  return (
    <Card className="bg-secondary/40 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="w-16 h-24 bg-muted animate-pulse rounded-md" />
          <div className="flex-1">
            <div className="h-4 bg-muted animate-pulse rounded w-2/3 mb-2" />
            <div className="h-3 bg-muted animate-pulse rounded w-full mb-1" />
            <div className="h-3 bg-muted animate-pulse rounded w-4/5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
