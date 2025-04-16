
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function WhereToWatchEmpty() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Où voir ou acheter ce média ?</h2>
      <Card className="bg-secondary/40 border-border">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Nous n'avons pas encore d'informations sur les plateformes de visionnage ou d'achat pour ce média.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
