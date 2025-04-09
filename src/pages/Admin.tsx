
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut, User, Code, Award, Briefcase, PlusCircle, Trash2, Edit } from "lucide-react";
import { usePortfolioData, UserData, SkillData, ProjectData, CertificationData } from "@/components/DataManager";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { CertificationsManager } from "@/components/admin/CertificationsManager";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data } = usePortfolioData();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        // For this specific email, automatically grant admin access
        if (session.user.email === 'chinmaykumarpanda004@gmail.com') {
          // Ensure this user is marked as admin in the database
          const { error: upsertError } = await supabase
            .from('auth_users')
            .upsert({ 
              id: session.user.id,
              is_admin: true
            });
          
          if (upsertError) {
            console.error('Error setting admin status:', upsertError);
          }
          
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Check if user is admin (for other users)
        const { data, error } = await supabase
          .from('auth_users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error || !data || !data.is_admin) {
          throw new Error('Not authorized');
        }
        
        setIsAdmin(true);
      } catch (error) {
        toast({
          title: "Authentication Error",
          description: "You are not authorized to access this page",
          variant: "destructive"
        });
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleLogout = async () => {
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
    return null; // Will redirect in useEffect
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
