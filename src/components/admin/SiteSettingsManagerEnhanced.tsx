
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SiteSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface SettingFormData {
  [key: string]: any;
}

const SiteSettingsManagerEnhanced = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [formData, setFormData] = useState<SettingFormData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch site settings
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');

      if (error) throw error;

      setSettings(data || []);
      
      // Convert settings to form data
      const formDataObj: SettingFormData = {};
      (data || []).forEach(setting => {
        try {
          // Handle different value types
          if (typeof setting.value === 'string') {
            formDataObj[setting.key] = JSON.parse(setting.value);
          } else {
            formDataObj[setting.key] = setting.value;
          }
        } catch {
          formDataObj[setting.key] = setting.value;
        }
      });
      
      setFormData(formDataObj);
      setHasChanges(false);
      console.log('Site settings fetched:', data?.length || 0);
    } catch (error: any) {
      console.error('Error fetching site settings:', error);
      toast.error(`Failed to load settings: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings
  const saveSettings = async () => {
    setIsSaving(true);

    try {
      const updates = Object.entries(formData).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { onConflict: 'key' });

        if (error) throw error;
      }

      toast.success('Settings saved successfully!');
      setHasChanges(false);
      await fetchSettings(); // Refresh data
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(`Failed to save settings: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form changes
  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  // Setup real-time subscription
  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel('site-settings-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'site_settings' 
      }, () => {
        console.log('Site settings changed, refetching...');
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Render different input types based on setting
  const renderSettingInput = (setting: SiteSetting) => {
    const value = formData[setting.key];
    const key = setting.key;

    // Boolean settings
    if (typeof value === 'boolean' || key.includes('enabled') || key.includes('visible')) {
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => handleChange(key, checked)}
          />
          <span className="text-sm text-gray-400">
            {Boolean(value) ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      );
    }

    // URL settings
    if (key.includes('url') || key.includes('link')) {
      return (
        <Input
          type="url"
          value={value || ''}
          onChange={(e) => handleChange(key, e.target.value)}
          placeholder="https://example.com"
        />
      );
    }

    // Email settings
    if (key.includes('email')) {
      return (
        <Input
          type="email"
          value={value || ''}
          onChange={(e) => handleChange(key, e.target.value)}
          placeholder="email@example.com"
        />
      );
    }

    // Long text settings
    if (key.includes('description') || key.includes('bio') || key.includes('about')) {
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => handleChange(key, e.target.value)}
          rows={3}
          placeholder="Enter description..."
        />
      );
    }

    // Default text input
    return (
      <Input
        value={value || ''}
        onChange={(e) => handleChange(key, e.target.value)}
        placeholder={`Enter ${setting.key.replace(/_/g, ' ')}`}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Site Settings</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="loading-skeleton h-20 w-full rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Site Settings</h2>
          <Badge className="bg-blue-500/20 text-blue-400">
            {settings.length} settings
          </Badge>
          {hasChanges && (
            <Badge className="bg-yellow-500/20 text-yellow-400">
              Unsaved Changes
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={fetchSettings} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={saveSettings} 
            disabled={!hasChanges || isSaving}
            className="cyber-button"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6">
        {settings.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No site settings configured</p>
            </CardContent>
          </Card>
        ) : (
          settings.map((setting) => (
            <Card key={setting.id} className="glass-card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
                  <span className="capitalize">{setting.key.replace(/_/g, ' ')}</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </CardTitle>
                {setting.description && (
                  <p className="text-gray-400 text-sm">{setting.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {renderSettingInput(setting)}
                  <div className="text-xs text-gray-500">
                    Last updated: {new Date(setting.updated_at).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Warning about changes */}
      {hasChanges && (
        <Card className="glass-card border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">You have unsaved changes. Remember to save before leaving.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SiteSettingsManagerEnhanced;
