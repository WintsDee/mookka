
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, X, Bell, Loader2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPendingFriendRequests, respondToFriendRequest, FriendRequest } from "@/services/media/social-service";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

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
      <Card className="p-4 bg-secondary/10 border-secondary/20">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="h-5 w-5 text-primary/80" />
          <h3 className="text-lg font-medium">Demandes d'amitié</h3>
        </div>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-4 bg-secondary/10 border-secondary/20">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="h-5 w-5 text-primary/80" />
          <h3 className="text-lg font-medium">Demandes d'amitié</h3>
        </div>
        <div className="bg-secondary/20 rounded-lg p-6 text-center">
          <Bell className="h-8 w-8 mx-auto mb-3 text-primary/40" />
          <p className="text-muted-foreground">
            Aucune demande d'amitié en attente
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-secondary/10 border-secondary/20">
      <div className="flex items-center gap-2 mb-4">
        <UserCheck className="h-5 w-5 text-primary/80" />
        <h3 className="text-lg font-medium">Demandes d'amitié</h3>
      </div>
      
      <div className="space-y-2">
        {requests.map((request) => (
          <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
            <Link to={`/profil/${request.senderId}`} className="flex items-center gap-3">
              <Avatar className="border-2 border-primary/20">
                <AvatarImage src={request.avatarUrl} alt={request.username} />
                <AvatarFallback className="bg-primary/10 text-primary/80">
                  {request.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{request.username}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true, locale: fr })}
                </p>
              </div>
            </Link>
            <div className="flex gap-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => handleAccept(request.id)}
                className="bg-green-600/90 hover:bg-green-600"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleReject(request.id)}
                className="bg-destructive/90 hover:bg-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
