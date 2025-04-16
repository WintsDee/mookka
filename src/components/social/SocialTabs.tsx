
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityFeed } from "@/components/social/activity/ActivityFeed";
import { FriendsList } from "@/components/social/friends/FriendsList";
import { FriendSearch } from "@/components/social/friends/FriendSearch";
import { DiscoverProfiles } from "@/components/social/discover/DiscoverProfiles";
import { useIsMobile } from "@/hooks/use-mobile";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SocialShareSettingsCard } from "@/components/social/settings/SocialShareSettings";

export function SocialTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Get active tab from URL parameters
  const getActiveTab = (): string => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    return tab || "activity";
  };

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    navigate(`/social?tab=${value}`, { replace: true });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Tabs 
          defaultValue={getActiveTab()} 
          className="w-full" 
          onValueChange={handleTabChange}
        >
          <div className="flex items-center justify-between">
            <TabsList className="w-full grid grid-cols-3 bg-secondary/20 p-1">
              <TabsTrigger 
                value="activity" 
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                Activité
              </TabsTrigger>
              <TabsTrigger 
                value="friends" 
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                Amis
              </TabsTrigger>
              <TabsTrigger 
                value="discover" 
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                Découvrir
              </TabsTrigger>
            </TabsList>
            
            <Drawer open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 shrink-0">
                  <Settings className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Paramètres sociaux</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-4">
                  <SocialShareSettingsCard />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          
          <TabsContent value="activity" className="mt-4">
            <ScrollArea className={isMobile ? "h-[calc(100vh-220px)]" : "h-[calc(100vh-200px)]"}>
              <ActivityFeed />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="friends" className="mt-4">
            <ScrollArea className={isMobile ? "h-[calc(100vh-220px)]" : "h-[calc(100vh-200px)]"}>
              <div className="space-y-6">
                <FriendsList />
                <div className="mt-6 pt-2">
                  <FriendSearch />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="discover" className="mt-4">
            <ScrollArea className={isMobile ? "h-[calc(100vh-220px)]" : "h-[calc(100vh-200px)]"}>
              <DiscoverProfiles />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
