
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TypeField, TitleField, MessageField, ContactField } from "./form-fields";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, AlertTriangle } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    
    try {
      // Appel de la fonction Supabase Edge pour créer l'issue GitHub
      const { data, error: functionError } = await supabase.functions.invoke('github-issue', {
        body: values
      });
      
      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message || "Une erreur est survenue lors de l'envoi du feedback");
      }
      
      if (data?.error) {
        console.error('Data error:', data.error);
        throw new Error(data.error || "Une erreur est survenue côté serveur");
      }
      
      console.log('Feedback envoyé avec succès:', data);
      
      toast({
        title: "Feedback envoyé",
        description: "Merci pour votre retour ! Nous l'examinerons rapidement.",
      });
      
      onSubmitSuccess();
      form.reset();
      
    } catch (err: any) {
      console.error('Erreur lors de l\'envoi du feedback:', err);
      
      const errorMessage = err.message || "Une erreur est survenue lors de l'envoi du feedback. Veuillez réessayer.";
      setError(errorMessage);
      
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
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Alert className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Attention</AlertTitle>
          <AlertDescription className="text-amber-700">
            Le système de feedback est en cours de maintenance. Nous nous excusons pour la gêne occasionnée.
          </AlertDescription>
        </Alert>
        
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
