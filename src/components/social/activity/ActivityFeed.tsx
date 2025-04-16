
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ActivityCard } from "./ActivityCard";
import { getFriendsActivity, SocialActivity } from "@/services/media/social-service";
import { Button } from "@/components/ui/button";
import { EmptyActivityFeed } from "./EmptyActivityFeed";

export function ActivityFeed() {
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getFriendsActivity();
      
      if (error) {
        setError(typeof error === 'string' ? error : "Une erreur est survenue lors du chargement du flux d'activité");
      } else {
        setActivities(data || []);
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement du flux d'activité...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center px-6">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Réessayer
        </Button>
      </div>
    );
  }

  if (activities.length === 0) {
    return <EmptyActivityFeed onRefresh={handleRefresh} refreshing={refreshing} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="text-xs"
        >
          {refreshing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
          Actualiser
        </Button>
      </div>
      
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} onUpdate={handleRefresh} />
      ))}
    </div>
  );
}
