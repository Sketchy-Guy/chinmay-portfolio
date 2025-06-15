
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  [key: string]: string | null | undefined;
  site_logo?: string | null;
  site_favicon?: string | null;
  site_name?: string | null;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchSettings() {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["site_logo", "site_favicon", "site_name"])
        .order("key");

      if (error || !data) {
        setSettings({});
      } else {
        let siteSettings: SiteSettings = {};
        for (const row of data) {
          // Try to parse stringified values—could be string or json.
          let valueStr = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
          try {
            // Try JSON parse, fallback to string
            siteSettings[row.key] = JSON.parse(valueStr);
          } catch {
            siteSettings[row.key] = valueStr ?? null;
          }
        }
        if (mounted) setSettings(siteSettings);
      }
      setLoading(false);
    }
    fetchSettings();
    // Listen for realtime changes on site_settings table
    const channel = supabase
      .channel("site_settings_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, fetchSettings)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading };
}
