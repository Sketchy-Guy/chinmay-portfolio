import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  PortfolioData, 
  UserData, 
  SkillData, 
  ProjectData, 
  CertificationData,
  defaultData
} from '@/types/portfolio';
import { toast } from 'sonner';

interface DataContextType {
  data: PortfolioData;
  error: Error | null;
  updateUserData: (userData: Partial<UserData>) => void;
  updateSkill: (index: number, skill: SkillData) => void;
  addSkill: (skill: SkillData) => void;
  removeSkill: (index: number) => void;
  updateProject: (index: number, project: ProjectData) => void;
  addProject: (project: ProjectData) => void;
  removeProject: (id: string) => void;
  updateCertification: (index: number, certification: CertificationData) => void;
  addCertification: (certification: CertificationData) => void;
  removeCertification: (index: number) => void;
  fetchPortfolioData: () => Promise<void>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  
  const fetchPortfolioData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching public portfolio data...");
      
      // Fetch public profile data (get the first/default profile)
      const { data: profileData, error: profileError } = await supabase
        .from('user_profile')
        .select('*')
        .limit(1)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile data:", profileError);
      }
      
      // Fetch public social links
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*');
      
      if (socialError) {
        console.error("Error fetching social links:", socialError);
      }
      
      // Fetch public skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('level', { ascending: false });
      
      if (skillsError) {
        console.error("Error fetching skills:", skillsError);
      }
      
      // Fetch public projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
      }
      
      // Fetch public certifications
      const { data: certificationsData, error: certificationsError } = await supabase
        .from('certifications')
        .select('*')
        .order('date', { ascending: false });
      
      if (certificationsError) {
        console.error("Error fetching certifications:", certificationsError);
      }
      
      // Convert database data to application format
      const socialLinks = {
        github: socialData?.find(link => link.platform === 'github')?.url || defaultData.user.social.github,
        linkedin: socialData?.find(link => link.platform === 'linkedin')?.url || defaultData.user.social.linkedin,
        twitter: socialData?.find(link => link.platform === 'twitter')?.url || defaultData.user.social.twitter,
        instagram: socialData?.find(link => link.platform === 'instagram')?.url || defaultData.user.social.instagram,
        facebook: socialData?.find(link => link.platform === 'facebook')?.url || defaultData.user.social.facebook,
      };
      
      // Update state with fetched data
      setData({
        user: {
          name: profileData?.name || defaultData.user.name,
          title: profileData?.title || defaultData.user.title,
          email: profileData?.email || defaultData.user.email,
          phone: profileData?.phone || defaultData.user.phone,
          location: profileData?.location || defaultData.user.location,
          bio: profileData?.bio || defaultData.user.bio,
          profileImage: profileData?.profile_image || defaultData.user.profileImage,
          social: socialLinks
        },
        skills: skillsData?.length ? skillsData.map(skill => ({
          name: skill.name,
          category: skill.category,
          level: skill.level
        })) : defaultData.skills,
        projects: projectsData?.length ? projectsData.map(project => ({
          id: project.id.toString(),
          title: project.title,
          description: project.description,
          technologies: project.technologies || [],
          image: project.image_url || '',
          github: project.github_url || '',
          demo: project.demo_url || ''
        })) : defaultData.projects,
        certifications: certificationsData?.length ? certificationsData.map(cert => ({
          id: cert.id.toString(),
          title: cert.title,
          issuer: cert.issuer,
          date: cert.date,
          credential: cert.credential || '',
          link: cert.link || '',
          logo: cert.logo_url || ''
        })) : defaultData.certifications
      });
      
      console.log("Public portfolio data fetched successfully");
    } catch (error: any) {
      console.error("Error fetching portfolio data:", error);
      setError(error instanceof Error ? error : new Error(error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Setup real-time subscriptions for public data
  useEffect(() => {
    console.log("Setting up real-time subscriptions for public data");
    
    const channel = supabase
      .channel('public-portfolio-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_profile' 
      }, () => {
        console.log('Profile data changed, refetching...');
        fetchPortfolioData();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'skills' 
      }, () => {
        console.log('Skills data changed, refetching...');
        fetchPortfolioData();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'projects' 
      }, () => {
        console.log('Projects data changed, refetching...');
        fetchPortfolioData();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'certifications' 
      }, () => {
        console.log('Certifications data changed, refetching...');
        fetchPortfolioData();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'social_links' 
      }, () => {
        console.log('Social links changed, refetching...');
        fetchPortfolioData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPortfolioData]);
  
  useEffect(() => {
    console.log("DataProvider mounted - fetching initial public data");
    fetchPortfolioData();
  }, [fetchPortfolioData]);
  
  const updateUserData = async (userData: Partial<UserData>) => {
    try {
      console.log("Updating user data:", userData);
      setData(prev => ({
        ...prev,
        user: { ...prev.user, ...userData }
      }));
      
      if (!user) {
        throw new Error("You must be logged in to update user data");
      }
      
      const { error: upsertError } = await supabase
        .from('user_profile')
        .upsert({
          id: user.id,
          name: userData.name || data.user.name,
          title: userData.title || data.user.title,
          email: userData.email || data.user.email,
          phone: userData.phone || data.user.phone,
          location: userData.location || data.user.location,
          bio: userData.bio || data.user.bio,
          profile_image: userData.profileImage || data.user.profileImage
        }, { onConflict: 'id' });
      
      if (upsertError) throw upsertError;
      
      if (userData.social) {
        await supabase
          .from('social_links')
          .delete()
          .eq('profile_id', user.id);
        
        const socialLinks = [
          { platform: 'github', url: userData.social.github || '', profile_id: user.id },
          { platform: 'linkedin', url: userData.social.linkedin || '', profile_id: user.id },
          { platform: 'twitter', url: userData.social.twitter || '', profile_id: user.id },
          { platform: 'instagram', url: userData.social.instagram || '', profile_id: user.id },
          { platform: 'facebook', url: userData.social.facebook || '', profile_id: user.id },
        ].filter(link => link.url);
        
        if (socialLinks.length > 0) {
          const { error: socialError } = await supabase
            .from('social_links')
            .insert(socialLinks);
          
          if (socialError) throw socialError;
        }
      }
      
      await fetchPortfolioData();
    } catch (error: any) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update profile: " + error.message);
    }
  };
  
  const updateSkill = async (index: number, skill: SkillData) => {
    try {
      console.log("Updating skill at index:", index, skill);
      const skills = [...data.skills];
      skills[index] = skill;
      setData(prev => ({ ...prev, skills }));
      
      if (!user) throw new Error("You must be logged in to update skills");
      
      const skillToUpdate = data.skills[index];
      const { data: existingSkills, error: fetchError } = await supabase
        .from('skills')
        .select('id')
        .eq('profile_id', user.id)
        .eq('name', skillToUpdate.name);
      
      if (fetchError) throw fetchError;
      
      if (existingSkills && existingSkills.length > 0) {
        const { error } = await supabase
          .from('skills')
          .update({
            name: skill.name,
            category: skill.category,
            level: skill.level,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSkills[0].id);
        
        if (error) throw error;
      }
      
      await fetchPortfolioData();
    } catch (error: any) {
      console.error("Error updating skill:", error);
      toast.error("Failed to update skill: " + error.message);
    }
  };
  
  const addSkill = async (skill: SkillData) => {
    try {
      console.log("Adding new skill:", skill);
      setData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      
      if (!user) throw new Error("You must be logged in to add skills");
      
      const { error } = await supabase
        .from('skills')
        .insert({
          profile_id: user.id,
          name: skill.name,
          category: skill.category,
          level: skill.level
        });
      
      if (error) throw error;
      
      await fetchPortfolioData();
    } catch (error: any) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill: " + error.message);
    }
  };
  
  const removeSkill = async (index: number) => {
    try {
      console.log("Removing skill at index:", index);
      const skillToRemove = data.skills[index];
      const skills = [...data.skills];
      skills.splice(index, 1);
      setData(prev => ({ ...prev, skills }));
      
      if (!user) throw new Error("You must be logged in to remove skills");
      
      const { data: existingSkills, error: fetchError } = await supabase
        .from('skills')
        .select('id')
        .eq('profile_id', user.id)
        .eq('name', skillToRemove.name);
      
      if (fetchError) throw fetchError;
      
      if (existingSkills && existingSkills.length > 0) {
        const { error } = await supabase
          .from('skills')
          .delete()
          .eq('id', existingSkills[0].id);
        
        if (error) throw error;
      }
      
      await fetchPortfolioData();
    } catch (error: any) {
      console.error("Error removing skill:", error);
      toast.error("Failed to remove skill: " + error.message);
    }
  };
  
  const updateProject = async (index: number, project: ProjectData) => {
    try {
      console.log("Updating project at index:", index, project);
      const projects = [...data.projects];
      projects[index] = project;
      setData(prev => ({ ...prev, projects }));
      
      if (!user) throw new Error("You must be logged in to update projects");
      
      const projectToUpdate = data.projects[index];
      console.log(`Attempting to find project "${projectToUpdate.title}" to update`);
      
      const { data: existingProjects, error: fetchError } = await supabase
        .from('projects')
        .select('id')
        .eq('profile_id', user.id)
        .eq('id', projectToUpdate.id);
      
      if (fetchError) throw fetchError;
      
      if (existingProjects && existingProjects.length > 0) {
        console.log(`Found project to update with ID: ${existingProjects[0].id}`);
        
        const { error } = await supabase
          .from('projects')
          .update({
            title: project.title,
            description: project.description,
            technologies: project.technologies,
            github_url: project.github || null,
            demo_url: project.demo || null,
            image_url: project.image || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProjects[0].id);
        
        if (error) throw error;
        
        console.log("Project updated successfully in database");
      } else {
        console.log(`Project with ID ${projectToUpdate.id} not found, creating new one`);
        
        const { error } = await supabase
          .from('projects')
          .insert({
            profile_id: user.id,
            title: project.title,
            description: project.description,
            technologies: project.technologies,
            github_url: project.github || null,
            demo_url: project.demo || null,
            image_url: project.image || null
          });
        
        if (error) throw error;
        
        console.log("New project created successfully in database");
      }
      
      await fetchPortfolioData();
    } catch (error: any) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project: " + error.message);
    }
  };
  
  const addProject = async (project: ProjectData) => {
    try {
      console.log("Adding new project:", project);
      setData(prev => ({ 
        ...prev, 
        projects: [...prev.projects, project] 
      }));
      
      if (!user) throw new Error("You must be logged in to add projects");
      
      const { error } = await supabase
        .from('projects')
        .insert({
          profile_id: user.id,
          title: project.title,
          description: project.description,
          technologies: project.technologies,
          github_url: project.github || null,
          demo_url: project.demo || null,
          image_url: project.image || null
        });
      
      if (error) throw error;
      
      await fetchPortfolioData();
    } catch (error: any) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project: " + error.message);
    }
  };
  
  const removeProject = async (id: string) => {
    try {
      console.log("Removing project with id:", id);
      const projects = data.projects.filter(project => project.id !== id);
      setData(prev => ({ ...prev, projects }));
      
      if (!user) throw new Error("You must be logged in to remove projects");
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchPortfolioData();
    } catch (error: any) {
      console.error("Error removing project:", error);
      toast.error("Failed to delete project: " + error.message);
    }
  };
  
  const updateCertification = async (index: number, certification: CertificationData) => {
    try {
      console.log("Updating certification at index:", index, certification);
      const certifications = [...data.certifications];
      certifications[index] = certification;
      setData(prev => ({ ...prev, certifications }));
      
      if (!user) throw new Error("You must be logged in to update certifications");
      
      const certToUpdate = data.certifications[index];
      const { data: existingCerts, error: fetchError } = await supabase
        .from('certifications')
        .select('id')
        .eq('profile_id', user.id)
        .eq('id', certToUpdate.id);
      
      if (fetchError) throw fetchError;
      
      if (existingCerts && existingCerts.length > 0) {
        const { error } = await supabase
          .from('certifications')
          .update({
            title: certification.title,
            issuer: certification.issuer,
            date: certification.date,
            credential: certification.credential || null,
            link: certification.link || null,
            logo_url: certification.logo || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingCerts[0].id);
        
        if (error) throw error;
      }
      
      await fetchPortfolioData();
    } catch (error: any) {
      console.error("Error updating certification:", error);
      toast.error("Failed to update certification: " + error.message);
    }
  };
  
  const addCertification = async (certification: CertificationData) => {
    try {
      console.log("Adding new certification:", certification);
      setData(prev => ({ 
        ...prev, 
        certifications: [...prev.certifications, certification] 
      }));
      
      if (!user) throw new Error("You must be logged in to add certifications");
      
      const { error } = await supabase
        .from('certifications')
        .insert({
          profile_id: user.id,
          title: certification.title,
          issuer: certification.issuer,
          date: certification.date,
          credential: certification.credential || null,
          link: certification.link || null,
          logo_url: certification.logo || null
        });
      
      if (error) throw error;
      
      await fetchPortfolioData();
    } catch (error: any) {
      console.error("Error adding certification:", error);
      toast.error("Failed to add certification: " + error.message);
    }
  };
  
  const removeCertification = async (index: number) => {
    try {
      console.log("Removing certification at index:", index);
      const certToRemove = data.certifications[index];
      const certifications = [...data.certifications];
      certifications.splice(index, 1);
      setData(prev => ({ ...prev, certifications }));
      
      if (!user) throw new Error("You must be logged in to remove certifications");
      
      const { data: existingCerts, error: fetchError } = await supabase
        .from('certifications')
        .select('id')
        .eq('profile_id', user.id)
        .eq('id', certToRemove.id);
      
      if (fetchError) throw fetchError;
      
      if (existingCerts && existingCerts.length > 0) {
        const { error } = await supabase
          .from('certifications')
          .delete()
          .eq('id', existingCerts[0].id);
        
        if (error) throw error;
      }
      
      await fetchPortfolioData();
    } catch (error: any) {
      console.error("Error removing certification:", error);
      toast.error("Failed to remove certification: " + error.message);
    }
  };
  
  const value: DataContextType = {
    data,
    error,
    updateUserData,
    updateSkill,
    addSkill,
    removeSkill,
    updateProject,
    addProject,
    removeProject,
    updateCertification,
    addCertification,
    removeCertification,
    fetchPortfolioData,
    isLoading,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const usePortfolioData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('usePortfolioData must be used within a DataProvider');
  }
  return context;
};
