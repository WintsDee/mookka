
import React from "react";
import MainContent from "@/components/home/MainContent";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-auto">
      <div className="absolute inset-0 z-0">
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
      <MainContent />
    </div>
  );
};

export default Index;
