
import React from "react";
import { APP_INFO } from "@/config/app-info";

interface AboutItemProps {
  children: React.ReactNode;
}

const AboutItem = ({ children }: AboutItemProps) => (
  <p className="text-sm text-muted-foreground">
    {children}
  </p>
);

export function AboutSection() {
  return (
    <div className="pb-6">
      <h2 className="text-lg font-medium mb-4">À propos</h2>
      <div className="space-y-4">
        <AboutItem>
          Version {APP_INFO.version}
        </AboutItem>
        <AboutItem>
          © {APP_INFO.year} {APP_INFO.name}. Tous droits réservés.
        </AboutItem>
      </div>
    </div>
  );
}

