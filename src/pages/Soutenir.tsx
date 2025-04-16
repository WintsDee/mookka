
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { Coffee, Heart } from "lucide-react";

const Soutenir = () => {
  return (
    <Background>
      <MobileHeader title="Soutenir Mookka" />
      
      <div className="pt-safe pb-24 mt-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-6 bg-secondary/20 rounded-xl p-6 border border-border">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Pourquoi Mookka est gratuit</h2>
              <p className="text-muted-foreground">
                Mookka est le fruit d'une passion pour les médias culturels, conçu pour
                offrir une expérience unifiée de suivi pour tous vos films, séries, livres et jeux.
                Nous croyons que l'accès à un tel outil devrait être disponible pour tous, c'est
                pourquoi l'application est et restera gratuite.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Pourquoi soutenir le projet</h2>
              <p className="text-muted-foreground">
                Le développement et la maintenance de Mookka demandent du temps, des ressources
                et de l'énergie. Votre soutien nous permet de :
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-1">
                <li>Maintenir l'infrastructure serveur</li>
                <li>Continuer à développer de nouvelles fonctionnalités</li>
                <li>Améliorer l'expérience utilisateur</li>
                <li>Garder l'application sans publicité</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Comment soutenir Mookka</h2>
              <p className="text-muted-foreground">
                Si vous appréciez Mookka et souhaitez contribuer à son développement, 
                vous pouvez nous soutenir en nous offrant un café. Chaque contribution,
                quelle que soit sa taille, fait une réelle différence !
              </p>
              
              <div className="flex justify-center mt-4">
                <a 
                  href="https://buymeacoffee.com/mookka"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg" 
                    className="gap-2 rounded-full px-8 hover:scale-105 transition-transform"
                  >
                    <Coffee size={20} />
                    <span>M'offrir un café</span>
                  </Button>
                </a>
              </div>
              
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2 text-center text-muted-foreground">
                  <Heart size={16} className="text-primary" />
                  <span>Merci pour votre soutien !</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Soutenir;
