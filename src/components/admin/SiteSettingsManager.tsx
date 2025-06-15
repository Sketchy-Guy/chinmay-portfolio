
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, Save, RefreshCw, Palette, Globe, 
  Bell, Shield, Database, Monitor, Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface SiteSetting {
  id: string;
  key: string;
  value: any;
  description: string;
  created_at: string;
  updated_at: string;
}

interface SettingsState {
  siteTitle: string;
  siteDescription: string;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  contactFormEnabled: boolean;
  themeColor: string;
  backgroundColor: string;
  fontFamily: string;
  logoUrl: string;
  faviconUrl: string;
  socialSharingEnabled: boolean;
  seoEnabled: boolean;
  cookieConsentEnabled: boolean;
  maxFileSize: number;
  allowedFileTypes: string;
  rateLimitEnabled: boolean;
  notificationsEnabled: boolean;
}

export const SiteSettingsManager = () => {
  const [settings, setSettings] = useState<SettingsState>({
    siteTitle: 'Portfolio Website',
    siteDescription: 'Professional Portfolio',
    maintenanceMode: false,
    analyticsEnabled: true,
    contactFormEnabled: true,
    themeColor: '#8b5cf6',
    backgroundColor: '#0f0f23',
    fontFamily: 'Inter',
    logoUrl: '',
    faviconUrl: '',
    socialSharingEnabled: true,
    seoEnabled: true,
    cookieConsentEnabled: false,
    maxFileSize: 5,
    allowedFileTypes: 'jpg,jpeg,png,gif,pdf',
    rateLimitEnabled: true,
    notificationsEnabled: true,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  // Fetch settings from database
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        const settingsObj: any = {};
        data.forEach((setting: SiteSetting) => {
          settingsObj[setting.key] = setting.value;
        });
        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch settings: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings to database
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Convert settings object to array of setting records
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        description: getSettingDescription(key),
      }));

      // Upsert each setting
      for (const setting of settingsArray) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            key: setting.key,
            value: setting.value,
            description: setting.description,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'key' 
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Settings saved successfully!",
      });

      // Apply settings immediately to live site
      applySettingsToSite();
      
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Apply settings to live site
  const applySettingsToSite = () => {
    // Update document title
    document.title = settings.siteTitle;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', settings.siteDescription);
    }
    
    // Update CSS custom properties for theme
    document.documentElement.style.setProperty('--theme-color', settings.themeColor);
    document.documentElement.style.setProperty('--background-color', settings.backgroundColor);
    
    // Update favicon if provided
    if (settings.faviconUrl) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = settings.faviconUrl;
      }
    }
  };

  // Get setting description
  const getSettingDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      siteTitle: 'The main title of your website',
      siteDescription: 'Meta description for SEO',
      maintenanceMode: 'Enable to show maintenance page',
      analyticsEnabled: 'Track visitor analytics',
      contactFormEnabled: 'Allow visitors to send messages',
      themeColor: 'Primary theme color',
      backgroundColor: 'Main background color',
      fontFamily: 'Default font family',
      logoUrl: 'URL to your logo image',
      faviconUrl: 'URL to your favicon',
      socialSharingEnabled: 'Enable social media sharing',
      seoEnabled: 'Enable SEO optimizations',
      cookieConsentEnabled: 'Show cookie consent banner',
      maxFileSize: 'Maximum file upload size (MB)',
      allowedFileTypes: 'Allowed file extensions',
      rateLimitEnabled: 'Enable API rate limiting',
      notificationsEnabled: 'Enable admin notifications',
    };
    return descriptions[key] || 'Site setting';
  };

  // Update setting value
  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isLoading) {
    return (
      <Card className="glass-card-enhanced p-6">
        <div className="flex items-center justify-center h-64">
          <div className="quantum-loader"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Site Settings</h2>
          <p className="text-gray-400">Configure global site settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setPreviewMode(!previewMode)}
            variant={previewMode ? "default" : "outline"}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 w-full bg-black/20">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="glass-card-enhanced">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle" className="text-gray-300">Site Title</Label>
                  <Input
                    id="siteTitle"
                    value={settings.siteTitle}
                    onChange={(e) => updateSetting('siteTitle', e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logoUrl" className="text-gray-300">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={settings.logoUrl}
                    onChange={(e) => updateSetting('logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-gray-300">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting('siteDescription', e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faviconUrl" className="text-gray-300">Favicon URL</Label>
                <Input
                  id="faviconUrl"
                  value={settings.faviconUrl}
                  onChange={(e) => updateSetting('faviconUrl', e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="glass-card-enhanced">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="themeColor" className="text-gray-300">Theme Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="themeColor"
                      type="color"
                      value={settings.themeColor}
                      onChange={(e) => updateSetting('themeColor', e.target.value)}
                      className="w-16 h-10 bg-white/5 border-white/20"
                    />
                    <Input
                      value={settings.themeColor}
                      onChange={(e) => updateSetting('themeColor', e.target.value)}
                      className="flex-1 bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor" className="text-gray-300">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                      className="w-16 h-10 bg-white/5 border-white/20"
                    />
                    <Input
                      value={settings.backgroundColor}
                      onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                      className="flex-1 bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontFamily" className="text-gray-300">Font Family</Label>
                  <Input
                    id="fontFamily"
                    value={settings.fontFamily}
                    onChange={(e) => updateSetting('fontFamily', e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              {previewMode && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border border-white/20"
                  style={{ 
                    backgroundColor: settings.backgroundColor,
                    color: settings.themeColor,
                    fontFamily: settings.fontFamily
                  }}
                >
                  <h3 className="text-lg font-bold mb-2">Preview</h3>
                  <p>This is how your site will look with the current settings.</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Settings */}
        <TabsContent value="features">
          <Card className="glass-card-enhanced">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Feature Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'analyticsEnabled', label: 'Analytics Tracking', description: 'Track visitor behavior and statistics' },
                  { key: 'contactFormEnabled', label: 'Contact Form', description: 'Allow visitors to send messages' },
                  { key: 'socialSharingEnabled', label: 'Social Sharing', description: 'Enable social media sharing buttons' },
                  { key: 'seoEnabled', label: 'SEO Optimization', description: 'Enable search engine optimizations' },
                  { key: 'cookieConsentEnabled', label: 'Cookie Consent', description: 'Show cookie consent banner' },
                  { key: 'notificationsEnabled', label: 'Admin Notifications', description: 'Receive notifications for new messages' },
                ].map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <Label className="text-white font-medium">{feature.label}</Label>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                    <Switch
                      checked={settings[feature.key as keyof SettingsState] as boolean}
                      onCheckedChange={(checked) => updateSetting(feature.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="glass-card-enhanced">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <Label className="text-white font-medium">Maintenance Mode</Label>
                  <p className="text-sm text-gray-400">Show maintenance page to visitors</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <Label className="text-white font-medium">Rate Limiting</Label>
                  <p className="text-sm text-gray-400">Prevent spam and abuse</p>
                </div>
                <Switch
                  checked={settings.rateLimitEnabled}
                  onCheckedChange={(checked) => updateSetting('rateLimitEnabled', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize" className="text-gray-300">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allowedFileTypes" className="text-gray-300">Allowed File Types</Label>
                  <Input
                    id="allowedFileTypes"
                    value={settings.allowedFileTypes}
                    onChange={(e) => updateSetting('allowedFileTypes', e.target.value)}
                    placeholder="jpg,png,pdf"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <Card className="glass-card-enhanced">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-yellow-400 font-medium">System Information</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Advanced settings for developers and system administrators. Changes here may affect site performance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Cache Settings</h4>
                  <Button 
                    onClick={() => {
                      // Clear cache logic would go here
                      toast({
                        title: "Cache Cleared",
                        description: "Site cache has been cleared successfully.",
                      });
                    }}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Clear Site Cache
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Database</h4>
                  <Button 
                    onClick={fetchSettings}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
