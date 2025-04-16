
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";

export function NotificationsSection() {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Notifications</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-primary" />
            <span>Notifications push</span>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-primary" />
            <span>Emails</span>
          </div>
          <Switch />
        </div>
      </div>
    </div>
  );
}
