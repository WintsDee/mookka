
import React from "react";

export function AboutSection() {
  return (
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
  );
}
