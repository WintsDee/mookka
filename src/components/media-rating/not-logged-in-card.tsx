
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NotLoggedInCard() {
  return (
    <Card className="bg-secondary/40 border-border">
      <CardContent className="p-4 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Vous devez être connecté pour critiquer ce média
        </p>
        <Button variant="default" size="sm">
          Se connecter
        </Button>
      </CardContent>
    </Card>
  );
}
