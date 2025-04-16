
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

export function FeedbackModule() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 text-sm hover:bg-muted"
        >
          <HelpCircle size={16} />
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
