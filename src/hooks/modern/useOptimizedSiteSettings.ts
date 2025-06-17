
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { modernConnectionManager } from "@/utils/modern/connectionManager";

/**
 * Optimized Site Settings Interface
 * Defines the structure for site configuration data
 */
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

/**
 * Optimized Site Settings Hook
 * Manages site configuration with improved error handling and performance
 * Features: Connection pooling, debounced updates, error recovery
 */
export function useOptimizedSiteSettings() {
  const [settings, setSettings] = useState<OptimizedSiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string>('');

  /**
   * Fetch site settings from database with error handling
   * Includes retry logic and fallback values
   */
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

      // Transform data into settings object
      const siteSettings: OptimizedSiteSettings = {};
      
      for (const row of data || []) {
        let processedValue: string | null = null;
        
        try {
          // Handle different value types (string, JSON, etc.)
          if (typeof row.value === "string") {
            processedValue = row.value;
          } else if (row.value !== null) {
            // Try to parse as JSON, fallback to string conversion
            try {
              const parsed = JSON.parse(JSON.stringify(row.value));
              processedValue = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
            } catch {
              processedValue = String(row.value);
            }
          }
          
          siteSettings[row.key] = processedValue;
        } catch (parseError) {
          console.warn(`Error processing setting ${row.key}:`, parseError);
          siteSettings[row.key] = null;
        }
      }
      
      // Set default values if not present
      const settingsWithDefaults: OptimizedSiteSettings = {
        site_name: 'Chinmay Kumar Panda - Portfolio',
        site_description: 'Full Stack Developer & AI Enthusiast',
        social_github: 'https://github.com/chinmaykumarpanda',
        social_linkedin: 'https://linkedin.com/in/chinmaykumarpanda',
        social_email: 'chinmaykumarpanda004@gmail.com',
        ...siteSettings
      };
      
      setSettings(settingsWithDefaults);
      
    } catch (error: any) {
      console.error('Error fetching site settings:', error);
      setError(error.message || 'Failed to fetch site settings');
      
      // Retry logic for transient errors
      if (retryCount < 2 && error.code !== 'PGRST116') {
        console.log(`Retrying fetch settings (attempt ${retryCount + 1})`);
        setTimeout(() => fetchSettings(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      // Set fallback values on persistent errors
      setSettings({
        site_name: 'Chinmay Kumar Panda - Portfolio',
        site_description: 'Full Stack Developer & AI Enthusiast',
        social_github: 'https://github.com/chinmaykumarpanda',
        social_linkedin: 'https://linkedin.com/in/chinmaykumarpanda',
        social_email: 'chinmaykumarpanda004@gmail.com'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a specific setting value
   * @param key - Setting key to update
   * @param value - New value for the setting
   */
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

      // Update local state
      setSettings(prev => ({ ...prev, [key]: value }));
      return true;
      
    } catch (error: any) {
      console.error(`Error updating setting ${key}:`, error);
      setError(`Failed to update ${key}: ${error.message}`);
      return false;
    }
  }, []);

  // Initialize hook and set up real-time subscription
  useEffect(() => {
    let mounted = true;
    
    // Initial fetch
    fetchSettings();

    // Create unique channel for real-time updates
    const newChannelId = modernConnectionManager.createUniqueChannelId('site_settings_optimized');
    setChannelId(newChannelId);
    
    // Set up real-time subscription with debouncing
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
          
          // Debounce updates to prevent loops and excessive calls
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

    // Register channel with connection manager
    modernConnectionManager.registerChannel(newChannelId, channel);

    // Cleanup function
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
