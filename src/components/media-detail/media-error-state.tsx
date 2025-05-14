
import React from "react";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";
import { Background } from "@/components/ui/background";

interface MediaErrorStateProps {
  error: string | null;
  onGoBack: () => void;
}

export function MediaErrorState({ error, onGoBack }: MediaErrorStateProps) {
  return (
    <Background>
      <MobileHeader />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Média non trouvé</h1>
        <p className="text-muted-foreground mb-4">{error || "Les détails de ce média ne sont pas disponibles."}</p>
        <Button onClick={onGoBack}>Retour</Button>
      </div>
    </Background>
  );
}
