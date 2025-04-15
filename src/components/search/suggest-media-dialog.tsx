
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MediaType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { getFormSchema, getDefaultValues } from "./media-suggestion/suggestion-schemas";
import { TypeSpecificFields } from "./media-suggestion/type-specific-fields";
import { CommonFormFields } from "./media-suggestion/common-form-fields";
import { submitMediaSuggestion } from "@/services/media/suggestion-service";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface SuggestMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: MediaType | "";
}

export function SuggestMediaDialog({ open, onOpenChange, mediaType }: SuggestMediaDialogProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const formSchema = getFormSchema(mediaType);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(mediaType),
  });

  const getMediaTypeTitle = (type: MediaType | "") => {
    switch(type) {
      case "film": return "film";
      case "serie": return "série";
      case "book": return "livre";
      case "game": return "jeu";
      default: return "média";
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Prepare the suggestion data
      const suggestionData = {
        title: values.title,
        type: mediaType,
        year: values.year,
        description: values.description,
        cover_url: values.coverUrl,
        ...(mediaType === "film" && { director: (values as any).director }),
        ...(mediaType === "serie" && { creator: (values as any).creator }),
        ...(mediaType === "book" && { author: (values as any).author }),
        ...(mediaType === "game" && { 
          publisher: (values as any).publisher,
          platform: (values as any).platform 
        }),
      };

      // Submit the suggestion
      await submitMediaSuggestion(suggestionData);

      toast({
        title: "Suggestion envoyée",
        description: "Merci pour votre suggestion ! Elle sera examinée par notre équipe.",
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la suggestion:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre suggestion. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-md max-h-[90vh] ${isMobile ? 'w-[95%]' : ''}`}>
        <DialogHeader>
          <DialogTitle>Suggérer un {getMediaTypeTitle(mediaType)}</DialogTitle>
          <DialogDescription>
            Proposez un nouveau média à ajouter à la base de données Mookka
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Common form fields for all media types */}
              <CommonFormFields form={form} />
              
              {/* Media type specific fields */}
              <TypeSpecificFields mediaType={mediaType} form={form} />
              
              <DialogFooter className="mt-6">
                <Button type="submit">Envoyer la suggestion</Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
