
import React, { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { ActivityCard } from "./ActivityCard";
import { getFriendsActivity, SocialActivity } from "@/services/media/social-service";
import { Button } from "@/components/ui/button";
import { EmptyActivityFeed } from "./EmptyActivityFeed";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { ActivityTypeFilter } from "./ActivityTypeFilter";

export function ActivityFeed() {
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<SocialActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getFriendsActivity();
      
      if (error) {
        setError(typeof error === 'string' ? error : "Une erreur est survenue lors du chargement du flux d'activité");
      } else {
        setActivities(data || []);
        applyFilters(data || [], activeFilters);
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
    
    toast({
      title: "Flux actualisé",
      description: "Votre flux d'activité a été mis à jour",
    });
  };

  const applyFilters = (activities: SocialActivity[], filters: string[]) => {
    if (filters.length === 0) {
      setFilteredActivities(activities);
      return;
    }

    const filtered = activities.filter(activity => {
      // Si l'activité est du type spécifié dans les filtres
      return filters.includes(activity.actionType);
    });

    setFilteredActivities(filtered);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    applyFilters(activities, filters);
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
      <Card className="p-6 bg-secondary/10 text-center">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Réessayer
        </Button>
      </Card>
    );
  }

  if (activities.length === 0) {
    return <EmptyActivityFeed onRefresh={handleRefresh} refreshing={refreshing} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 mb-2 sm:flex-row sm:items-center sm:justify-between">
        <ActivityTypeFilter 
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="text-xs shrink-0"
        >
          {refreshing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <RefreshCw className="h-3 w-3 mr-2" />}
          Actualiser
        </Button>
      </div>
      
      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} onUpdate={handleRefresh} />
        ))}
      </div>
    </div>
  );
}
