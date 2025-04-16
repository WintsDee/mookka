
import React from "react";
import { useNavigate } from "react-router-dom";
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
import { HelpFeedback } from "@/components/profile/help-feedback";

export function HelpSection() {
  const navigate = useNavigate();
  
  const openFeedbackDialog = (initialTab: 'help' | 'feedback' = 'feedback') => {
    // Recherche du bouton de dialogue caché dans le DOM
    const trigger = document.querySelector('[data-help-feedback-trigger]') as HTMLButtonElement;
    if (trigger) {
      // Cliquer pour ouvrir le dialogue
      trigger.click();
      
      // Après un court délai, simuler un clic sur l'onglet approprié
      setTimeout(() => {
        const tabButton = document.querySelector(`[data-tab="${initialTab}"]`) as HTMLButtonElement;
        if (tabButton) {
          tabButton.click();
        }
      }, 100);
    }
  };
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        <HelpCircle size={20} className="text-primary" />
        Centre d'aide
      </h2>
      
      <Accordion type="single" collapsible className="w-full">
        {helpSections.map((section, index) => (
          <AccordionItem key={index} value={`section-${index}`} className="border-b border-border/30">
            <AccordionTrigger className="text-base hover:no-underline py-2">
              {section.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 py-2">
                {section.items.map((item, itemIndex) => (
                  <HelpCard 
                    key={itemIndex} 
                    question={item.question} 
                    answer={item.answer} 
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="mt-6">
        <Alert variant="default" className="bg-muted/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Besoin d'aide supplémentaire ?</AlertTitle>
          <AlertDescription>
            Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous contacter.
          </AlertDescription>
        </Alert>
        
        <div className="mt-4 flex flex-col gap-2">
          <Button
            onClick={() => openFeedbackDialog('feedback')}
            variant="outline"
            className="w-full"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Signaler un problème
          </Button>
          
          <Button
            onClick={() => openFeedbackDialog('help')}
            variant="default"
            className="w-full"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Envoyer un feedback
          </Button>
        </div>
      </div>
      
      {/* Composant HelpFeedback placé ici pour le contexte de la page */}
      <HelpFeedback />
    </div>
  );
}
