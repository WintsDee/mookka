
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ProfileSkeleton() {
  return (
    <>
      <div className="h-40 bg-gradient-to-r from-blue-600 to-purple-600 relative">
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
          <Skeleton className="w-20 h-20 rounded-full" />
        </div>
      </div>
      
      <div className="mt-12 px-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-7 w-40 mb-1" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        
        <div className="flex items-center gap-6 mt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between text-sm text-center">
          {[...Array(5)].map((_, index) => (
            <div key={index}>
              <Skeleton className="h-5 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
