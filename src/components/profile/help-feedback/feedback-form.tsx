
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TypeField, TitleField, MessageField, ContactField } from "./form-fields";

const feedbackSchema = z.object({
  type: z.string({ required_error: "Veuillez sélectionner un type de retour" }),
  message: z.string().min(10, { message: "Votre message doit contenir au moins 10 caractères" }),
  contact: z.string().optional(),
  title: z.string().optional()
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;

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
        <TypeField control={form.control} />
        <TitleField control={form.control} />
        <MessageField control={form.control} />
        <ContactField control={form.control} />
        
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
