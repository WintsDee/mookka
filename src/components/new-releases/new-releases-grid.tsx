
import React, { useRef, useEffect } from "react";
import { MediaCard } from "@/components/media-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface NewReleasesGridProps {
  items: any[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const NewReleasesGrid = ({ items, loading, refreshing, onRefresh }: NewReleasesGridProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Setup scroll detection for infinite loading
  useEffect(() => {
    if (!scrollRef.current || !onRefresh) return;
    
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
      
      if (isNearBottom && !refreshing) {
        onRefresh();
      }
    };
    
    const currentRef = scrollRef.current;
    currentRef.addEventListener('scroll', handleScroll);
    
    return () => {
      currentRef.removeEventListener('scroll', handleScroll);
    };
  }, [onRefresh, refreshing]);

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
      ref={scrollRef}
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
