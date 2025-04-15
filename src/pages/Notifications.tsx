
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";

const Notifications = () => {
  return (
    <Background>
      <MobileHeader title="Notifications" />
      <div className="pt-safe pb-24 mt-16">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
          <p className="text-muted-foreground">
            Vous n'avez pas encore de notifications.
          </p>
        </div>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Notifications;
