import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/hooks/use-profile";
import { toast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";

// Types pour les demandes d'amitié
export interface FriendRequest {
  id: string;
  senderId: string;
  username: string;
  avatarUrl: string;
  createdAt: string;
}

// Types pour les amis
export interface Friend {
  id: string;
  username: string;
  avatarUrl: string;
  status: string;
}

// Types pour les activités sociales
export interface SocialActivity {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  action: string;
  actionType: string;
  media: {
    id: string;
    title: string;
    type: string;
    coverImage?: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  hasLiked: boolean;
  note?: string;
  rating?: number;
}

export interface ActivityComment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

// Configuration des paramètres de partage social
export interface SocialShareSettings {
  shareRatings: boolean;
  shareReviews: boolean;
  shareCollections: boolean;
  shareProgress: boolean;
  shareLibraryAdditions: boolean;
}

const DEFAULT_SHARE_SETTINGS: SocialShareSettings = {
  shareRatings: true,
  shareReviews: true,
  shareCollections: true,
  shareProgress: true,
  shareLibraryAdditions: true
};

// Helper function to safely convert Json to SocialShareSettings
function jsonToSocialShareSettings(jsonData: Json | null): SocialShareSettings {
  if (!jsonData || typeof jsonData !== 'object' || Array.isArray(jsonData)) {
    return { ...DEFAULT_SHARE_SETTINGS };
  }
  
  // Cast to record with string keys and any values for safe property access
  const settings = jsonData as Record<string, any>;
  
  return {
    shareRatings: typeof settings.shareRatings === 'boolean' ? settings.shareRatings : DEFAULT_SHARE_SETTINGS.shareRatings,
    shareReviews: typeof settings.shareReviews === 'boolean' ? settings.shareReviews : DEFAULT_SHARE_SETTINGS.shareReviews,
    shareCollections: typeof settings.shareCollections === 'boolean' ? settings.shareCollections : DEFAULT_SHARE_SETTINGS.shareCollections,
    shareProgress: typeof settings.shareProgress === 'boolean' ? settings.shareProgress : DEFAULT_SHARE_SETTINGS.shareProgress,
    shareLibraryAdditions: typeof settings.shareLibraryAdditions === 'boolean' ? settings.shareLibraryAdditions : DEFAULT_SHARE_SETTINGS.shareLibraryAdditions
  };
}

// Récupérer les paramètres de partage social
export async function getSocialShareSettings(): Promise<SocialShareSettings> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return DEFAULT_SHARE_SETTINGS;

    const { data, error } = await supabase
      .from('profiles')
      .select('social_share_settings')
      .eq('id', user.user.id)
      .single();

    if (error || !data || !data.social_share_settings) {
      return DEFAULT_SHARE_SETTINGS;
    }

    return jsonToSocialShareSettings(data.social_share_settings);
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres de partage:", error);
    return DEFAULT_SHARE_SETTINGS;
  }
}

