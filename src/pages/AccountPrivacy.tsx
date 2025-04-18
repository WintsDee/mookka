
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, Bell } from "lucide-react";

const AccountPrivacy = () => {
  return (
    <Background>
      <MobileHeader title="Confidentialité du compte" />
      <div className="pt-safe pb-24 mt-16">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="px-6 py-4 space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Paramètres de confidentialité
              </h2>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Compte privé</h3>
                      <p className="text-sm text-muted-foreground">
                        Seuls vos amis peuvent voir votre activité et vos collections
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Notifications de mentions</h3>
                      <p className="text-sm text-muted-foreground">
                        Choisissez qui peut vous mentionner dans les commentaires
                      </p>
                    </div>
                  </div>
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

export default AccountPrivacy;
