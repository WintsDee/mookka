
import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription, 
  SheetFooter 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, Share2, Plus, Menu } from "lucide-react";

interface InstallInstructionsProps {
  browserType: string;
  isOpen: boolean;
  onClose: () => void;
}

export const InstallInstructions: React.FC<InstallInstructionsProps> = ({
  browserType,
  isOpen,
  onClose
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto pb-20">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Download size={18} /> Comment installer Mookka
          </SheetTitle>
          <SheetDescription>
            Suivez ces étapes pour installer l'application sur votre écran d'accueil
          </SheetDescription>
        </SheetHeader>

        {browserType === "safari" && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Share2 size={16} /> Étape 1: Appuyez sur le bouton Partager
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Appuyez sur l'icône de partage en bas de votre navigateur Safari.
              </p>
              <div className="bg-muted rounded-md p-3 flex justify-center">
                <img 
                  src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
                  alt="Safari share button" 
                  className="max-h-32 rounded-md opacity-90"
                />
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Plus size={16} /> Étape 2: Sur l'écran d'accueil
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Faites défiler le menu et appuyez sur "Sur l'écran d'accueil".
              </p>
              <div className="bg-muted rounded-md p-3 flex justify-center">
                <img 
                  src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
                  alt="Add to home screen option" 
                  className="max-h-32 rounded-md opacity-90"
                />
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Étape 3: Confirmer</h3>
              <p className="text-sm text-muted-foreground">
                Appuyez sur "Ajouter" dans le coin supérieur droit pour finaliser l'installation.
              </p>
            </div>
          </div>
        )}

        {browserType === "chrome" && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Menu size={16} /> Étape 1: Menu
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Appuyez sur les trois points verticaux en haut à droite de Chrome.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Plus size={16} /> Étape 2: Installer l'application
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Appuyez sur "Installer l'application" ou "Ajouter à l'écran d'accueil".
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Étape 3: Confirmer</h3>
              <p className="text-sm text-muted-foreground">
                Appuyez sur "Installer" pour confirmer l'installation.
              </p>
            </div>
          </div>
        )}

        {(browserType === "firefox" || browserType === "samsung" || browserType === "opera" || browserType === "other") && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Menu size={16} /> Étape 1: Menu
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Appuyez sur le menu de votre navigateur (généralement trois points ou lignes).
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Plus size={16} /> Étape 2: Installer
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Recherchez l'option "Installer l'application" ou "Ajouter à l'écran d'accueil".
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Étape 3: Confirmer</h3>
              <p className="text-sm text-muted-foreground">
                Suivez les instructions à l'écran pour terminer l'installation.
              </p>
            </div>
          </div>
        )}

        <SheetFooter className="mt-6">
          <Button onClick={onClose} className="w-full">J'ai compris</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
