
import { useState } from "react";

export function useAuthTabs() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  return {
    activeTab,
    setActiveTab
  };
}
