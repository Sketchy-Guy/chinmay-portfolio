
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const { toast } = useToast();
  
  const fetchPortfolioData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching portfolio data...");
      
      if (!user) {
        console.log("No user logged in, using default data");
        setIsLoading(false);
        return;
      }
      
      console.log("Fetching data for user:", user.id);
      
      const { data: profileData, error: profileError } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile data:", profileError);
      } else if (profileData) {
        console.log("Successfully fetched profile data:", profileData);
      }
      
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*')
        .eq('profile_id', user.id);
      
      if (socialError) {
        console.error("Error fetching social links:", socialError);
      } else {
        console.log("Successfully fetched social links, count:", socialData?.length);
      }
      
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .eq('profile_id', user.id);
      
      if (skillsError) {
        console.error("Error fetching skills:", skillsError);
      } else {
        console.log("Successfully fetched skills, count:", skillsData?.length);
      }
      
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', user.id);
      
      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
      } else {
        console.log("Successfully fetched projects, count:", projectsData?.length);
      }
      
      const { data: certificationsData, error: certificationsError } = await supabase
        .from('certifications')
        .select('*')
        .eq('profile_id', user.id);
      
      if (certificationsError) {
        console.error("Error fetching certifications:", certificationsError);
      } else {
        console.log("Successfully fetched certifications, count:", certificationsData?.length);
      }
      
      const socialLinks = {
        github: socialData?.find(link => link.platform === 'github')?.url || defaultData.user.social.github,
        linkedin: socialData?.find(link => link.platform === 'linkedin')?.url || defaultData.user.social.linkedin,
        twitter: socialData?.find(link => link.platform === 'twitter')?.url || defaultData.user.social.twitter,
        instagram: socialData?.find(link => link.platform === 'instagram')?.url || defaultData.user.social.instagram,
        facebook: socialData?.find(link => link.platform === 'facebook')?.url || defaultData.user.social.facebook,
      };
      
      setData(prev => ({
        user: {
          name: profileData?.name || prev.user.name,
          title: profileData?.title || prev.user.title,
          email: profileData?.email || prev.user.email,
          phone: profileData?.phone || prev.user.phone,
          location: profileData?.location || prev.user.location,
          bio: profileData?.bio || prev.user.bio,
          profileImage: profileData?.profile_image || prev.user.profileImage,
          social: socialLinks
        },
        skills: skillsData?.length ? skillsData.map(skill => ({
          name: skill.name,
          category: skill.category,
          level: skill.level
        })) : prev.skills,
        projects: projectsData?.length ? projectsData.map(project => ({
          id: project.id.toString(),
          title: project.title,
          description: project.description,
          technologies: project.technologies || [],
          image: project.image_url || '',
          github: project.github_url,
          demo: project.demo_url
        })) : prev.projects,
        certifications: certificationsData?.length ? certificationsData.map(cert => ({
          id: cert.id.toString(),
          title: cert.title,
          issuer: cert.issuer,
          date: cert.date,
          credential: cert.credential || '',
          link: cert.link,
          logo: cert.logo_url || ''
        })) : prev.certifications
      }));
      
      console.log("Portfolio data fetched and updated successfully");
    } catch (error: any) {
      console.error("Error fetching portfolio data:", error);
      setError(error instanceof Error ? error : new Error(error.message || 'Unknown error'));
      toast({
        title: "Error",
        description: "Failed to load portfolio data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    console.log("DataProvider mounted - fetching initial data");
    fetchPortfolioData();
  }, [user?.id]);
  
  const updateUserData = (userData: Partial<UserData>) => {
    console.log("Updating user data:", userData);
    setData(prev => ({
      ...prev,
      user: { ...prev.user, ...userData }
    }));
  };
  
  const updateSkill = (index: number, skill: SkillData) => {
    console.log("Updating skill at index:", index, skill);
    const skills = [...data.skills];
    skills[index] = skill;
    setData(prev => ({ ...prev, skills }));
  };
  
  const addSkill = (skill: SkillData) => {
    console.log("Adding new skill:", skill);
    setData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
  };
  
  const removeSkill = (index: number) => {
    console.log("Removing skill at index:", index);
    const skills = [...data.skills];
    skills.splice(index, 1);
    setData(prev => ({ ...prev, skills }));
  };
  
  const updateProject = (index: number, project: ProjectData) => {
    console.log("Updating project at index:", index, project);
    const projects = [...data.projects];
    projects[index] = project;
    setData(prev => ({ ...prev, projects }));
  };
  
  const addProject = (project: ProjectData) => {
    console.log("Adding new project:", project);
    setData(prev => ({ 
      ...prev, 
      projects: [...prev.projects, project] 
    }));
  };
  
  const removeProject = (id: string) => {
    console.log("Removing project with id:", id);
    const projects = data.projects.filter(project => project.id !== id);
    setData(prev => ({ ...prev, projects }));
  };
  
  const updateCertification = (index: number, certification: CertificationData) => {
    console.log("Updating certification at index:", index, certification);
    const certifications = [...data.certifications];
    certifications[index] = certification;
    setData(prev => ({ ...prev, certifications }));
  };
  
  const addCertification = (certification: CertificationData) => {
    console.log("Adding new certification:", certification);
    setData(prev => ({ 
      ...prev, 
      certifications: [...prev.certifications, certification] 
    }));
  };
  
  const removeCertification = (index: number) => {
    console.log("Removing certification at index:", index);
    const certifications = [...data.certifications];
    certifications.splice(index, 1);
    setData(prev => ({ ...prev, certifications }));
  };
  
  return (
    <DataContext.Provider value={{
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
      isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('usePortfolioData must be used within a DataProvider');
  }
  return context;
};
