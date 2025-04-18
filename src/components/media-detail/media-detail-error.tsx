
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";

interface MediaDetailErrorProps {
  onBackClick: () => void;
}

export function MediaDetailError({ onBackClick }: MediaDetailErrorProps) {
  return (
    <Background>
      <MobileHeader 
        showBackButton={true}
        onBackClick={onBackClick}
      />
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Média non trouvé</h1>
        <p className="text-muted-foreground mb-6 text-center px-4">
          Impossible de charger les détails de ce média. Il pourrait ne plus être disponible ou avoir été déplacé.
        </p>
        <Button onClick={onBackClick}>Retour</Button>
      </div>
    </Background>
  );
}
