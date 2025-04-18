
import React from "react";
import { ProfessionalReview } from "@/types/book";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface ProfessionalReviewsProps {
  reviews: ProfessionalReview[];
}

export function ProfessionalReviews({ reviews }: ProfessionalReviewsProps) {
  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4 p-1">
        {reviews.map((review, index) => (
          <Card key={index} className="bg-muted/50">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{review.source}</CardTitle>
                  {review.author && (
                    <p className="text-sm text-muted-foreground">
                      Par {review.author}
                    </p>
                  )}
                </div>
                {review.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    <span className="text-sm font-medium">
                      {review.rating}/10
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed mb-2">
                {review.content}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDate(new Date(review.date))}</span>
                {review.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a 
                      href={review.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Lire la critique complète
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
