
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

interface HelpItem {
  question: string;
  answer: string;
}

interface HelpSection {
  title: string;
  items: HelpItem[];
}

const helpSections: HelpSection[] = [
  {
    title: "Utilisation de l'application",
    items: [
      { 
        question: "Comment ajouter un média ?", 
        answer: "Utilisez la recherche pour trouver un média, puis cliquez sur l'icône + pour l'ajouter à votre bibliothèque." 
      },
      { 
        question: "Comment suivre ma progression ?", 
        answer: "Dans la page de détail d'un média, allez dans l'onglet 'Progression' pour mettre à jour votre avancement." 
      },
      { 
        question: "Comment noter un média ?", 
        answer: "Dans la page de détail d'un média, allez dans l'onglet 'Critique' pour ajouter votre note et vos commentaires." 
      }
    ]
  },
  {
    title: "Collections",
    items: [
      { 
        question: "Comment créer une collection ?", 
        answer: "Allez dans l'onglet Collections et cliquez sur 'Nouvelle collection' pour créer une liste personnalisée." 
      },
      { 
        question: "Comment ajouter un média à une collection ?", 
        answer: "Sur la page d'un média, cliquez sur le bouton 'Ajouter à une collection' et sélectionnez la collection désirée." 
      },
      { 
        question: "Puis-je partager mes collections ?", 
        answer: "Oui, vous pouvez rendre vos collections publiques en modifiant leurs paramètres de visibilité." 
      }
    ]
  },
  {
    title: "Social",
    items: [
      { 
        question: "Comment suivre d'autres utilisateurs ?", 
        answer: "Recherchez des utilisateurs dans l'onglet Social et cliquez sur 'Suivre' pour voir leur activité." 
      },
      { 
        question: "Comment voir l'activité de mes amis ?", 
        answer: "L'activité de vos amis apparaît dans votre fil d'actualités sur la page principale." 
      }
    ]
  },
  {
    title: "Compte et sécurité",
    items: [
      { 
        question: "Comment modifier mon profil ?", 
        answer: "Sur votre page de profil, cliquez sur le bouton 'Modifier le profil' pour changer vos informations." 
      },
      { 
        question: "Comment changer mon mot de passe ?", 
        answer: "Dans les paramètres, allez dans la section 'Confidentialité' et cliquez sur 'Changer le mot de passe'." 
      }
    ]
  }
];

export function HelpSection() {
  const navigate = useNavigate();
  
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
                  <div key={itemIndex} className="rounded-lg border p-3">
                    <h3 className="font-medium">{item.question}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                  </div>
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
        
        <Button 
          variant="outline" 
          className="w-full mt-4 flex items-center gap-2 justify-center"
          onClick={() => navigate("/profil")}
        >
          <MessageSquare size={16} />
          <span>Signaler un problème</span>
        </Button>
      </div>
    </div>
  );
}
