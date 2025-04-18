
import React from "react";
import { Loader2 } from "lucide-react";
import { Background } from "@/components/ui/background";
import { MobileHeader } from "@/components/mobile-header";

interface MediaDetailLoadingProps {
  onBackClick: () => void;
}

export function MediaDetailLoading({ onBackClick }: MediaDetailLoadingProps) {
  return (
    <Background>
      <MobileHeader 
        showBackButton={true}
        onBackClick={onBackClick}
      />
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-lg">Chargement en cours...</p>
      </div>
    </Background>
  );
}
