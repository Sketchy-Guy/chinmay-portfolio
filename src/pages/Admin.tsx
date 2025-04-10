
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut, User, Code, Award, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { CertificationsManager } from "@/components/admin/CertificationsManager";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // This function should only run once per component mount
    const checkAuth = async () => {
      try {
        console.log("Admin: Checking authentication");
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("Admin: No session found. Redirecting to login...");
          navigate('/login');
          setAuthChecked(true);
          return;
        }

        console.log("Admin: Session found for user:", session.user.email);
        setSessionUser(session.user);

        // Special case for specific email, automatically grant admin access
        if (session.user.email === 'chinmaykumarpanda004@gmail.com') {
          console.log("Admin: Recognized admin email, granting access.");
          try {
            // Ensure this user is marked as admin in the database
            const { error } = await supabase
              .from('auth_users')
              .upsert({ 
                id: session.user.id,
                is_admin: true
              });
            
            if (error) {
              console.error("Error setting admin status:", error);
              throw error;
            }
            
            setIsAdmin(true);
            setLoading(false);
            setAuthChecked(true);
            return;
          } catch (error) {
            console.error('Error setting admin status:', error);
          }
        }

        // Check if user is admin (for other users)
        console.log("Admin: Checking admin status in database");
        const { data, error } = await supabase
          .from('auth_users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching admin status:", error);
          throw error;
        }
        
        if (!data || !data.is_admin) {
          console.log("Admin: User is not an admin:", data);
          throw new Error('Not authorized');
        }
        
        console.log("Admin: User is an admin:", data);
        setIsAdmin(true);
      } catch (error) {
        console.error("Admin: Authentication error:", error);
        toast({
          title: "Authentication Error",
          description: "You are not authorized to access this page",
          variant: "destructive"
        });
        
        // Only navigate if authentication check is complete
        if (sessionUser) {
          // Don't redirect if already on login page
          if (window.location.pathname !== '/login') {
            navigate('/login');
          }
        }
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    if (!authChecked) {
      checkAuth();
    }
  }, [navigate, toast, authChecked, sessionUser]);

  // Set up auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Admin: Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setSessionUser(null);
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    console.log("Admin: Logging out");
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="h-12 w-12 animate-spin text-portfolio-purple" />
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-portfolio-purple">Access Denied</h1>
          <p className="text-gray-600 mt-2">You are not authorized to access the admin panel.</p>
          {sessionUser && (
            <p className="text-sm text-gray-500 mt-1">Logged in as: {sessionUser.email}</p>
          )}
        </motion.div>
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate('/')}
            className="bg-portfolio-purple hover:bg-portfolio-purple/90"
          >
            Return to Home
          </Button>
          <Button 
            onClick={() => navigate('/login')}
            variant="outline"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
    >
      <header className="bg-portfolio-purple text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-xl font-bold"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Portfolio Admin
          </motion.h1>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className="text-white hover:text-white hover:bg-portfolio-purple/80"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </motion.div>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8 shadow-md">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center">
              <Code className="mr-2 h-4 w-4" /> Skills
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4" /> Projects
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center">
              <Award className="mr-2 h-4 w-4" /> Certifications
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TabsContent value="profile" className="glass-card p-6 shadow-xl">
              <ProfileForm />
            </TabsContent>
            
            <TabsContent value="skills" className="glass-card p-6 shadow-xl">
              <SkillsManager />
            </TabsContent>
            
            <TabsContent value="projects" className="glass-card p-6 shadow-xl">
              <ProjectsManager />
            </TabsContent>
            
            <TabsContent value="certifications" className="glass-card p-6 shadow-xl">
              <CertificationsManager />
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>
    </motion.div>
  );
};

export default Admin;
