
import React from "react";
import MainContent from "@/components/home/MainContent";
import { MobileNav } from "@/components/mobile-nav";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0 pt-16 pb-16">
        {/* Précharger l'image en utilisant des attributs d'optimisation modernes */}
        <img 
          src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
          alt="Mookka Background" 
          className="w-full h-full object-cover fixed"
          loading="eager" 
          fetchPriority="high" 
          decoding="async"
        />
        {/* Réduire l'opacité du fond sombre */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Contenu principal */}
      <div className="relative z-10 pt-16 pb-16 min-h-screen overflow-auto scrollbar-hide">
        <MainContent />
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Index;
