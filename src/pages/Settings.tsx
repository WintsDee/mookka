
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Shield, 
  Lock, 
  LifeBuoy,
  ExternalLink, 
  ChevronRight,
  AlertCircle,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Settings = () => {
  const navigate = useNavigate();
  
  const helpSections = [
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
  
  return (
    <Background>
      <MobileHeader title="Paramètres" />
      <div className="pt-safe pb-24 mt-16">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="px-6 py-4">
            <div className="space-y-6">
              {/* Notifications */}
              <div>
                <h2 className="text-lg font-medium mb-4">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-primary" />
                      <span>Notifications push</span>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-primary" />
                      <span>Emails</span>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Confidentialité */}
              <div>
                <h2 className="text-lg font-medium mb-4">Confidentialité</h2>
                <div className="space-y-4">
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-between px-0 h-auto py-2"
                    onClick={() => {}}
                  >
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-primary" />
                      <span>Confidentialité du compte</span>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-between px-0 h-auto py-2"
                    onClick={() => {}}
                  >
                    <div className="flex items-center gap-3">
                      <Lock size={18} className="text-primary" />
                      <span>Changer le mot de passe</span>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {/* Centre d'aide amélioré */}
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
              
              <Separator />
              
              {/* À propos */}
              <div className="pb-6">
                <h2 className="text-lg font-medium mb-4">À propos</h2>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Version 1.0.0
                  </p>
                  <p className="text-sm text-muted-foreground">
                    © 2024 Mookka. Tous droits réservés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Settings;
