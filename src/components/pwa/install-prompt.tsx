
import React, { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { InstallInstructions } from "./install-instructions";
import { usePwaInstall } from "@/hooks/use-pwa-install";

export const PwaInstallPrompt: React.FC = () => {
  const { 
    showInstallPrompt, 
    canInstallDirectly, 
    browserType, 
    installApp, 
    hideInstallPrompt,
    isMobile
  } = usePwaInstall();
  
  const [showInstructions, setShowInstructions] = useState(false);

  // Ne pas afficher sur desktop
  if (!isMobile) return null;

  const handleInstallClick = async () => {
    if (canInstallDirectly) {
      const installed = await installApp();
      if (!installed) {
        // Si l'installation directe échoue, montrer les instructions
        setShowInstructions(true);
      }
    } else {
      // Si l'installation directe n'est pas possible, montrer les instructions
      setShowInstructions(true);
    }
  };

  return (
    <>
      <AlertDialog open={showInstallPrompt} onOpenChange={hideInstallPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Download size={18} className="text-primary" /> 
              Installez Mookka
            </AlertDialogTitle>
            <AlertDialogDescription>
              Installez cette application sur votre écran d'accueil pour y accéder rapidement et profiter d'une meilleure expérience.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Plus tard</AlertDialogCancel>
            <AlertDialogAction onClick={handleInstallClick}>
              Installer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <InstallInstructions
        browserType={browserType}
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
    </>
  );
};
