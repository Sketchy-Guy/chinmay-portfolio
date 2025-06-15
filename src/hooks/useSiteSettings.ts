
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
    let channel: any = null;
    let isFetching = false;

    async function fetchSettings() {
      if (isFetching) return; // Prevent double-fetching
      isFetching = true;
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
          let valueStr = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
          try {
            siteSettings[row.key] = JSON.parse(valueStr);
          } catch {
            siteSettings[row.key] = valueStr ?? null;
          }
        }
        if (mounted) setSettings(siteSettings);
      }
      setLoading(false);
      isFetching = false;
    }

    fetchSettings();

    // Always create a new channel instance for every effect mount
    channel = supabase
      .channel("site_settings_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        fetchSettings
      )
      .subscribe();

    // Cleanup: always remove the channel on unmount/effect tear-down
    return () => {
      mounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { settings, loading };
}
