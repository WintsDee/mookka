import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { MediaType } from '@/types';

export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  cover_image: string | null;
  bio: string | null;
  following_count: number;
  followers_count: number;
  created_at: string;
  updated_at: string;
};

// Updated abstract images that better match the app's style
export const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=3000&auto=format&fit=crop";
export const DEFAULT_COVER = "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=3000&auto=format&fit=crop";

export function useMediaLibrary(
  mediaId?: string,
  mediaType?: MediaType,
  mediaTitle?: string
) {
  // If no mediaId is provided, return the original useProfile functionality
  if (!mediaId || !mediaType || !mediaTitle) {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<{ user: User } | null>(null);
    const { toast } = useToast();
    
    useEffect(() => {
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session);
        if (data.session?.user) {
          fetchProfile(data.session.user.id);
        } else {
          setLoading(false);
        }
      });
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          if (session?.user) {
            fetchProfile(session.user.id);
          } else {
            setProfile(null);
            setLoading(false);
          }
        }
      );
      
      return () => subscription.unsubscribe();
    }, []);
    
    async function fetchProfile(userId: string) {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          return;
        }
        
        setProfile(data);
      } catch (error) {
        console.error('Erreur inattendue:', error);
      } finally {
        setLoading(false);
      }
    }
    
    async function updateProfile({
      username,
      full_name,
      bio,
      avatar_url,
      cover_image
    }: Partial<Profile>) {
      try {
        if (!session?.user) {
          throw new Error('Aucun utilisateur connecté');
        }
        
        const { error } = await supabase
          .from('profiles')
          .update({
            username,
            full_name,
            bio,
            avatar_url,
            cover_image,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.user.id);
          
        if (error) {
          throw error;
        }
        
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été mises à jour avec succès."
        });
        
        fetchProfile(session.user.id);
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de la mise à jour du profil.",
          variant: "destructive"
        });
      }
    }
    
    async function followUser(targetUserId: string) {
      try {
        if (!session?.user) {
          throw new Error('Vous devez être connecté pour suivre un utilisateur');
        }
        
        const { error } = await supabase
          .from('user_relations')
          .insert({
            follower_id: session.user.id,
            following_id: targetUserId
          });
          
        if (error) {
          if (error.code === '23505') {
            throw new Error('Vous suivez déjà cet utilisateur');
          }
          throw error;
        }
        
        toast({
          title: "Utilisateur suivi",
          description: "Vous suivez maintenant cet utilisateur."
        });
        
        fetchProfile(session.user.id);
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue.",
          variant: "destructive"
        });
      }
    }
    
    async function unfollowUser(targetUserId: string) {
      try {
        if (!session?.user) {
          throw new Error('Vous devez être connecté pour ne plus suivre un utilisateur');
        }
        
        const { error } = await supabase
          .from('user_relations')
          .delete()
          .match({
            follower_id: session.user.id,
            following_id: targetUserId
          });
          
        if (error) {
          throw error;
        }
        
        toast({
          title: "Utilisateur non suivi",
          description: "Vous ne suivez plus cet utilisateur."
        });
        
        fetchProfile(session.user.id);
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue.",
          variant: "destructive"
        });
      }
    }
    
    return {
      profile,
      loading,
      isAuthenticated: !!session?.user,
      updateProfile,
      followUser,
      unfollowUser
    };
  }
  
  // Otherwise, return the media library management functionality
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();
  const [session, setSession] = useState<{ user: User } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        checkIfInLibrary(data.session.user.id);
      } else {
        setIsLoading(false);
      }
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          checkIfInLibrary(session.user.id);
        } else {
          setIsInLibrary(false);
          setIsLoading(false);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [mediaId]);

  const checkIfInLibrary = async (userId: string) => {
    if (!userId || !mediaId) {
      setIsLoading(false);
      return false;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_media')
        .select('*')
        .eq('user_id', userId)
        .eq('media_id', mediaId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking library:", error);
        return false;
      }

      const inLibrary = !!data;
      setIsInLibrary(inLibrary);
      return inLibrary;
    } catch (error) {
      console.error("Error checking library:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addToLibrary = async () => {
    if (!session?.user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter à votre bibliothèque",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAdding(true);
      
      // Check if media exists in the media table first
      const { data: mediaExists, error: mediaCheckError } = await supabase
        .from('media')
        .select('id')
        .eq('id', mediaId)
        .maybeSingle();
        
      if (mediaCheckError) {
        throw mediaCheckError;
      }
      
      // If media doesn't exist, create it first
      if (!mediaExists) {
        const { error: mediaInsertError } = await supabase
          .from('media')
          .insert({
            id: mediaId,
            title: mediaTitle,
            type: mediaType,
            external_id: mediaId
          });
          
        if (mediaInsertError) {
          throw mediaInsertError;
        }
      }
      
      // Add to user's library
      const { error } = await supabase
        .from('user_media')
        .insert({
          user_id: session.user.id,
          media_id: mediaId,
          added_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        if (error.code === '23505') {
          // Already in library
          setIsInLibrary(true);
          return;
        }
        throw error;
      }
      
      setIsInLibrary(true);
      toast({
        title: "Ajouté à la bibliothèque",
        description: `${mediaTitle} a été ajouté à votre bibliothèque.`,
      });
    } catch (error: any) {
      console.error("Error adding to library:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter à votre bibliothèque",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const removeFromLibrary = async () => {
    if (!session?.user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier votre bibliothèque",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsRemoving(true);
      const { error } = await supabase
        .from('user_media')
        .delete()
        .eq('user_id', session.user.id)
        .eq('media_id', mediaId);
        
      if (error) {
        throw error;
      }
      
      setIsInLibrary(false);
      toast({
        title: "Retiré de la bibliothèque",
        description: `${mediaTitle} a été retiré de votre bibliothèque.`,
      });
    } catch (error: any) {
      console.error("Error removing from library:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de retirer de votre bibliothèque",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    isInLibrary,
    isLoading,
    isAdding,
    isRemoving,
    addToLibrary,
    removeFromLibrary
  };
}

export function useProfile() {
  return useMediaLibrary();
}
