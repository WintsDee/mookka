
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const feedbackSchema = z.object({
  type: z.string({ required_error: "Veuillez sélectionner un type de retour" }),
  message: z.string().min(10, { message: "Votre message doit contenir au moins 10 caractères" }),
  contact: z.string().optional(),
  title: z.string().optional()
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface UseFeedbackFormProps {
  onSubmitSuccess: () => void;
}

export function useFeedbackForm({ onSubmitSuccess }: UseFeedbackFormProps) {
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

  const handleSubmit = async (values: FeedbackFormValues) => {
    try {
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
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
}
