
import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HelpCircle, BookOpen, Settings, Bug, Lightbulb, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const feedbackSchema = z.object({
  type: z.enum(["bug", "idea", "suggestion"]),
  message: z.string().min(10, "Votre message doit contenir au moins 10 caractères"),
  contact: z.string().optional(),
  title: z.string().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function HelpFeedback() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: "suggestion",
      message: "",
      contact: "",
      title: "",
    },
  });

  const onSubmit = async (values: FeedbackFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('github-issue', {
        body: values,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSubmitSuccess(true);
      form.reset();
      
      toast({
        title: "Merci pour votre retour !",
        description: "Votre message a bien été envoyé à l'équipe.",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du feedback:", error);
      
      toast({
        title: "Une erreur est survenue",
        description: "Impossible d'envoyer votre message. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-bold">Aide & Feedback</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
            <HelpCircle size={18} className="text-primary" />
            Besoin d'aide ?
          </h3>
          
          <Accordion type="single" collapsible className="bg-card rounded-lg border">
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span>Comment ajouter un média à ma bibliothèque ?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                Recherchez un média depuis la page "Recherche", puis cliquez sur la fiche du média. 
                Sur la page de détail, utilisez le bouton "Ajouter à ma bibliothèque".
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="px-4">
                <div className="flex items-center gap-2">
                  <Settings size={16} className="text-primary" />
                  <span>Comment gérer ma progression ?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                Dans la page de détail d'un média, allez dans l'onglet "Progression". 
                Vous pourrez y suivre votre avancement pour les films, séries, livres et jeux.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="px-4">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-primary" />
                  <span>Comment créer une collection ?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                Depuis votre profil ou la page "Collections", cliquez sur "Créer une collection".
                Donnez un nom, choisissez un type et une visibilité, puis ajoutez-y des médias.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section>
          <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
            <MessageSquare size={18} className="text-primary" />
            Envoyez-nous votre feedback
          </h3>
          
          {submitSuccess ? (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <AlertTitle>Merci pour votre retour !</AlertTitle>
              <AlertDescription>
                Votre message a bien été envoyé à l'équipe de développement. 
                Nous vous remercions de nous aider à améliorer Mookka !
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de retour</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bug" className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Bug size={16} className="text-red-500" />
                              <span>Bug / Problème</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="idea">
                            <div className="flex items-center gap-2">
                              <Lightbulb size={16} className="text-amber-500" />
                              <span>Idée</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="suggestion">
                            <div className="flex items-center gap-2">
                              <MessageSquare size={16} className="text-blue-500" />
                              <span>Suggestion</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre (optionnel)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Un titre pour votre retour" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Votre message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez votre retour, bug ou idée..." 
                          rows={4} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment vous contacter ? (optionnel)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Email ou pseudo" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                </Button>
              </form>
            </Form>
          )}
        </section>
      </div>
    </div>
  );
}
