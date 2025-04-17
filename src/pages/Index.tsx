
import React, { useEffect, useState } from "react";
import MainContent from "@/components/home/MainContent";

const Index = () => {
  const [bgLoaded, setBgLoaded] = useState(false);
  
  useEffect(() => {
    // Précharger l'image de fond de manière prioritaire
    const bgImg = new Image();
    bgImg.src = "/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png";
    bgImg.onload = () => setBgLoaded(true);
    
    // Vérifier si l'image est déjà dans le cache
    if (bgImg.complete) {
      setBgLoaded(true);
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-auto">
      <div className="absolute inset-0 z-0">
        {/* Background image - invisble as it's preloaded in CSS */}
        <div 
          className={`w-full h-full fixed ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: "url('/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        
        {/* Réduire l'opacité du fond sombre */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Contenu principal avec gestion des safe areas */}
      <div className="relative z-10 pt-safe pb-safe px-safe">
        <MainContent />
      </div>
    </div>
  );
};

export default Index;
