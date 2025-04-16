
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function NeedMoreHelp() {
  return (
    <div className="pt-2 pb-4">
      <Alert variant="default" className="bg-muted/50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Besoin de plus d'aide ?</AlertTitle>
        <AlertDescription>
          Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous envoyer un message via l'onglet Feedback.
        </AlertDescription>
      </Alert>
    </div>
  );
}
