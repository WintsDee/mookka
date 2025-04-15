
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { PageTitle } from "@/components/page-title";

const Notifications = () => {
  return (
    <Background>
      <MobileHeader />
      <div className="pb-24 pt-20">
        <div className="px-6">
          <PageTitle>Notifications</PageTitle>
          
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
            <p className="text-muted-foreground">
              Vous n'avez pas encore de notifications.
            </p>
          </div>
        </div>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Notifications;
