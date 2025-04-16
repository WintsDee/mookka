
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { SocialTabs } from "@/components/social/SocialTabs";

const Social = () => {
  return (
    <Background>
      <MobileHeader title="Social" />
      <div className="pb-24 pt-safe mt-16">
        <header className="px-6 mb-6">
          <div className="mt-4">
            <SocialTabs />
          </div>
        </header>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Social;
