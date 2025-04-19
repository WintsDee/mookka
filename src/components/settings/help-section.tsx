
import React from "react";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function HelpSection() {
  const faqItems = [
    {
      question: "Comment ajouter un média à ma bibliothèque ?",
      answer: "Utilisez la barre de recherche pour trouver un film, une série, un livre ou un jeu. Cliquez sur le média souhaité puis sur le bouton d'ajout pour l'ajouter à votre bibliothèque."
    },
    {
      question: "Comment suivre ma progression ?",
      answer: "Dans la page de détail d'un média, rendez-vous dans l'onglet 'Progression'. Vous pourrez y mettre à jour votre avancement, noter les épisodes visionnés, ou indiquer le nombre de pages lues."
    },
    {
      question: "Comment créer une collection ?",
      answer: "Allez dans l'onglet Collections puis cliquez sur le bouton 'Nouvelle collection'. Donnez un nom à votre collection et choisissez sa visibilité (privée ou publique)."
    },
    {
      question: "Comment noter un média ?",
      answer: "Sur la page d'un média, accédez à l'onglet 'Critique' pour attribuer une note et laisser un commentaire sur votre expérience."
    },
    {
      question: "Comment modifier mes paramètres de confidentialité ?",
      answer: "Dans les paramètres, section 'Confidentialité', vous pouvez ajuster qui peut voir votre activité, vos collections et vos avis."
    }
  ];

  return (
    <div>
      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        <HelpCircle size={20} className="text-primary" />
        Foire aux questions
      </h2>
      
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-sm font-medium">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
