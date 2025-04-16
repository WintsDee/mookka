
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileSearch } from "lucide-react";

export function WhereToWatchEmpty() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Où voir ou acheter ce média ?</h2>
      <Card className="bg-secondary/40 border-border">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <FileSearch className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Ce média n'est actuellement disponible sur aucune plateforme répertoriée.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
