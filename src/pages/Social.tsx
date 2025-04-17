
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { TabsContent } from "@/components/ui/tabs";
import { ActivityList } from "@/components/social/activity-list/activity-list";
import { SocialTabs, ComingSoonTab } from "@/components/social/social-tabs";
import { useSocialActivity } from "@/hooks/use-social-activity";

const Social = () => {
  const { activities, media, loading } = useSocialActivity();

  return (
    <Background>
      <MobileHeader title="Social" />
      <div className="pb-24 pt-safe mt-16">
        <header className="px-6 mb-6">
          <div className="mt-4">
            <SocialTabs>
              <TabsContent value="activity" className="mt-4">
                <ActivityList 
                  activities={activities}
                  media={media}
                  loading={loading}
                />
              </TabsContent>
              
              <TabsContent value="friends">
                <ComingSoonTab />
              </TabsContent>
              
              <TabsContent value="discover">
                <ComingSoonTab />
              </TabsContent>
            </SocialTabs>
          </div>
        </header>
      </div>
      <MobileNav />
    </Background>
  );
};

export default Social;
