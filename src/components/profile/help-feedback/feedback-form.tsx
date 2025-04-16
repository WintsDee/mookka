
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const feedbackSchema = z.object({
  type: z.string({ required_error: "Veuillez sélectionner un type de retour" }),
  message: z.string().min(10, { message: "Votre message doit contenir au moins 10 caractères" }),
  contact: z.string().optional(),
  title: z.string().optional()
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  onSubmitSuccess: () => void;
}

export function FeedbackForm({ onSubmitSuccess }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: "",
      message: "",
      contact: "",
      title: ""
    }
  });
  
  async function onSubmit(values: FeedbackFormValues) {
    setIsSubmitting(true);
    
    try {
      // Appel de la fonction Supabase Edge pour créer l'issue GitHub
      const { data, error } = await supabase.functions.invoke('github-issue', {
        body: values
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('Feedback envoyé avec succès:', data);
      
      toast({
        title: "Feedback envoyé",
        description: "Merci pour votre retour ! Nous l'examinerons rapidement.",
      });
      
      onSubmitSuccess();
      form.reset();
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du feedback:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du feedback. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
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
                  <SelectItem value="bug">Bug / Problème</SelectItem>
                  <SelectItem value="feature">Idée / Suggestion</SelectItem>
                  <SelectItem value="feedback">Retour général</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
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
                <Input {...field} placeholder="Résumé court de votre feedback" />
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
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Décrivez votre feedback en détail..." 
                  rows={5}
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
              <FormLabel>Comment vous contacter (optionnel)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Email ou pseudo" />
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
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le feedback'}
        </Button>
      </form>
    </Form>
  );
}
