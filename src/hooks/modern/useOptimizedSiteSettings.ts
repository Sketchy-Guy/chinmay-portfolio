
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { modernConnectionManager } from "@/utils/modern/connectionManager";

export interface OptimizedSiteSettings {
  [key: string]: string | null | undefined;
  site_logo?: string | null;
  site_favicon?: string | null;
  site_name?: string | null;
  site_description?: string | null;
  social_github?: string | null;
  social_linkedin?: string | null;
  social_email?: string | null;
}

export function useOptimizedSiteSettings() {
  const [settings, setSettings] = useState<OptimizedSiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string>('');

  const fetchSettings = useCallback(async (retryCount = 0): Promise<void> => {
    try {
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "site_logo", 
          "site_favicon", 
          "site_name", 
          "site_description",
          "social_github",
          "social_linkedin", 
          "social_email"
        ])
        .order("key");

      if (fetchError) {
        throw fetchError;
      }

      // Transform data into settings object with proper parsing
      const siteSettings: OptimizedSiteSettings = {};
      
      for (const row of data || []) {
        let processedValue: string | null = null;
        
        try {
          if (row.value !== null) {
            // Handle different value types - parse JSON strings properly
            if (typeof row.value === "string") {
              try {
                // Try to parse as JSON first
                const parsed = JSON.parse(row.value);
                processedValue = typeof parsed === 'string' ? parsed : String(parsed);
              } catch {
                // If not JSON, use as is
                processedValue = row.value;
              }
            } else {
              // Convert to string if not already
              processedValue = String(row.value);
            }
          }
          
          siteSettings[row.key] = processedValue;
        } catch (parseError) {
          console.warn(`Error processing setting ${row.key}:`, parseError);
          siteSettings[row.key] = null;
        }
      }
      
      // Set enhanced default values
      const settingsWithDefaults: OptimizedSiteSettings = {
        site_name: 'Chinmay Kumar Panda',
        site_description: 'Full Stack Developer & AI Enthusiast',
        site_logo: '/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png',
        social_github: 'https://github.com/chinmaykumarpanda',
        social_linkedin: 'https://linkedin.com/in/chinmaykumarpanda',
        social_email: 'chinmaykumarpanda004@gmail.com',
        ...siteSettings
      };
      
      setSettings(settingsWithDefaults);
      console.log('Site settings loaded:', settingsWithDefaults);
      
    } catch (error: any) {
      console.error('Error fetching site settings:', error);
      setError(error.message || 'Failed to fetch site settings');
      
      if (retryCount < 2 && error.code !== 'PGRST116') {
        console.log(`Retrying fetch settings (attempt ${retryCount + 1})`);
        setTimeout(() => fetchSettings(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      // Enhanced fallback values
      setSettings({
        site_name: 'Chinmay Kumar Panda',
        site_description: 'Full Stack Developer & AI Enthusiast',
        site_logo: '/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png',
        social_github: 'https://github.com/chinmaykumarpanda',
        social_linkedin: 'https://linkedin.com/in/chinmaykumarpanda',
        social_email: 'chinmaykumarpanda004@gmail.com'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSetting = useCallback(async (key: string, value: string | null): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ 
          key, 
          value: JSON.stringify(value),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      return true;
      
    } catch (error: any) {
      console.error(`Error updating setting ${key}:`, error);
      setError(`Failed to update ${key}: ${error.message}`);
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    fetchSettings();

    const newChannelId = modernConnectionManager.createUniqueChannelId('site_settings_optimized');
    setChannelId(newChannelId);
    
    const channel = supabase
      .channel(newChannelId)
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "site_settings",
          filter: "key=in.(site_logo,site_favicon,site_name,site_description,social_github,social_linkedin,social_email)"
        },
        (payload) => {
          console.log('Site settings real-time update:', payload);
          
          modernConnectionManager.debounce('site-settings-realtime-update', () => {
            if (mounted) {
              fetchSettings();
            }
          }, 1500);
        }
      )
      .subscribe((status) => {
        console.log(`Site settings channel ${newChannelId} status:`, status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Site settings real-time subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          console.warn('Site settings real-time subscription error');
          setError('Real-time updates temporarily unavailable');
        }
      });

    modernConnectionManager.registerChannel(newChannelId, channel);

    return () => {
      mounted = false;
      modernConnectionManager.unregisterChannel(newChannelId);
    };
  }, [fetchSettings]);

  return { 
    settings, 
    loading, 
    error, 
    updateSetting,
    refetch: fetchSettings
  };
}
