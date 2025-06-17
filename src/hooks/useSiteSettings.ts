
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { connectionManager } from "@/utils/connectionManager";

export interface SiteSettings {
  [key: string]: string | null | undefined;
  site_logo?: string | null;
  site_favicon?: string | null;
  site_name?: string | null;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [channelId, setChannelId] = useState<string>('');

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["site_logo", "site_favicon", "site_name"])
        .order("key");

      if (error) {
        console.error('Error fetching site settings:', error);
        setSettings({});
        return;
      }

      const siteSettings: SiteSettings = {};
      for (const row of data || []) {
        let valueStr = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
        try {
          siteSettings[row.key] = JSON.parse(valueStr);
        } catch {
          siteSettings[row.key] = valueStr ?? null;
        }
      }
      
      setSettings(siteSettings);
    } catch (error) {
      console.error('Error in fetchSettings:', error);
      setSettings({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    // Initial fetch
    fetchSettings();

    // Create unique channel ID
    const newChannelId = connectionManager.createUniqueChannelId('site_settings');
    setChannelId(newChannelId);
    
    // Set up realtime subscription with debouncing
    const channel = supabase
      .channel(newChannelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        (payload) => {
          console.log('Site settings changed:', payload);
          // Debounce updates to prevent loops
          connectionManager.debounce('site-settings-update', () => {
            if (mounted) fetchSettings();
          }, 1000);
        }
      )
      .subscribe((status) => {
        console.log(`Site settings channel ${newChannelId} status:`, status);
      });

    connectionManager.registerChannel(newChannelId, channel);

    return () => {
      mounted = false;
      connectionManager.unregisterChannel(newChannelId);
    };
  }, [fetchSettings]);

  return { settings, loading };
}
