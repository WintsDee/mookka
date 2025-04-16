
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Heart } from "lucide-react";

const SupportProject = () => {
  const handleBuyMeACoffee = () => {
    window.open("https://buymeacoffee.com/mookka", "_blank");
  };

  return (
    <Background>
      <MobileHeader title="Soutenir Mookka" />
      <div className="pt-safe pb-24 mt-16 px-6">
        <div className="text-center mb-6">
          <Heart className="inline-block h-16 w-16 text-pink-500 mb-2" />
          <h1 className="text-2xl font-bold">Soutenez Mookka</h1>
        </div>

        <Card className="mb-6 border-purple-200 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Pourquoi Mookka est gratuit</CardTitle>
            <CardDescription>Notre mission et nos valeurs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              Mookka a été créé avec la conviction que chacun devrait avoir accès à un moyen simple 
              et élégant d'organiser sa collection de médias et de partager ses passions.
            </p>
            <p>
              C'est pourquoi nous avons fait le choix de rendre Mookka entièrement gratuit, sans publicités 
              intrusives ni vente de vos données personnelles.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 border-pink-200 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Pourquoi nous soutenir ?</CardTitle>
            <CardDescription>L'impact de votre contribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              Maintenir et améliorer Mookka demande du temps, des ressources et beaucoup de café ! 
              Votre soutien nous permet de :
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Couvrir les frais d'hébergement et de serveurs</li>
              <li>Développer de nouvelles fonctionnalités</li>
              <li>Maintenir l'application à jour</li>
              <li>Garder Mookka gratuit pour tous</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center py-6">
          <Button
            onClick={handleBuyMeACoffee}
            className="px-8 py-6 text-lg bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
          >
            <Coffee className="mr-2 h-5 w-5" />
            Offrir un café
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Chaque contribution, quelle que soit sa taille, fait une grande différence !
          </p>
        </div>
      </div>
      <MobileNav />
    </Background>
  );
};

export default SupportProject;
