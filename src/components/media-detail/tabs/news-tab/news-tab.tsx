
import React from "react";
import { MediaType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

interface NewsTabProps {
  type: MediaType;
  title?: string;
}

export function NewsTab({ type, title }: NewsTabProps) {
  const { toast } = useToast();

  React.useEffect(() => {
    // Indiquer à l'utilisateur que la fonctionnalité est en cours de développement
    toast({
      title: "Fonctionnalité en développement",
      description: "Les actualités pour ce média seront bientôt disponibles.",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Actualités
          </CardTitle>
          <CardDescription>
            Les dernières actualités concernant {title || "ce média"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <Newspaper className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Les actualités pour ce {
                type === "film" ? "film" : 
                type === "serie" ? "série" : 
                type === "book" ? "livre" : "jeu"
              } seront bientôt disponibles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
