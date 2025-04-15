
import React from "react";
import { Background } from "@/components/ui/background";
import MainContent from "@/components/home/MainContent";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fond d'écran */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
          alt="Mookka Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Légère atténuation pour la lisibilité */}
      </div>
      
      {/* Contenu principal */}
      <MainContent />
    </div>
  );
};

export default Index;
