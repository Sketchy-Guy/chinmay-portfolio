
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Loader2, LogOut, User, Code, Award, Briefcase, AlertTriangle, 
  FileText, BarChart3, Settings, MessageSquare, Shield, Home,
  Activity, Users, TrendingUp, Database, Zap, Calendar, Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { CertificationsManager } from "@/components/admin/CertificationsManager";
import { AboutManager } from "@/components/admin/AboutManager";
import ContactMessagesOptimized from "@/components/admin/ContactMessagesOptimized";
import SiteSettingsManagerEnhanced from "@/components/admin/SiteSettingsManagerEnhanced";
import TimelineManagerOptimized from "@/components/admin/TimelineManagerOptimized";
import { forceAdminAccess } from '@/utils/auth';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface AdminStats {
  totalProjects: number;
  totalSkills: number;
  totalCertifications: number;
  contactMessages: number;
  unreadMessages: number;
  timelineEvents: number;
  pageViews: number;
  lastLogin: string;
}

const AdminEnhanced = () => {
  const { isAdmin, user, isLoading, signOut, checkAdminStatus } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      if (!isLoading && user) {
        console.log("Admin page loaded. User:", user.email);
        console.log("Current admin status:", isAdmin);
        
        if (user.email === 'chinmaykumarpanda004@gmail.com') {
          console.log("Admin page: Detected admin email, forcing access");
          try {
            await forceAdminAccess(user.email);
            await checkAdminStatus();
          } catch (error) {
            console.error("Error forcing admin access:", error);
          }
        }
        
        setAdminCheckComplete(true);
      }
      
      if (!isLoading) {
        setIsInitializing(false);
      }
    };
    
    checkAccess();
  }, [isLoading, user, isAdmin, checkAdminStatus]);

  const fetchAdminStats = async () => {
    if (!isAdmin || !user) return;

    try {
      setIsRefreshingStats(true);
      console.log('Fetching enhanced admin statistics...');

      const [
        projectsRes, 
        skillsRes, 
        certsRes, 
        messagesRes, 
        unreadMessagesRes,
        timelineRes,
        analyticsRes
      ] = await Promise.allSettled([
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('skills').select('id', { count: 'exact' }),
        supabase.from('certifications').select('id', { count: 'exact' }),
        supabase.from('contact_messages').select('id', { count: 'exact' }),
        supabase.from('contact_messages').select('id', { count: 'exact' }).eq('status', 'unread'),
        supabase.from('timeline_events').select('id', { count: 'exact' }),
        supabase.from('analytics_data').select('id', { count: 'exact' }).eq('event_type', 'page_view')
      ]);

      const stats: AdminStats = {
        totalProjects: projectsRes.status === 'fulfilled' ? (projectsRes.value.count || 0) : 0,
        totalSkills: skillsRes.status === 'fulfilled' ? (skillsRes.value.count || 0) : 0,
        totalCertifications: certsRes.status === 'fulfilled' ? (certsRes.value.count || 0) : 0,
        contactMessages: messagesRes.status === 'fulfilled' ? (messagesRes.value.count || 0) : 0,
        unreadMessages: unreadMessagesRes.status === 'fulfilled' ? (unreadMessagesRes.value.count || 0) : 0,
        timelineEvents: timelineRes.status === 'fulfilled' ? (timelineRes.value.count || 0) : 0,
        pageViews: analyticsRes.status === 'fulfilled' ? (analyticsRes.value.count || 0) : 0,
        lastLogin: new Date().toLocaleString()
      };

      setAdminStats(stats);
      console.log('Enhanced admin stats loaded:', stats);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsRefreshingStats(false);
    }
  };

  useEffect(() => {
    if (isAdmin && user) {
      fetchAdminStats();
      
      // Create unique channel names to prevent conflicts
      const projectsChannelId = `admin_projects_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const messagesChannelId = `admin_messages_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timelineChannelId = `admin_timeline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const channels = [
        supabase.channel(projectsChannelId).on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchAdminStats),
        supabase.channel(messagesChannelId).on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, fetchAdminStats),
        supabase.channel(timelineChannelId).on('postgres_changes', { event: '*', schema: 'public', table: 'timeline_events' }, fetchAdminStats)
      ];

      channels.forEach(channel => channel.subscribe());

      return () => {
        console.log('Cleaning up admin dashboard channels');
        channels.forEach(channel => supabase.removeChannel(channel));
      };
    }
  }, [isAdmin, user]);

  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl text-purple-400 font-mono">Initializing admin matrix...</p>
          <p className="text-gray-400 mt-2">Accessing neural networks</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    console.log("No user found, redirecting to login");
    navigate('/login');
    return null;
  }

  if (adminCheckComplete && !isAdmin) {
    console.log("User is not admin, showing access denied page");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0f23] via-red-900/20 to-[#0f0f23] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-red-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10 max-w-md mx-auto p-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <Shield className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-red-400 mb-4 font-orbitron">Access Denied</h1>
          <p className="text-gray-300 mb-6 leading-relaxed">
            You don't have permission to access the admin panel. Please contact the administrator if you believe this is an error.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
            
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard stats cards component
  const StatsCards = () => {
    if (!adminStats) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      );
    }

    const statsData = [
      { title: 'Total Projects', value: adminStats.totalProjects, icon: Code, color: 'from-blue-500 to-blue-600', change: '+2.5%' },
      { title: 'Skills', value: adminStats.totalSkills, icon: Zap, color: 'from-purple-500 to-purple-600', change: '+1.2%' },
      { title: 'Certifications', value: adminStats.totalCertifications, icon: Award, color: 'from-green-500 to-green-600', change: '+0.8%' },
      { title: 'Contact Messages', value: adminStats.contactMessages, icon: MessageSquare, color: 'from-yellow-500 to-yellow-600', change: '+5.2%' },
      { title: 'Unread Messages', value: adminStats.unreadMessages, icon: AlertTriangle, color: 'from-red-500 to-red-600', change: adminStats.unreadMessages > 0 ? '+new' : 'none' },
      { title: 'Timeline Events', value: adminStats.timelineEvents, icon: Calendar, color: 'from-cyan-500 to-cyan-600', change: '+0.3%' },
      { title: 'Page Views', value: adminStats.pageViews, icon: TrendingUp, color: 'from-indigo-500 to-indigo-600', change: '+12.3%' },
      { title: 'Database Status', value: 'Online', icon: Database, color: 'from-emerald-500 to-emerald-600', change: '99.9%' }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-gray-900/95 to-purple-900/20 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-400">{stat.change}</span>
                  <span className="text-gray-400 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23]">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-gray-900/95 to-purple-900/95 backdrop-blur-xl border-b border-purple-500/20 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-purple-400 hover:bg-purple-500/10 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white font-orbitron">Admin Panel</h1>
                  <p className="text-purple-400 text-sm">Neural Command Center</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={fetchAdminStats}
                variant="outline"
                size="sm"
                disabled={isRefreshingStats}
                className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-400"
              >
                <Activity className={`w-4 h-4 mr-2 ${isRefreshingStats ? 'animate-spin' : ''}`} />
                {isRefreshingStats ? 'Syncing...' : 'Refresh'}
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400"
              >
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Button>
              
              <Button
                onClick={() => signOut()}
                variant="outline"
                size="sm"
                className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} lg:w-64 bg-gray-900/50 border-r border-purple-500/20 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <nav className="p-4">
            <div className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'projects', label: 'Projects', icon: Code },
                { id: 'skills', label: 'Skills', icon: Zap },
                { id: 'timeline', label: 'Timeline', icon: Calendar },
                { id: 'certifications', label: 'Certifications', icon: Award },
                { id: 'about', label: 'About', icon: FileText },
                { id: 'messages', label: 'Messages', icon: MessageSquare },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full justify-start transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                      : 'text-gray-400 hover:text-white hover:bg-purple-500/10'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  <span className={sidebarCollapsed ? 'lg:inline hidden' : ''}>{item.label}</span>
                </Button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsContent value="dashboard" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white font-orbitron">Dashboard Overview</h2>
                      <p className="text-gray-400 mt-1">Monitor your portfolio performance and analytics</p>
                    </div>
                  </div>
                  <StatsCards />
                </TabsContent>

                <TabsContent value="profile"><ProfileForm /></TabsContent>
                <TabsContent value="projects"><ProjectsManager /></TabsContent>
                <TabsContent value="skills"><SkillsManager /></TabsContent>
                <TabsContent value="timeline"><TimelineManagerOptimized /></TabsContent>
                <TabsContent value="certifications"><CertificationsManager /></TabsContent>
                <TabsContent value="about"><AboutManager /></TabsContent>
                <TabsContent value="messages"><ContactMessagesOptimized /></TabsContent>
                <TabsContent value="settings"><SiteSettingsManagerEnhanced /></TabsContent>
              </Tabs>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminEnhanced;
