
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Moon, 
  Shield, 
  Lock, 
  LifeBuoy,
  ExternalLink, 
  ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  
  return (
    <Background>
      <MobileHeader title="Paramètres" />
      <div className="pt-safe pb-24 mt-16">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="px-6 py-4">
            <div className="space-y-6">
              {/* Notifications */}
              <div>
                <h2 className="text-lg font-medium mb-4">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-primary" />
                      <span>Notifications push</span>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-primary" />
                      <span>Emails</span>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Apparence */}
              <div>
                <h2 className="text-lg font-medium mb-4">Apparence</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon size={18} className="text-primary" />
                      <span>Mode sombre</span>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Confidentialité */}
              <div>
                <h2 className="text-lg font-medium mb-4">Confidentialité</h2>
                <div className="space-y-4">
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-between px-0 h-auto py-2"
                    onClick={() => {}}
                  >
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-primary" />
                      <span>Confidentialité du compte</span>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-between px-0 h-auto py-2"
                    onClick={() => {}}
                  >
                    <div className="flex items-center gap-3">
                      <Lock size={18} className="text-primary" />
                      <span>Changer le mot de passe</span>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {/* Aide et support */}
              <div>
                <h2 className="text-lg font-medium mb-4">Aide et support</h2>
                <div className="space-y-4">
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-between px-0 h-auto py-2"
                    onClick={() => {}}
                  >
                    <div className="flex items-center gap-3">
                      <LifeBuoy size={18} className="text-primary" />
                      <span>Centre d'aide</span>
                    </div>
                    <ExternalLink size={18} className="text-muted-foreground" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-between px-0 h-auto py-2"
                    onClick={() => navigate("/profil")}
                  >
                    <div className="flex items-center gap-3">
                      <LifeBuoy size={18} className="text-primary" />
                      <span>Signaler un problème</span>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {/* À propos */}
              <div className="pb-6">
                <h2 className="text-lg font-medium mb-4">À propos</h2>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Version 1.0.0
                  </p>
                  <p className="text-sm text-muted-foreground">
                    © 2024 Mookka. Tous droits réservés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Settings;
