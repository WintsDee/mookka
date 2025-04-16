
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { HelpSection } from "./help-section";
import { FeedbackForm } from "./feedback-form";
import { useIsMobile } from "@/hooks/use-mobile";

export function FeedbackModule() {
  const isMobile = useIsMobile();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-2 text-sm hover:bg-muted w-full justify-center sm:w-auto"
        >
          <HelpCircle size={isMobile ? 16 : 18} />
          <span>Aide & Feedback</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Aide & Feedback</SheetTitle>
          <SheetDescription>
            Consultez l'aide ou envoyez-nous vos commentaires pour améliorer l'application
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <HelpSection />
          <FeedbackForm />
        </div>
      </SheetContent>
    </Sheet>
  );
}
