
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MediaDetailSkeleton() {
  return (
    <div className="animate-fade-in space-y-4 w-full">
      {/* Header skeleton */}
      <div className="relative h-52 w-full">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-0 left-0 p-6 w-full flex items-end">
          <Skeleton className="w-24 h-36 rounded-lg" />
          <div className="flex-1 ml-4 space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <div className="flex gap-1.5 flex-wrap pt-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-14" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs skeleton */}
      <div className="flex gap-2 mb-4 px-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
      
      {/* Content skeleton */}
      <div className="px-4 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </div>
  );
}
