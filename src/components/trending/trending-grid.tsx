
import React from "react";
import { MediaCard } from "@/components/media-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendingGridProps {
  items: any[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const TrendingGrid = ({ items, loading, refreshing, onRefresh }: TrendingGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea 
      className="h-[calc(100vh-250px)]"
      onScrollEndReached={onRefresh}
    >
      <div className="grid grid-cols-2 gap-4 pb-4">
        {items.map((item) => (
          <MediaCard 
            key={`${item.type}-${item.id}`}
            media={item}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
