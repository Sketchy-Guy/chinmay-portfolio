
import { useState, useEffect } from 'react';
import { Save, Settings, Upload, Database, Monitor, Download, Trash, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import FileUpload from './FileUpload';

interface SiteSettings {
  [key: string]: any;
}

const SiteSettingsManager = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchSettings();
    
    // Setup real-time subscription
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

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching site settings...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }

      // Convert array to object for easier handling
      const settingsObj: SiteSettings = {};
      if (data) {
        data.forEach(setting => {
          settingsObj[setting.key] = setting.value;
        });
      }

      console.log('Settings fetched:', Object.keys(settingsObj).length, 'settings');
      setSettings(settingsObj);
    } catch (error: any) {
      console.error('Failed to fetch settings:', error);
      toast.error(`Failed to load settings: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      console.log(`Setting ${key} updated successfully`);
    } catch (error: any) {
      console.error(`Error updating setting ${key}:`, error);
      throw error;
    }
  };

  const handleSave = async (key: string, value: any) => {
    setIsSaving(true);
    try {
      await updateSetting(key, value);
      toast.success(`${key} updated successfully!`);
    } catch (error: any) {
      toast.error(`Failed to update ${key}: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (url: string) => {
    await handleSave('site_logo', url);
  };

  const handleFaviconUpload = async (url: string) => {
    await handleSave('site_favicon', url);
  };

  const clearDatabase = async () => {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }

    try {
      setIsRefreshing(true);
      
      // Clear tables in correct order (respecting foreign keys)
      const tables = [
        'contact_messages',
        'analytics_data',
        'achievements',
        'timeline_events',
        'github_stats',
        'certifications',
        'projects',
        'skills',
        'social_links',
        'about_me',
        'site_settings'
      ];

      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

        if (error) {
          console.error(`Error clearing ${table}:`, error);
        }
      }

      toast.success('Database cleared successfully!');
      await fetchSettings(); // Refresh settings
    } catch (error: any) {
      console.error('Error clearing database:', error);
      toast.error(`Failed to clear database: ${error.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportData = async () => {
    try {
      const tables = ['user_profile', 'about_me', 'skills', 'projects', 'certifications', 'social_links', 'timeline_events', 'achievements', 'github_stats', 'site_settings'];
      const exportData: any = {};

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*');

        if (error) {
          console.error(`Error exporting ${table}:`, error);
        } else {
          exportData[table] = data;
        }
      }

      // Download as JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully!');
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(`Failed to export data: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Site Settings</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="loading-skeleton h-32 w-full rounded-xl"></div>
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
        </div>
        <Button 
          onClick={fetchSettings}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                    placeholder="My Portfolio"
                  />
                </div>
                <div>
                  <Label htmlFor="site_tagline">Site Tagline</Label>
                  <Input
                    id="site_tagline"
                    value={settings.site_tagline || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, site_tagline: e.target.value }))}
                    placeholder="Full Stack Developer"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                  placeholder="A brief description of your portfolio..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={() => handleSave('site_name', settings.site_name)}
                disabled={isSaving}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Site Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onUpload={handleLogoUpload}
                  label="Site Logo"
                  accept="image/*"
                  maxSize={2}
                  currentUrl={settings.site_logo}
                />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Favicon</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onUpload={handleFaviconUpload}
                  label="Favicon"
                  accept="image/*"
                  maxSize={1}
                  currentUrl={settings.site_favicon}
                  cropAspectRatio={1}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <Input
                    id="primary_color"
                    type="color"
                    value={settings.primary_color || '#8b5cf6'}
                    onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <Input
                    id="secondary_color"
                    type="color"
                    value={settings.secondary_color || '#06b6d4'}
                    onChange={(e) => setSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="accent_color">Accent Color</Label>
                  <Input
                    id="accent_color"
                    type="color"
                    value={settings.accent_color || '#ec4899'}
                    onChange={(e) => setSettings(prev => ({ ...prev, accent_color: e.target.value }))}
                  />
                </div>
              </div>

              <Button 
                onClick={() => handleSave('brand_colors', {
                  primary: settings.primary_color,
                  secondary: settings.secondary_color,
                  accent: settings.accent_color
                })}
                disabled={isSaving}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Brand Colors
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={settings.meta_title || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="Your Portfolio | Full Stack Developer"
                />
              </div>
              
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={settings.meta_description || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Professional portfolio showcasing my skills and projects..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={settings.meta_keywords || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, meta_keywords: e.target.value }))}
                  placeholder="developer, portfolio, react, javascript"
                />
              </div>

              <Button 
                onClick={() => handleSave('seo_settings', {
                  title: settings.meta_title,
                  description: settings.meta_description,
                  keywords: settings.meta_keywords
                })}
                disabled={isSaving}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save SEO Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={exportData}
                  variant="outline"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All Data
                </Button>
                
                <Button 
                  onClick={clearDatabase}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  disabled={isRefreshing}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Clear Database
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                System Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">Online</div>
                  <div className="text-sm text-gray-400">System Status</div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{Object.keys(settings).length}</div>
                  <div className="text-sm text-gray-400">Settings</div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">v1.0.0</div>
                  <div className="text-sm text-gray-400">Version</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettingsManager;
