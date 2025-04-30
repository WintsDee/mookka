
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SuccessStateProps {
  mediaTitle: string;
  isComplete: boolean;
  showSuccessAnimation: boolean;
  onViewLibrary: () => void;
}

export function SuccessState({ mediaTitle, isComplete, showSuccessAnimation, onViewLibrary }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className={`rounded-full bg-primary/10 p-3 mb-4 ${showSuccessAnimation ? 'animate-scale-in' : ''}`}>
        <Check className="h-8 w-8 text-primary" />
      </div>
      <h3 className={`text-lg font-medium mb-2 ${showSuccessAnimation ? 'animate-fade-in' : ''}`}>
        Média ajouté avec succès
      </h3>
      <p className={`text-muted-foreground mb-6 ${showSuccessAnimation ? 'animate-fade-in' : ''}`}>
        "{mediaTitle}" a été ajouté à votre bibliothèque.
      </p>
      {isComplete && (
        <div className={showSuccessAnimation ? 'animate-fade-in' : ''}>
          <Button onClick={onViewLibrary}>
            Voir ma bibliothèque
          </Button>
        </div>
      )}
    </div>
  );
}
