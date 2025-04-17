
import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { usePWAStatus } from "@/hooks/use-pwa-status"

export function PWAInstallPrompt() {
  const [isOpen, setIsOpen] = React.useState(false)
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Installer Mookka</DialogTitle>
          <DialogDescription>
            Pour une meilleure expérience, installez Mookka sur votre appareil.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Accédez à Mookka directement depuis votre écran d'accueil
            </span>
          </div>
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              Pour installer l'application :
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 ml-2">
              <li>Sur iOS : Appuyez sur "Partager" puis "Sur l'écran d'accueil"</li>
              <li>Sur Android : Appuyez sur les 3 points ⋮ puis "Ajouter à l'écran d'accueil"</li>
            </ul>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Plus tard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
