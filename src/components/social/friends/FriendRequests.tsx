
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, X, Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPendingFriendRequests, respondToFriendRequest, FriendRequest } from "@/services/media/social-service";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface FriendRequestsProps {
  onRequestProcessed: () => void;
}

export function FriendRequests({ onRequestProcessed }: FriendRequestsProps) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await getPendingFriendRequests();
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger vos demandes d'amitié",
          variant: "destructive"
        });
      } else {
        setRequests(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    const { success } = await respondToFriendRequest(requestId, true);
    if (success) {
      setRequests(requests.filter(req => req.id !== requestId));
      onRequestProcessed();
    }
  };

  const handleReject = async (requestId: string) => {
    const { success } = await respondToFriendRequest(requestId, false);
    if (success) {
      setRequests(requests.filter(req => req.id !== requestId));
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div>
        <h3 className="text-lg font-medium mb-3">Demandes d'amitié</h3>
        <div className="flex items-center justify-center py-5">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-medium mb-3">Demandes d'amitié</h3>
        <div className="bg-secondary/20 rounded-lg p-4 text-center">
          <Bell className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Aucune demande d'amitié en attente
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Demandes d'amitié</h3>
      
      <div className="space-y-2">
        {requests.map((request) => (
          <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
            <Link to={`/profil/${request.senderId}`} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={request.avatarUrl} alt={request.username} />
                <AvatarFallback>{request.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{request.username}</p>
                <p className="text-xs text-muted-foreground">
                  Demande envoyée {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true, locale: fr })}
                </p>
              </div>
            </Link>
            <div className="flex gap-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => handleAccept(request.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleReject(request.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