// Mettre à jour les paramètres de partage social
export async function updateSocialShareSettings(settings: Partial<SocialShareSettings>) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }

    // Récupérer les paramètres actuels
    const currentSettings = await getSocialShareSettings();
    
    // Fusionner avec les nouveaux paramètres
    const updatedSettings: SocialShareSettings = {
      ...currentSettings,
      ...settings
    };

    // Convert to a plain object for Supabase
    const dbSettings = {
      shareRatings: updatedSettings.shareRatings,
      shareReviews: updatedSettings.shareReviews,
      shareCollections: updatedSettings.shareCollections,
      shareProgress: updatedSettings.shareProgress,
      shareLibraryAdditions: updatedSettings.shareLibraryAdditions
    };

    const { error } = await supabase
      .from('profiles')
      .update({
        social_share_settings: dbSettings as Json,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.user.id);

    if (error) throw error;

    toast({
      title: "Paramètres mis à jour",
      description: "Vos préférences de partage social ont été mises à jour",
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres:", error);
    toast({
      title: "Erreur",
      description: "Impossible de mettre à jour vos préférences de partage",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

// Récupérer le flux d'activité des amis
export async function getFriendsActivity() {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return { data: [], error: "Utilisateur non connecté" };
    }

    const userId = session.session.user.id;

    // Obtenir la liste des amis de l'utilisateur
    const { data: friendsData, error: friendsError } = await supabase.rpc('get_user_friends', {
      user_id: userId
    });

    if (friendsError) throw friendsError;

    if (!friendsData || friendsData.length === 0) {
      return { data: [], error: null };
    }

    // Extraire les IDs des amis
    const friendIds = friendsData.map(friend => friend.friend_id);
    
    // Récupérer l'activité des amis (ajouts de médias récents)
    const { data: activityData, error: activityError } = await supabase
      .from('user_media')
      .select(`
        id, 
        user_id, 
        media_id, 
        status, 
        added_at,
        updated_at,
        user_rating,
        notes,
        media:media_id (id, title, type, cover_image)
      `)
      .in('user_id', friendIds)
      .order('updated_at', { ascending: false })
      .limit(30);

    if (activityError) throw activityError;

    if (!activityData || activityData.length === 0) {
      return { data: [], error: null };
    }

    // Récupérer les profils des amis pour obtenir leurs noms et avatars
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, social_share_settings')
      .in('id', friendIds);

    if (profilesError) throw profilesError;

    // Créer un mapping des profils pour un accès facile
    const profileMap: Record<string, { 
      username: string, 
      avatar_url: string,
      social_share_settings?: SocialShareSettings
    }> = {};
    
    profiles?.forEach(profile => {
      profileMap[profile.id] = {
        username: profile.username,
        avatar_url: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
        social_share_settings: profile.social_share_settings
      };
    });

    // Récupérer les likes pour chaque activité
    const activityIds = activityData.map(item => item.id);
    const { data: likesData, error: likesError } = await supabase
      .from('activity_likes')
      .select('activity_id, user_id')
      .in('activity_id', activityIds);

    if (likesError) throw likesError;

    // Créer un compteur de likes par activité
    const likesCount: Record<string, number> = {};
    const userLikes: Record<string, boolean> = {};
    
    likesData?.forEach(like => {
      likesCount[like.activity_id] = (likesCount[like.activity_id] || 0) + 1;
      if (like.user_id === userId) {
        userLikes[like.activity_id] = true;
      }
    });

    // Récupérer les commentaires pour chaque activité
    const { data: commentsData, error: commentsError } = await supabase
      .from('activity_comments')
      .select('activity_id')
      .in('activity_id', activityIds);

    if (commentsError) throw commentsError;

    // Créer un compteur de commentaires par activité
    const commentsCount: Record<string, number> = {};
    commentsData?.forEach(comment => {
      commentsCount[comment.activity_id] = (commentsCount[comment.activity_id] || 0) + 1;
    });

    // Formater les données pour l'affichage
    const activities: SocialActivity[] = activityData
      .filter(item => {
        // Vérifier les paramètres de partage de l'utilisateur
        const profile = profileMap[item.user_id];
        const shareSettings = profile?.social_share_settings || DEFAULT_SHARE_SETTINGS;
        
        // Filtrer en fonction des paramètres de partage
        if (item.status === 'rated' && !shareSettings.shareRatings) return false;
        if (item.notes && !shareSettings.shareReviews) return false;
        if (item.status === 'added' && !shareSettings.shareLibraryAdditions) return false;
        if (['watching', 'reading', 'playing', 'completed'].includes(item.status || '') && !shareSettings.shareProgress) return false;
        
        return true;
      })
      .map(item => {
        const profile = profileMap[item.user_id];
        
        let action = 'a ajouté';
        let actionType = 'added';
        
        switch (item.status) {
          case 'watching':
          case 'reading':
          case 'playing':
            action = 'a commencé';
            actionType = 'watching';
            break;
          case 'completed':
            action = 'a terminé';
            actionType = 'completed';
            break;
          case 'rated':
            action = 'a noté';
            actionType = 'rated';
            break;
          default:
            action = 'a ajouté';
            actionType = 'added';
        }

        return {
          id: item.id,
          user: {
            id: item.user_id,
            name: profile?.username || 'Utilisateur',
            avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user_id}`
          },
          action,
          actionType,
          media: {
            id: item.media.id,
            title: item.media.title,
            type: item.media.type,
            coverImage: item.media.cover_image
          },
          timestamp: item.updated_at || item.added_at,
          likes: likesCount[item.id] || 0,
          comments: commentsCount[item.id] || 0,
          hasLiked: userLikes[item.id] || false,
          note: item.notes || undefined,
          rating: item.user_rating || undefined
        };
      });

    return { data: activities, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération du flux d'activité:", error);
    return { data: [], error: error };
  }
}

// Récupérer les recommandations d'amis
export async function getFriendSuggestions() {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return { data: [], error: "Utilisateur non connecté" };
    }

    const userId = session.session.user.id;

    // Récupérer 20 profils aléatoires qui ne sont pas déjà des amis de l'utilisateur
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, full_name')
      .neq('id', userId)
      .limit(20);

    if (profilesError) throw profilesError;

    // Récupérer les amis actuels de l'utilisateur
    const { data: friends, error: friendsError } = await supabase.rpc('get_user_friends', {
      user_id: userId
    });

    if (friendsError) throw friendsError;

    // Récupérer les demandes d'amitié déjà envoyées par l'utilisateur
    const { data: sentRequests, error: sentRequestsError } = await supabase
      .from('friend_requests')
      .select('receiver_id, status')
      .eq('sender_id', userId);

    if (sentRequestsError) throw sentRequestsError;

    // Récupérer les demandes d'amitié déjà reçues par l'utilisateur
    const { data: receivedRequests, error: receivedRequestsError } = await supabase
      .from('friend_requests')
      .select('sender_id, status')
      .eq('receiver_id', userId);

    if (receivedRequestsError) throw receivedRequestsError;

    // Créer des ensembles pour une vérification rapide
    const friendIds = new Set(friends?.map(friend => friend.friend_id) || []);
    const sentRequestIds = new Set(sentRequests?.map(req => req.receiver_id) || []);
    const receivedRequestIds = new Set(receivedRequests?.map(req => req.sender_id) || []);

    // Filtrer les profils qui ne sont pas amis et qui n'ont pas de demandes en attente
    const suggestions = profiles
      ?.filter(profile => !friendIds.has(profile.id) && 
                          !sentRequestIds.has(profile.id) && 
                          !receivedRequestIds.has(profile.id))
      .map(profile => ({
        id: profile.id,
        username: profile.username,
        fullName: profile.full_name,
        avatarUrl: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
      }))
      .slice(0, 10); // Limiter aux 10 premiers résultats

    return { data: suggestions, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération des suggestions d'amis:", error);
    return { data: [], error };
  }
}

// Récupérer les demandes d'amitié en attente
export async function getPendingFriendRequests() {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return { data: [], error: "Utilisateur non connecté" };
    }

    const userId = session.session.user.id;

    // Récupérer les demandes d'amitié en attente
    const { data, error } = await supabase.rpc('get_pending_friend_requests', {
      user_id: userId
    });

    if (error) throw error;

    // Formater les données pour l'affichage
    const requests: FriendRequest[] = data?.map(item => ({
      id: item.request_id,
      senderId: item.sender_id,
      username: item.username,
      avatarUrl: item.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.sender_id}`,
      createdAt: item.created_at
    })) || [];

    return { data: requests, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes d'amitié:", error);
    return { data: [], error };
  }
}

// Récupérer les amis de l'utilisateur
export async function getUserFriends() {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return { data: [], error: "Utilisateur non connecté" };
    }

    const userId = session.session.user.id;

    // Récupérer les amis de l'utilisateur
    const { data, error } = await supabase.rpc('get_user_friends', {
      user_id: userId
    });

    if (error) throw error;

    // Formater les données pour l'affichage
    const friends: Friend[] = data?.map(item => ({
      id: item.friend_id,
      username: item.username,
      avatarUrl: item.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.friend_id}`,
      status: item.status
    })) || [];

    return { data: friends, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération des amis:", error);
    return { data: [], error };
  }
}

// Envoyer une demande d'amitié
export async function sendFriendRequest(receiverId: string) {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return { success: false, error: "Utilisateur non connecté" };
    }

    const userId = session.session.user.id;

    // Vérifier si une demande existe déjà
    const { data: existingRequest, error: checkError } = await supabase
      .from('friend_requests')
      .select('id, status')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // Code d'erreur quand aucune ligne n'est trouvée
      throw checkError;
    }

    if (existingRequest) {
      // Une demande existe déjà
      if (existingRequest.status === 'pending') {
        return { success: false, error: "Une demande d'amitié est déjà en attente" };
      } else if (existingRequest.status === 'accepted') {
        return { success: false, error: "Vous êtes déjà amis avec cette personne" };
      }
    }

    // Insérer la nouvelle demande d'amitié
    const { error } = await supabase
      .from('friend_requests')
      .insert({
        sender_id: userId,
        receiver_id: receiverId
      });

    if (error) throw error;

    toast({
      title: "Demande envoyée",
      description: "Votre demande d'amitié a été envoyée avec succès",
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande d'amitié:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'envoyer la demande d'amitié",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

// Répondre à une demande d'amitié
export async function respondToFriendRequest(requestId: string, accept: boolean) {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return { success: false, error: "Utilisateur non connecté" };
    }

    if (accept) {
      // Accepter la demande
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Demande acceptée",
        description: "Vous avez un nouvel ami !",
      });
    } else {
      // Rejeter la demande
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Demande rejetée",
        description: "La demande d'amitié a été rejetée",
      });
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Erreur lors de la réponse à la demande d'amitié:", error);
    toast({
      title: "Erreur",
      description: "Impossible de traiter la demande d'amitié",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

// Supprimer un ami
export async function removeFriend(friendId: string) {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return { success: false, error: "Utilisateur non connecté" };
    }

    const userId = session.session.user.id;

    // Supprimer la relation d'amitié dans les deux sens
    const { error } = await supabase
      .from('friend_requests')
      .delete()
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userId})`)
      .eq('status', 'accepted');

    if (error) throw error;

    toast({
      title: "Ami supprimé",
      description: "L'ami a été retiré de votre liste d'amis",
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'ami:", error);
    toast({
      title: "Erreur",
      description: "Impossible de supprimer cet ami",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

// Aimer une activité
export async function likeActivity(activityId: string) {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return { success: false, error: "Utilisateur non connecté" };
    }

    const userId = session.session.user.id;

    // Vérifier si l'utilisateur a déjà aimé cette activité
    const { data, error: checkError } = await supabase
      .from('activity_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_id', activityId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (data) {
      // L'utilisateur a déjà aimé, supprimer le like
      const { error } = await supabase
        .from('activity_likes')
        .delete()
        .eq('id', data.id);

      if (error) throw error;

      return { success: true, liked: false, error: null };
    } else {
      // Ajouter un nouveau like
      const { error } = await supabase
        .from('activity_likes')
        .insert({
          user_id: userId,
          activity_id: activityId
        });

      if (error) throw error;

      return { success: true, liked: true, error: null };
    }
  } catch (error) {
    console.error("Erreur lors de l'action 'j'aime':", error);
    return { success: false, error };
  }
}

// Ajouter un commentaire à une activité
export async function addComment(activityId: string, content: string) {
  try {
    if (!content.trim()) {
      return { success: false, error: "Le commentaire ne peut pas être vide" };
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return { success: false, error: "Utilisateur non connecté" };
    }

    const userId = session.session.user.id;

    // Ajouter le commentaire
    const { error } = await supabase
      .from('activity_comments')
      .insert({
        user_id: userId,
        activity_id: activityId,
        content: content.trim()
      });

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire:", error);
    return { success: false, error };
  }
}

// Récupérer les commentaires d'une activité
export async function getActivityComments(activityId: string) {
  try {
    // Récupérer les commentaires
    const { data: commentsData, error: commentsError } = await supabase
      .from('activity_comments')
      .select(`
        id,
        user_id,
        content,
        created_at
      `)
      .eq('activity_id', activityId)
      .order('created_at', { ascending: true });

    if (commentsError) throw commentsError;

    if (!commentsData || commentsData.length === 0) {
      return { data: [], error: null };
    }

    // Récupérer les profils des utilisateurs ayant commenté
    const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds);

    if (profilesError) throw profilesError;

    // Créer un mapping des profils pour un accès facile
    const profileMap: Record<string, { username: string, avatar_url: string }> = {};
    profiles?.forEach(profile => {
      profileMap[profile.id] = {
        username: profile.username,
        avatar_url: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
      };
    });

    // Formater les commentaires pour l'affichage
    const comments: ActivityComment[] = commentsData.map(comment => {
      const profile = profileMap[comment.user_id];
      return {
        id: comment.id,
        user: {
          id: comment.user_id,
          name: profile?.username || 'Utilisateur',
          avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`
        },
        content: comment.content,
        timestamp: comment.created_at
      };
    });

    return { data: comments, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    return { data: [], error };
  }
}

// Rechercher des utilisateurs
export async function searchUsers(query: string) {
  try {
    if (!query.trim()) {
      return { data: [], error: null };
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return { data: [], error: "Utilisateur non connecté" };
    }

    const userId = session.session.user.id;

    // Rechercher des utilisateurs par nom d'utilisateur ou nom complet
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .neq('id', userId)
      .limit(20);

    if (error) throw error;

    // Récupérer les amis de l'utilisateur pour marquer les amis dans les résultats
    const { data: friends, error: friendsError } = await supabase.rpc('get_user_friends', {
      user_id: userId
    });

    if (friendsError) throw friendsError;

    // Créer un ensemble des IDs d'amis pour une vérification rapide
    const friendIds = new Set(friends?.map(friend => friend.friend_id) || []);

    // Formater les résultats
    const results = data?.map(user => ({
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      avatarUrl: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      isFriend: friendIds.has(user.id)
    })) || [];

    return { data: results, error: null };
  } catch (error) {
    console.error("Erreur lors de la recherche d'utilisateurs:", error);
    return { data: [], error };
  }
}

// Récupérer les profils populaires
export async function getPopularProfiles() {
  try {
    // Récupérer les profils avec le plus grand nombre d'abonnés
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, followers_count')
      .order('followers_count', { ascending: false })
      .limit(10);

    if (error) throw error;

    // Formater les résultats
    const profiles = data?.map(profile => ({
      id: profile.id,
      username: profile.username,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
      followersCount: profile.followers_count || 0
    })) || [];

    return { data: profiles, error: null };
  } catch (error) {
    console.error("Erreur lors de la récupération des profils populaires:", error);
    return { data: [], error };
  }
}
