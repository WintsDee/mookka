
import { supabase } from "@/integrations/supabase/client";
import { SocialActivity, ActivityComment, DEFAULT_SHARE_SETTINGS } from "./types";

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
      social_share_settings?: any
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
