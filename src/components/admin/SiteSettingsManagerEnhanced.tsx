
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, RefreshCw, AlertCircle, Upload, Image, Globe } from 'lucide-react';
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

// Helper for uploading images to supabase storage
async function uploadSiteAsset(file: File, key: string): Promise<string | null> {
  if (!file) return null;
  
  try {
    const filename = `${key}_${Date.now()}_${file.name.replace(/[^\w.]/g, '')}`;
    const { data, error } = await supabase.storage
      .from("site-assets")
      .upload(filename, file, { upsert: true });
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from("site-assets")
      .getPublicUrl(filename);
    
    return urlData?.publicUrl ?? null;
  } catch (error: any) {
    console.error('Upload error:', error);
    throw error;
  }
}

const SiteSettingsManagerEnhanced = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [formData, setFormData] = useState<SettingFormData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');

      if (error) throw error;

      setSettings(data || []);
      
      const formDataObj: SettingFormData = {};
      (data || []).forEach(setting => {
        try {
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
      await fetchSettings();
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(`Failed to save settings: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>, key: string) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    setUploadingKey(key);
    try {
      const url = await uploadSiteAsset(file, key);
      if (url) {
        handleChange(key, url);
        toast.success(`Uploaded ${key} successfully`);
      }
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`);
    }
    setUploadingKey(null);
  }

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel(`site-settings-admin-${Math.random().toString(36).substr(2, 9)}`)
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

  const renderSettingInput = (setting: SiteSetting) => {
    const value = formData[setting.key];
    const key = setting.key;

    if (typeof value === 'boolean' || key.includes('enabled') || key.includes('visible')) {
      return (
        <div className="flex items-center space-x-3">
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => handleChange(key, checked)}
            className="data-[state=checked]:bg-purple-600"
          />
          <span className="text-sm text-gray-300">
            {Boolean(value) ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      );
    }

    if (key.includes('url') || key.includes('link')) {
      return (
        <Input
          type="url"
          value={value || ''}
          onChange={(e) => handleChange(key, e.target.value)}
          placeholder="https://example.com"
          className="bg-gray-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400"
        />
      );
    }

    if (key.includes('email')) {
      return (
        <Input
          type="email"
          value={value || ''}
          onChange={(e) => handleChange(key, e.target.value)}
          placeholder="email@example.com"
          className="bg-gray-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400"
        />
      );
    }

    if (key.includes('description') || key.includes('bio') || key.includes('about')) {
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => handleChange(key, e.target.value)}
          rows={3}
          placeholder="Enter description..."
          className="bg-gray-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400"
        />
      );
    }

    return (
      <Input
        value={value || ''}
        onChange={(e) => handleChange(key, e.target.value)}
        placeholder={`Enter ${setting.key.replace(/_/g, ' ')}`}
        className="bg-gray-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400"
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
        <div className="grid gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-700/30 h-32 rounded-xl"></div>
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
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            {settings.length} settings
          </Badge>
          {hasChanges && (
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 animate-pulse">
              Unsaved Changes
            </Badge>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={fetchSettings} 
            variant="outline" 
            size="sm" 
            disabled={isLoading}
            className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-400"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={saveSettings} 
            disabled={!hasChanges || isSaving}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0"
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

      <div className="grid gap-6">
        {settings.length === 0 ? (
          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardContent className="p-8 text-center">
              <Settings className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-400">No site settings configured</p>
            </CardContent>
          </Card>
        ) : (
          settings.map((setting) => (
            <Card key={setting.id} className="bg-gradient-to-br from-gray-900/95 to-purple-900/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {setting.key.includes('logo') || setting.key.includes('favicon') ? (
                      <Image className="w-5 h-5 text-purple-400" />
                    ) : setting.key.includes('url') || setting.key.includes('link') ? (
                      <Globe className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Settings className="w-5 h-5 text-purple-400" />
                    )}
                    <span className="capitalize">{setting.key.replace(/_/g, " ")}</span>
                  </div>
                  {(setting.key === "site_logo" || setting.key === "site_favicon") && formData[setting.key] && (
                    <img
                      src={formData[setting.key]}
                      alt={setting.key}
                      className="h-10 w-10 rounded-full border-2 border-purple-500 bg-white object-cover shadow-lg"
                    />
                  )}
                </CardTitle>
                {setting.description && (
                  <p className="text-gray-400 text-sm">{setting.description}</p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {(setting.key === "site_logo" || setting.key === "site_favicon") ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 hover:border-purple-400 rounded-lg px-4 py-2 transition-colors">
                          <Upload className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300">Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingKey === setting.key}
                            onChange={e => handleFileChange(e, setting.key)}
                            className="hidden"
                          />
                        </label>
                        {uploadingKey === setting.key && (
                          <div className="flex items-center gap-2 text-purple-400">
                            <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                            <span className="text-sm">Uploading...</span>
                          </div>
                        )}
                      </div>
                      {formData[setting.key] && (
                        <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <img
                            src={formData[setting.key]}
                            alt={setting.key}
                            className="h-12 w-12 rounded-lg border border-green-500/30 object-cover"
                          />
                          <div className="text-green-400 text-sm">
                            File uploaded successfully
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    renderSettingInput(setting)
                  )}
                  <div className="text-xs text-gray-500 flex items-center gap-1 pt-2 border-t border-gray-700/50">
                    <span>Last updated: {new Date(setting.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {hasChanges && (
        <Card className="bg-yellow-500/10 border border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-300">
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
