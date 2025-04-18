
import { useState, useCallback } from "react";

export function useSources() {
  const [sources, setSources] = useState<string[]>([]);
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [activeSources, setActiveSources] = useState<string[]>([]);

  const handleSourceChange = useCallback((source: string | null) => {
    setActiveSource(source);
  }, []);

  const handleSourcesChange = useCallback((newSources: string[]) => {
    setActiveSources(newSources);
  }, []);

  return {
    sources,
    setSources,
    activeSource,
    activeSources,
    handleSourceChange,
    handleSourcesChange,
  };
}
