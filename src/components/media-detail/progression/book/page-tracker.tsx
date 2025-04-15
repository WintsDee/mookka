
import React from "react";
import { BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface PageTrackerProps {
  currentPage: number;
  totalPages: number;
  onCurrentPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCurrentPageBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function PageTracker({ 
  currentPage, 
  totalPages, 
  onCurrentPageChange, 
  onCurrentPageBlur 
}: PageTrackerProps) {
  const progressPercentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4 space-y-4">
      <div className="flex items-center mb-4">
        <BookOpen className="h-5 w-5 mr-2 text-primary" />
        <span className="font-medium">Progression de lecture</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="current-page" className="block text-sm text-muted-foreground mb-1">
            Page actuelle
          </label>
          <Input
            id="current-page"
            type="number"
            min={0}
            max={totalPages}
            value={currentPage}
            onChange={onCurrentPageChange}
            onBlur={onCurrentPageBlur}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="total-pages" className="block text-sm text-muted-foreground mb-1">
            Nombre total de pages
          </label>
          <Input
            id="total-pages"
            type="number"
            min={1}
            value={totalPages}
            readOnly
            className="w-full bg-muted/50 cursor-not-allowed"
          />
        </div>
      </div>
      
      <div className="pt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-muted-foreground">Progression de lecture</span>
          <span className="text-sm font-medium">
            {progressPercentage}%
          </span>
        </div>
        
        <Progress 
          value={progressPercentage} 
          className="h-2 bg-secondary/30"
        />
        
        <p className="mt-2 text-sm text-muted-foreground">
          {currentPage} sur {totalPages} pages lues
        </p>
      </div>
    </div>
  );
}
