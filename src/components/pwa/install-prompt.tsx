
import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { usePWAStatus } from "@/hooks/use-pwa-status"

export function PWAInstallPrompt() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [showInstructions, setShowInstructions] = React.useState(false)
  const { shouldShowInstallPrompt } = usePWAStatus()
  
  React.useEffect(() => {
    // Show prompt after 3 seconds if needed
    const timer = setTimeout(() => {
      if (shouldShowInstallPrompt) {
        setIsOpen(true)
      }
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [shouldShowInstallPrompt])

  const handleAddClick = () => {
    setShowInstructions(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setShowInstructions(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm rounded-xl p-6">
        {!showInstructions ? (
          // First dialog - Install prompt
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Installez l'app</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <p className="text-lg font-medium text-gray-600">
                Ajoutez cette app à votre écran d'accueil pour un accès rapide et facile
              </p>
              <div className="flex justify-end mt-2">
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleClose}>
                    Plus tard
                  </Button>
                  <Button 
                    onClick={handleAddClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Second dialog - Installation instructions
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Comment installer</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Pour installer l'application :</h3>
                <ul className="list-disc list-inside space-y-2 text 
-gray-600">
                  <li>Sur iOS : Appuyez sur le bouton "Partager" puis "Sur l'écran d'accueil"</li>
                  <li>Sur Android : Appuyez sur les 3 points ⋮ puis "Installer l'application"</li>
                </ul>
              </div>
              <div className="flex justify-end mt-2">
                <Button onClick={handleClose} className="bg-blue-500 hover:bg-blue-600 text-white px-6">
                  Compris
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
