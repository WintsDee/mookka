
import React from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelpFeedback } from "@/components/profile/help-feedback";

export function HelpSection() {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        <HelpCircle size={20} className="text-primary" />
        Centre d'aide
      </h2>
      
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground mb-2">
          Vous avez une question ou un problème ? N'hésitez pas à nous contacter via le formulaire ci-dessous.
        </p>
        
        <HelpFeedback
          buttonVariant="default"
          buttonText="Contacter le support"
          buttonIcon={true}
          initialTab="feedback"
        />
      </div>
    </div>
  );
}
