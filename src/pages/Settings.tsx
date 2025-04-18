
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { PrivacySection } from "@/components/settings/privacy-section";
import { HelpSection } from "@/components/settings/help-section";
import { AboutSection } from "@/components/settings/about-section";
import { HelpFeedback } from "@/components/profile/help-feedback";

const Settings = () => {
  return (
    <Background>
      <MobileHeader title="Paramètres" />
      <div className="pt-safe pb-24 mt-16">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="px-6 py-4">
            <div className="space-y-6">
              {/* Notifications */}
              <NotificationsSection />
              
              <Separator />
              
              {/* Confidentialité */}
              <PrivacySection />
              
              <Separator />
              
              {/* Centre d'aide */}
              <HelpSection />
              
              <Separator />
              
              {/* À propos */}
              <AboutSection />
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* This is the hidden global instance for triggering from other locations */}
      <div className="hidden">
        <HelpFeedback data-help-feedback-trigger />
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Settings;
