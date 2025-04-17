
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UseSubscriptionProps {
  mediaId: string;
  mediaType: string;
}

export function useSubscription({ mediaId, mediaType }: UseSubscriptionProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function checkSubscription() {
      setIsLoading(true);
      try {
        const { data: user } = await supabase.auth.getUser();
        
        if (!user?.user) {
          setIsLoading(false);
          return;
        }
        
        // Use raw query to avoid type issues with new tables not in the types file yet
        const { data, error } = await supabase
          .from('media_subscriptions')
          .select('id')
          .eq('media_id', mediaId)
          .eq('user_id', user.user.id)
          .maybeSingle() as any;
          
        if (error) {
          console.error('Erreur lors de la vérification de l\'abonnement:', error);
          throw error;
        }
        
        setIsSubscribed(!!data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (mediaId) {
      checkSubscription();
    }
  }, [mediaId]);
  
  const toggleSubscription = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour vous abonner aux notifications.",
          variant: "destructive"
        });
        return;
      }
      
      if (isSubscribed) {
        // Unsubscribe - use raw query to avoid type issues with new tables
        const { error } = await supabase
          .from('media_subscriptions')
          .delete()
          .eq('media_id', mediaId)
          .eq('user_id', user.user.id) as any;
          
        if (error) throw error;
        
        setIsSubscribed(false);
        toast({
          title: "Notifications désactivées",
          description: "Vous ne serez plus notifié des nouveaux épisodes."
        });
      } else {
        // Subscribe - use raw query to avoid type issues with new tables
        const { error } = await supabase
          .from('media_subscriptions')
          .insert({
            media_id: mediaId,
            user_id: user.user.id,
            media_type: mediaType,
            created_at: new Date().toISOString()
          }) as any;
          
        if (error) throw error;
        
        setIsSubscribed(true);
        toast({
          title: "Notifications activées",
          description: "Vous serez notifié lors de la sortie de nouveaux épisodes."
        });
      }
    } catch (error) {
      console.error('Erreur lors de la modification de l\'abonnement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  return {
    isSubscribed,
    isLoading,
    toggleSubscription
  };
}
