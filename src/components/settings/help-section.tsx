
import React from "react";
import { HelpCircle, AlertCircle, MessageSquare } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { helpSections } from "./data/help-section-data";
import { HelpCard } from "@/components/ui/help-card";
import { getMostPopularHelpItems } from "@/components/profile/help-feedback/data/help-items-data";

export function HelpSection() {
  const openFeedbackDialog = (initialTab: 'help' | 'feedback' = 'feedback') => {
    if (typeof window.openHelpFeedbackDialog === 'function') {
      window.openHelpFeedbackDialog(initialTab);
    }
  };
  
  const popularHelpItems = getMostPopularHelpItems(3);
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        <HelpCircle size={20} className="text-primary" />
        Centre d'aide
      </h2>
      
      <div className="space-y-4 mb-6">
        {popularHelpItems.map((item, index) => (
          <HelpCard 
            key={index}
            question={item.title}
            answer={item.content}
          />
        ))}
      </div>
      
      <Alert variant="default" className="bg-muted/50 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Besoin d'aide supplémentaire ?</AlertTitle>
        <AlertDescription>
          Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous contacter.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => openFeedbackDialog('help')}
          variant="outline"
          className="w-full"
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Besoin d'aide supplémentaire ?
        </Button>
        
        <Button
          onClick={() => openFeedbackDialog('feedback')}
          variant="default"
          className="w-full"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Signaler un problème
        </Button>
      </div>
    </div>
  );
}
