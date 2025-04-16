
import React from "react";
import { FileQuestion } from "lucide-react";

export function ProgressionEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">Pas de progression disponible</h3>
      <p className="text-muted-foreground max-w-md">
        La progression n'est pas disponible pour ce type de média ou n'a pas encore été configurée.
      </p>
    </div>
  );
}
