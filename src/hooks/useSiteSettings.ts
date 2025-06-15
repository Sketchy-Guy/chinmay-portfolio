
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  site_logo?: string | null;
  site_favicon?: string | null;
  site_name?: string | null;
  // add other settings as needed
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["site_logo", "site_favicon", "site_name"])
        .maybeSingle();

      if (!data || error) {
        setSettings({});
      } else if (data) {
        // Try to fetch as many as possible (multi row select)
        let settings: SiteSettings = {};
        if (Array.isArray(data)) {
          data.forEach((row) => {
            settings[row.key] = typeof row.value === "string" ? row.value : row.value;
          });
        } else if (data.key) {
          settings[data.key] = typeof data.value === "string" ? data.value : data.value;
        }
        if (mounted) setSettings(settings);
      }
      setLoading(false);
    }
    fetchSettings();
    return () => { mounted = false; };
  }, []);

  return { settings, loading };
}
