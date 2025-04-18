
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaRecommendationsSkeletonProps {
  title?: string;
  count?: number;
}

export const MediaRecommendationsSkeleton = ({ 
  title = "Chargement...", 
  count = 5 
}: MediaRecommendationsSkeletonProps) => {
  return (
    <section className="my-6 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium">{title}</h2>
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-40 h-60 flex-shrink-0">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        ))}
      </div>
    </section>
  );
};
