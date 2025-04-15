
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MediaType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface SuggestMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: MediaType | "";
}

// Base schema for all media types
const baseSchema = {
  title: z.string().min(2, { message: "Le titre est requis" }),
  year: z.string().regex(/^\d{4}$/, { message: "L'année doit être au format YYYY" }).optional(),
  description: z.string().optional(),
  coverUrl: z.string().url({ message: "L'URL de la couverture doit être valide" }).optional().or(z.literal("")),
  confirmNonExistent: z.boolean().refine(val => val === true, {
    message: "Veuillez confirmer que ce média n'existe pas déjà dans la base de données"
  })
};

// Media type specific schema extensions
const getFormSchema = (mediaType: MediaType | "") => {
  switch (mediaType) {
    case "film":
      return z.object({
        ...baseSchema,
        director: z.string().min(2, { message: "Le réalisateur est requis" }),
      });
    case "serie":
      return z.object({
        ...baseSchema,
        creator: z.string().min(2, { message: "Le créateur est requis" }),
      });
    case "book":
      return z.object({
        ...baseSchema,
        author: z.string().min(2, { message: "L'auteur est requis" }),
      });
    case "game":
      return z.object({
        ...baseSchema,
        publisher: z.string().min(2, { message: "L'éditeur est requis" }),
        platform: z.string().min(2, { message: "La plateforme est requise" }),
      });
    default:
      return z.object({
        ...baseSchema,
      });
  }
};

export function SuggestMediaDialog({ open, onOpenChange, mediaType }: SuggestMediaDialogProps) {
  const { toast } = useToast();
  const formSchema = getFormSchema(mediaType);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      year: "",
      description: "",
      coverUrl: "",
      confirmNonExistent: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Submit the suggestion to Supabase
      const { error } = await supabase
        .from('media_suggestions')
        .insert({
          title: values.title,
          type: mediaType,
          year: values.year ? parseInt(values.year) : null,
          description: values.description,
          cover_url: values.coverUrl,
          ...("director" in values && { director: values.director }),
          ...("creator" in values && { creator: values.creator }),
          ...("author" in values && { author: values.author }),
          ...("publisher" in values && { publisher: values.publisher }),
          ...("platform" in values && { platform: values.platform }),
          status: 'pending'
        });

      if (error) throw error;

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suggérer un {mediaType === "film" ? "film" : 
                                  mediaType === "serie" ? "série" : 
                                  mediaType === "book" ? "livre" : 
                                  mediaType === "game" ? "jeu" : 
                                  "média"}</DialogTitle>
          <DialogDescription>
            Proposez un nouveau média à ajouter à la base de données Mookka
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre du média" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année</FormLabel>
                  <FormControl>
                    <Input placeholder="YYYY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {mediaType === "film" && (
              <FormField
                control={form.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Réalisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du réalisateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {mediaType === "serie" && (
              <FormField
                control={form.control}
                name="creator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Créateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du créateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {mediaType === "book" && (
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auteur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'auteur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {mediaType === "game" && (
              <>
                <FormField
                  control={form.control}
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Éditeur</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'éditeur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plateforme</FormLabel>
                      <FormControl>
                        <Input placeholder="PS5, Xbox, PC, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description du média" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coverUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la couverture (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmNonExistent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Je confirme avoir vérifié que ce média n'existe pas déjà dans la base de données Mookka
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Envoyer la suggestion</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
