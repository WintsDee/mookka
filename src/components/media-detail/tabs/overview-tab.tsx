
import React, { useState } from "react";
import { MediaAdditionalInfo } from "@/components/media-additional-info";
import { MediaType } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OverviewTabProps {
  description?: string;
  additionalInfo: any;
  mediaId: string;
  mediaType: MediaType;
}

export function OverviewTab({ description, additionalInfo, mediaId, mediaType }: OverviewTabProps) {
  // Sanitize description by removing HTML tags
  const sanitizedDescription = description ? 
    description.replace(/<\/?[^>]+(>|$)/g, "") : '';
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if description is long enough to need collapsing
  const needsCollapsing = sanitizedDescription.length > 200;
  
  return (
    <div className="space-y-6 pb-8">
      {sanitizedDescription && (
        <div>
          <h2 className="text-lg font-medium mb-2">Synopsis</h2>
          {needsCollapsing ? (
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
              <div className="text-sm text-muted-foreground whitespace-pre-line">
                {isOpen 
                  ? sanitizedDescription 
                  : sanitizedDescription.substring(0, 200) + "..."}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full flex items-center justify-center border-t border-border pt-2">
                  {isOpen ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" /> Voir moins
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" /> Voir plus
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* This is intentionally left empty as we're manually handling the content display */}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {sanitizedDescription}
            </p>
          )}
        </div>
      )}
      
      <div>
        <h2 className="text-lg font-medium mb-2">Informations</h2>
        <MediaAdditionalInfo {...additionalInfo} />
      </div>
    </div>
  );
}
