
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
      
      // First try to get from site_settings table
      const { data: siteData, error: siteError } = await supabase
        .from("site_settings")
        .select("key, value");

      // Also get user profile data as fallback
      const { data: profileData, error: profileError } = await supabase
        .from("user_profile")
        .select("name, bio, profile_image, email")
        .limit(1)
        .single();

      // Get social links
      const { data: socialData, error: socialError } = await supabase
        .from("social_links")
        .select("platform, url");

      console.log('Site settings raw data:', { siteData, profileData, socialData });

      if (siteError && siteError.code !== 'PGRST116') {
        console.warn('Site settings error:', siteError);
      }

      // Transform site settings data
      const siteSettings: OptimizedSiteSettings = {};
      
      if (siteData) {
        for (const row of siteData) {
          try {
            if (row.value !== null) {
              if (typeof row.value === "string") {
                try {
                  const parsed = JSON.parse(row.value);
                  siteSettings[row.key] = typeof parsed === 'string' ? parsed : String(parsed);
                } catch {
                  siteSettings[row.key] = row.value;
                }
              } else {
                siteSettings[row.key] = String(row.value);
              }
            }
          } catch (parseError) {
            console.warn(`Error processing setting ${row.key}:`, parseError);
            siteSettings[row.key] = null;
          }
        }
      }

      // Create enhanced settings with fallbacks from profile data
      const settingsWithDefaults: OptimizedSiteSettings = {
        site_name: siteSettings.site_name || profileData?.name || 'Chinmay Kumar Panda',
        site_description: siteSettings.site_description || profileData?.bio || 'Full Stack Developer & AI Enthusiast',
        site_logo: siteSettings.site_logo || profileData?.profile_image || '/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png',
        site_favicon: siteSettings.site_favicon || profileData?.profile_image || '/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png',
        social_email: siteSettings.social_email || profileData?.email || 'chinmaykumarpanda004@gmail.com',
        ...siteSettings
      };

      // Add social links from social_links table
      if (socialData) {
        socialData.forEach(social => {
          const key = `social_${social.platform.toLowerCase()}`;
          if (!settingsWithDefaults[key]) {
            settingsWithDefaults[key] = social.url;
          }
        });
      }

      // Add default social links if none exist
      if (!settingsWithDefaults.social_github) {
        settingsWithDefaults.social_github = 'https://github.com/chinmaykumarpanda';
      }
      if (!settingsWithDefaults.social_linkedin) {
        settingsWithDefaults.social_linkedin = 'https://linkedin.com/in/chinmaykumarpanda';
      }
      
      setSettings(settingsWithDefaults);
      console.log('Site settings processed:', settingsWithDefaults);
      
    } catch (error: any) {
      console.error('Error fetching site settings:', error);
      setError(error.message || 'Failed to fetch site settings');
      
      if (retryCount < 2) {
        console.log(`Retrying fetch settings (attempt ${retryCount + 1})`);
        setTimeout(() => fetchSettings(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      // Enhanced fallback values
      setSettings({
        site_name: 'Chinmay Kumar Panda',
        site_description: 'Full Stack Developer & AI Enthusiast',
        site_logo: '/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png',
        site_favicon: '/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png',
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
          table: "site_settings"
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
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "user_profile"
        },
        (payload) => {
          console.log('User profile real-time update:', payload);
          
          modernConnectionManager.debounce('profile-settings-realtime-update', () => {
            if (mounted) {
              fetchSettings();
            }
          }, 1500);
        }
      )
      .subscribe((status) => {
        console.log(`Site settings channel ${newChannelId} status:`, status);
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
