
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut, User, Code, Award, Briefcase } from "lucide-react";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        // Check if user is admin
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-portfolio-purple" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-portfolio-purple text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Portfolio Admin</h1>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:text-white hover:bg-portfolio-purple/80">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
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
          
          <TabsContent value="profile" className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 text-portfolio-purple">Manage Profile</h2>
            <p className="text-gray-600 mb-4">Your profile management UI will be implemented here.</p>
            <Button>Update Profile</Button>
          </TabsContent>
          
          <TabsContent value="skills" className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 text-portfolio-purple">Manage Skills</h2>
            <p className="text-gray-600 mb-4">Your skills management UI will be implemented here.</p>
            <Button>Add New Skill</Button>
          </TabsContent>
          
          <TabsContent value="projects" className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 text-portfolio-purple">Manage Projects</h2>
            <p className="text-gray-600 mb-4">Your projects management UI will be implemented here.</p>
            <Button>Add New Project</Button>
          </TabsContent>
          
          <TabsContent value="certifications" className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 text-portfolio-purple">Manage Certifications</h2>
            <p className="text-gray-600 mb-4">Your certifications management UI will be implemented here.</p>
            <Button>Add New Certification</Button>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
