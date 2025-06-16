
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
    let fetchInProgress = false;

    async function fetchSettings() {
      if (fetchInProgress) return;
      fetchInProgress = true;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["site_logo", "site_favicon", "site_name"])
          .order("key");

        if (error) {
          console.error('Error fetching site settings:', error);
          setSettings({});
        } else {
          let siteSettings: SiteSettings = {};
          for (const row of data || []) {
            let valueStr = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
            try {
              siteSettings[row.key] = JSON.parse(valueStr);
            } catch {
              siteSettings[row.key] = valueStr ?? null;
            }
          }
          if (mounted) {
            setSettings(siteSettings);
          }
        }
      } catch (error) {
        console.error('Error in fetchSettings:', error);
        if (mounted) setSettings({});
      } finally {
        setLoading(false);
        fetchInProgress = false;
      }
    }

    fetchSettings();

    // Create a unique channel name to avoid conflicts
    const channelId = `site_settings_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        (payload) => {
          console.log('Site settings changed:', payload);
          // Debounce updates to prevent loops
          setTimeout(() => {
            if (mounted) fetchSettings();
          }, 100);
        }
      )
      .subscribe((status) => {
        console.log(`Site settings channel ${channelId} status:`, status);
      });

    return () => {
      mounted = false;
      if (channel) {
        console.log(`Cleaning up site settings channel: ${channelId}`);
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { settings, loading };
}
