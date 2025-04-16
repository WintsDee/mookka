
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
          className="flex items-center justify-center hover:bg-muted w-full sm:w-auto"
        >
          <HelpCircle size={isMobile ? 16 : 18} />
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

