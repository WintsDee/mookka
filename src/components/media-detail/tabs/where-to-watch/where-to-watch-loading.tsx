
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WhereToWatchLoading() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Où voir ou acheter ce média ?</h2>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-9 w-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
