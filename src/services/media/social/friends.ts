
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Friend, FriendRequest } from "./types";

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
