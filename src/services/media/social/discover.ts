
import { supabase } from "@/integrations/supabase/client";

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
