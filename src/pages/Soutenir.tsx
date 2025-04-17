
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { HandCoins, Heart, Rocket, Gift, Info, ArrowUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Soutenir = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const isMobile = useIsMobile();

  // Track scroll position
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    setShowScrollToTop(scrollTop > 300);
  };

  // Scroll to top function
  const scrollToTop = () => {
    const scrollableDiv = document.querySelector('.scrollable-viewport');
    if (scrollableDiv) {
      (scrollableDiv as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Background>
      <MobileHeader title="Soutenir Mookka" />
      
      <div className="pt-safe pb-20 mt-16 px-4 md:px-6 relative h-[calc(100vh-6rem)] flex flex-col">
        <ScrollArea 
          className="w-full h-full flex-1 overflow-y-auto" 
          onScroll={handleScroll}
          hideScrollbar={false}
        >
          <div className="scrollable-viewport h-full w-full overflow-auto">
            <div className="max-w-3xl mx-auto pb-16 px-1">
              {/* Support button at the top */}
              <div className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur-sm mb-6">
                <a 
                  href="https://buymeacoffee.com/mookka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full transition-all block"
                >
                  <Button 
                    size="lg" 
                    className="w-full gap-2 rounded-full px-6 py-5 sm:px-8 sm:py-6 hover:scale-105 transition-transform text-base sm:text-lg font-medium shadow-lg shadow-primary/20"
                  >
                    <HandCoins size={20} className="sm:size-22" />
                    <span>Soutenir Mookka</span>
                  </Button>
                </a>
              </div>
              
              <div className="flex flex-col gap-6 sm:gap-8 bg-secondary/20 rounded-xl p-4 sm:p-6 border border-border">
                
                {/* Header section */}
                <div className="flex flex-col gap-3 text-center">
                  <div className="flex justify-center">
                    <Heart size={32} className="text-primary animate-pulse sm:size-36" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">Aider Mookka, c'est plus stylé que tu ne le crois.</h2>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Tu adores découvrir de nouveaux films, livres, séries ou jeux ?
                    Tu trouves que Mookka a un petit quelque chose en plus ?
                    Alors pourquoi ne pas filer un petit coup de pouce au projet ? 😄
                  </p>
                </div>
                
                {/* Why support section */}
                <div className="flex flex-col gap-3 sm:gap-4 bg-secondary/10 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Info size={20} className="text-primary shrink-0 sm:size-22" />
                    <h3 className="text-lg sm:text-xl font-semibold">Pourquoi soutenir Mookka ?</h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0 mt-0.5">→</span>
                      <span>Pour garder Mookka libre, fluide et beau.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0 mt-0.5">→</span>
                      <span>Pour qu'on puisse payer les serveurs, les bases de données et les cafés.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0 mt-0.5">→</span>
                      <span>Pour montrer que la culture mérite mieux qu'un tableur Excel.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0 mt-0.5">→</span>
                      <span>Pour débloquer des futures fonctionnalités stylées (statistiques, thèmes, recommandations, etc.).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0 mt-0.5">→</span>
                      <span>Et surtout, parce que tu kiffes l'idée de participer à un projet cool et utile ❤️</span>
                    </li>
                  </ul>
                </div>
                
                {/* What we do with support section */}
                <div className="flex flex-col gap-3 sm:gap-4 bg-secondary/10 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Rocket size={20} className="text-primary shrink-0 sm:size-22" />
                    <h3 className="text-lg sm:text-xl font-semibold">Ce qu'on fait avec ton soutien</h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0 mt-0.5">
                        <Gift size={12} className="sm:size-14" />
                      </span>
                      <span>Ajouter de nouvelles fonctionnalités</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0 mt-0.5">
                        <Rocket size={12} className="sm:size-14" />
                      </span>
                      <span>Payer les serveurs, la base de données et maintenir l'infrastructure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0 mt-0.5">
                        <Heart size={12} className="sm:size-14" />
                      </span>
                      <span>Garder Mookka libre, fluide et beau</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Bottom call to action */}
              <div className="mt-6 sm:mt-8 text-center p-4 sm:p-5 bg-secondary/10 rounded-xl border border-border">
                <p className="text-base sm:text-lg mb-4">
                  Tu veux aider ? Tu peux nous offrir un petit café, un gros cookie ou même une pizza 🍕
                </p>
                <a 
                  href="https://buymeacoffee.com/mookka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button 
                    size="lg" 
                    className="gap-2 rounded-full px-5 py-4 sm:px-6 sm:py-5 hover:scale-105 transition-transform font-medium shadow-lg shadow-primary/20"
                  >
                    <HandCoins size={18} className="sm:size-20" />
                    <span>Soutenir Mookka</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        {showScrollToTop && (
          <button 
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 sm:right-6 bg-primary text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all z-50"
            aria-label="Retour en haut"
          >
            <ArrowUp size={18} className="sm:size-20" />
          </button>
        )}
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Soutenir;
