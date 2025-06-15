
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ContactMessagesManager } from "@/components/admin/ContactMessagesManager";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { TimelineManager } from "@/components/admin/TimelineManager";
import { forceAdminAccess } from '@/utils/auth';
import { supabase } from "@/integrations/supabase/client";

// Interface for admin stats
interface AdminStats {
  totalProjects: number;
  totalSkills: number;
  totalCertifications: number;
  contactMessages: number;
  pageViews: number;
  lastLogin: string;
}

const Admin = () => {
  const { isAdmin, user, isLoading, signOut, checkAdminStatus } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Force check admin status on load
  useEffect(() => {
    const checkAccess = async () => {
      if (!isLoading && user) {
        console.log("Admin page loaded. User:", user.email);
        console.log("Current admin status:", isAdmin);
        
        // For our special admin email, force admin access
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

  // Fetch admin dashboard statistics
  useEffect(() => {
    const fetchAdminStats = async () => {
      if (!isAdmin || !user) return;

      try {
        // Fetch various statistics
        const [projectsRes, skillsRes, certsRes, messagesRes, analyticsRes] = await Promise.all([
          supabase.from('projects').select('id', { count: 'exact' }),
          supabase.from('skills').select('id', { count: 'exact' }),
          supabase.from('certifications').select('id', { count: 'exact' }),
          supabase.from('contact_messages').select('id', { count: 'exact' }),
          supabase.from('analytics_data').select('id', { count: 'exact' }).eq('event_type', 'page_view')
        ]);

        setAdminStats({
          totalProjects: projectsRes.count || 0,
          totalSkills: skillsRes.count || 0,
          totalCertifications: certsRes.count || 0,
          contactMessages: messagesRes.count || 0,
          pageViews: analyticsRes.count || 0,
          lastLogin: new Date().toLocaleString()
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchAdminStats();
  }, [isAdmin, user]);

  // Loading state
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
            <div className="w-16 h-16 border-4 border-t-[#00d4ff] border-r-transparent border-b-[#ff006e] border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl text-[#00d4ff] font-mono">Loading admin matrix...</p>
          <p className="text-gray-400 mt-2">Accessing neural networks</p>
        </motion.div>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    console.log("No user found, redirecting to login");
    navigate('/login');
    return null;
  }

  // Access denied screen
  if (adminCheckComplete && !isAdmin) {
    console.log("User is not admin, showing access denied page");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0f23] via-red-900/20 to-[#0f0f23] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/10 to-transparent"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 relative z-10"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 font-mono mb-4">
            ACCESS DENIED
          </h1>
          <p className="text-gray-300 mt-2 max-w-md mx-auto text-lg">
            You are not authorized to access the admin neural network. 
            Administrative privileges required.
          </p>
          {user && (
            <p className="text-sm text-gray-500 mt-4">
              Identity: {user.email}
            </p>
          )}
        </motion.div>
        
        <div className="flex gap-4 relative z-10">
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-3"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
          <Button 
            onClick={signOut}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Admin dashboard component
  const AdminDashboard = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#ff006e] font-mono mb-2">
          Admin Control Center
        </h2>
        <p className="text-gray-400">
          Welcome back, {user?.email}. System status: All networks operational.
        </p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Projects", value: adminStats?.totalProjects || 0, icon: Briefcase, color: "from-[#00d4ff] to-blue-500" },
          { title: "Skills", value: adminStats?.totalSkills || 0, icon: Code, color: "from-emerald-500 to-teal-500" },
          { title: "Certifications", value: adminStats?.totalCertifications || 0, icon: Award, color: "from-orange-500 to-yellow-500" },
          { title: "Messages", value: adminStats?.contactMessages || 0, icon: MessageSquare, color: "from-[#ff006e] to-rose-500" },
          { title: "Page Views", value: adminStats?.pageViews || 0, icon: TrendingUp, color: "from-violet-500 to-purple-500" },
          { title: "System", value: "Online", icon: Activity, color: "from-green-500 to-emerald-500", isStatus: true }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-[#0f0f23]/90 to-[#1a1a2e]/90 backdrop-blur-xl border border-gray-700/50 p-6 hover:scale-105 transition-all duration-300 hover:border-[#00d4ff]/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">
                    {stat.isStatus ? stat.value : Number(stat.value).toLocaleString()}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-[#0f0f23]/90 to-[#1a1a2e]/90 backdrop-blur-xl border border-gray-700/50 p-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00d4ff]" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Add Project", tab: "projects", icon: Briefcase, color: "from-[#00d4ff] to-blue-500" },
              { label: "Manage Skills", tab: "skills", icon: Code, color: "from-emerald-500 to-teal-500" },
              { label: "View Messages", tab: "messages", icon: MessageSquare, color: "from-[#ff006e] to-rose-500" },
              { label: "Timeline", tab: "timeline", icon: Calendar, color: "from-purple-500 to-violet-500" }
            ].map((action) => (
              <Button
                key={action.label}
                onClick={() => setActiveTab(action.tab)}
                className={`h-20 flex flex-col gap-2 bg-gradient-to-r ${action.color} hover:scale-105 transition-all duration-300 border-0 shadow-lg`}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Enhanced sidebar navigation items
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-[#00d4ff]' },
    { id: 'profile', label: 'Profile', icon: User, color: 'text-blue-400' },
    { id: 'skills', label: 'Skills', icon: Code, color: 'text-emerald-400' },
    { id: 'projects', label: 'Projects', icon: Briefcase, color: 'text-purple-400' },
    { id: 'timeline', label: 'Timeline', icon: Calendar, color: 'text-orange-400' },
    { id: 'certifications', label: 'Certifications', icon: Award, color: 'text-yellow-400' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, color: 'text-[#ff006e]' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-400' },
  ];

  // Main admin panel render
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] relative overflow-hidden"
    >
      {/* Enhanced animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/10 to-transparent"></div>
      </div>
      
      {/* Top header */}
      <header className="bg-gradient-to-r from-[#0f0f23]/80 to-[#1a1a2e]/80 backdrop-blur-xl border-b border-gray-800/50 relative z-20">
        <div className="container mx-auto flex justify-between items-center p-4">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden bg-transparent hover:bg-white/10 p-2"
              size="sm"
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </Button>
            <Shield className="w-8 h-8 text-[#00d4ff]" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#ff006e] font-mono">
              ADMIN MATRIX
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <span className="text-sm text-gray-400 hidden md:inline-block">
              Neural Link: {user?.email}
            </span>
            <Button 
              variant="ghost" 
              onClick={signOut} 
              className="text-gray-300 hover:text-white hover:bg-white/10 border border-gray-700/50 hover:border-red-500/50"
            >
              <LogOut className="mr-2 h-4 w-4" /> 
              Disconnect
            </Button>
          </motion.div>
        </div>
      </header>
      
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Enhanced Sidebar */}
        <motion.aside 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-[#0f0f23]/80 to-[#1a1a2e]/80 backdrop-blur-xl border-r border-gray-800/50 transition-all duration-300 relative z-10 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}
        >
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-[#00d4ff]/20 to-[#ff006e]/20 text-white shadow-lg border border-[#00d4ff]/30' 
                    : 'hover:bg-white/10 text-gray-400 hover:text-white border border-transparent hover:border-gray-700/50'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-white' : item.color}`} />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {!sidebarCollapsed && activeTab === item.id && (
                  <div className="ml-auto w-2 h-2 bg-[#00d4ff] rounded-full"></div>
                )}
              </motion.button>
            ))}
          </nav>
        </motion.aside>
        
        {/* Main content area */}
        <main className="flex-1 p-6 relative z-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && <AdminDashboard />}
              {activeTab === 'profile' && (
                <Card className="bg-gradient-to-br from-[#0f0f23]/90 to-[#1a1a2e]/90 backdrop-blur-xl border border-gray-700/50 p-6">
                  <ProfileForm />
                </Card>
              )}
              {activeTab === 'skills' && (
                <Card className="bg-gradient-to-br from-[#0f0f23]/90 to-[#1a1a2e]/90 backdrop-blur-xl border border-gray-700/50 p-6">
                  <SkillsManager />
                </Card>
              )}
              {activeTab === 'projects' && (
                <Card className="bg-gradient-to-br from-[#0f0f23]/90 to-[#1a1a2e]/90 backdrop-blur-xl border border-gray-700/50 p-6">
                  <ProjectsManager />
                </Card>
              )}
              {activeTab === 'timeline' && <TimelineManager />}
              {activeTab === 'certifications' && (
                <Card className="bg-gradient-to-br from-[#0f0f23]/90 to-[#1a1a2e]/90 backdrop-blur-xl border border-gray-700/50 p-6">
                  <CertificationsManager />
                </Card>
              )}
              {activeTab === 'messages' && <ContactMessagesManager />}
              {activeTab === 'settings' && <SiteSettingsManager />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default Admin;
