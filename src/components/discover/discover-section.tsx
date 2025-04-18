
import React from "react";
import { MediaCard } from "@/components/media-card";
import { DiscoverySection } from "@/services/media/discovery-service";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DiscoverSectionProps {
  section: DiscoverySection;
  loading?: boolean;
}

export function DiscoverSection({ section, loading = false }: DiscoverSectionProps) {
  if (loading) {
    return <DiscoverSectionSkeleton />;
  }
  
  return (
    <section className="my-6 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium">{section.title}</h2>
        <Button variant="ghost" size="sm" className="flex items-center text-xs">
          Voir plus <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4 min-w-full">
          {section.items.map((item) => (
            <div key={item.id} className="flex-shrink-0">
              <MediaCard 
                key={item.id} 
                media={item} 
                size="medium" 
                from="discover"
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}

function DiscoverSectionSkeleton() {
  return (
    <section className="my-6">
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <Skeleton className="h-44 w-32 rounded-md" />
              <Skeleton className="h-4 w-28 mt-2" />
              <Skeleton className="h-3 w-20 mt-1" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
