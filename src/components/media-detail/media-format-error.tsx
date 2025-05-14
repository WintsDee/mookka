
import React from "react";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";
import { Background } from "@/components/ui/background";

interface MediaFormatErrorProps {
  onGoBack: () => void;
}

export function MediaFormatError({ onGoBack }: MediaFormatErrorProps) {
  return (
    <Background>
      <MobileHeader />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Erreur de formatage</h1>
        <p className="text-muted-foreground mb-4">Impossible d'afficher les informations du média.</p>
        <Button onClick={onGoBack}>Retour</Button>
      </div>
    </Background>
  );
}
