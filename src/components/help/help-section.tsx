
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export function HelpSection() {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Besoin d'aide ?</h3>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Comment ajouter un média à ma bibliothèque ?</AccordionTrigger>
          <AccordionContent>
            Pour ajouter un média à votre bibliothèque, recherchez-le via la barre de recherche, 
            puis cliquez sur sa fiche et utilisez le bouton "Ajouter à ma bibliothèque". 
            Vous pouvez également le faire directement depuis les résultats de recherche.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Comment créer une collection personnalisée ?</AccordionTrigger>
          <AccordionContent>
            Rendez-vous dans la section Collections depuis le menu principal, puis utilisez le 
            bouton "Créer une collection". Donnez un nom à votre collection, choisissez sa 
            visibilité et ajoutez-y des médias depuis votre bibliothèque.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Comment suivre ma progression sur un média ?</AccordionTrigger>
          <AccordionContent>
            Depuis la fiche d'un média dans votre bibliothèque, accédez à l'onglet "Progression" 
            pour mettre à jour votre avancement. Chaque type de média dispose d'options spécifiques 
            (pages lues, épisodes visionnés, heures de jeu, etc.).
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Comment partager mon activité avec mes amis ?</AccordionTrigger>
          <AccordionContent>
            Dans votre profil, accédez aux paramètres de partage social pour choisir quelles 
            informations vous souhaitez partager (notations, critiques, collections, etc.).
            Vous pouvez ensuite suivre vos amis depuis l'onglet Social pour voir leur activité.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Separator className="my-6" />
    </div>
  );
}
