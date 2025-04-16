
import React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface FeedbackSuccessProps {
  onReset: () => void;
}

export function FeedbackSuccess({ onReset }: FeedbackSuccessProps) {
  return (
    <div className="py-8 text-center space-y-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <Send className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-lg font-medium">Merci pour votre feedback !</h3>
      <p className="text-sm text-muted-foreground">
        Votre message a bien été envoyé. Nous l'examinerons rapidement.
      </p>
      <Button onClick={onReset} className="mt-4">
        Envoyer un autre feedback
      </Button>
    </div>
  );
}
