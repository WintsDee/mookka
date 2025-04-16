
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface HelpItem {
  title: string;
  content: string;
}

interface HelpItemsProps {
  items: HelpItem[];
}

export function HelpItems({ items }: HelpItemsProps) {
  return (
    <ScrollArea className="max-h-[400px] pr-4">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border p-3">
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{item.content}</p>
          </div>
        ))}
        
        <div className="pt-2 pb-4">
          <Alert variant="default" className="bg-muted/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Besoin de plus d'aide ?</AlertTitle>
            <AlertDescription>
              Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous envoyer un message via l'onglet Feedback.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </ScrollArea>
  );
}
