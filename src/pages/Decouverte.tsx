
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { DiscoveryContent } from "@/components/discovery/discovery-content";

const Decouverte = () => {
  return (
    <Background>
      <MobileHeader title="Découverte" />
      <div className="pb-24 pt-safe mt-16">
        <DiscoveryContent />
      </div>
      <MobileNav />
    </Background>
  );
};

export default Decouverte;
