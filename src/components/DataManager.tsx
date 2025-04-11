import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage?: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
  };
}

export interface SkillData {
  name: string;
  category: string;
  level: number;
}

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  github?: string;
  demo?: string;
}

export interface CertificationData {
  title: string;
  issuer: string;
  date: string;
  credential: string;
  link?: string;
  logo: string;
}

interface PortfolioData {
  user: UserData;
  skills: SkillData[];
  projects: ProjectData[];
  certifications: CertificationData[];
}

interface DataContextType {
  data: PortfolioData;
  updateUserData: (userData: Partial<UserData>) => void;
  updateSkill: (index: number, skill: SkillData) => void;
  addSkill: (skill: SkillData) => void;
  removeSkill: (index: number) => void;
  updateProject: (index: number, project: ProjectData) => void;
  addProject: (project: ProjectData) => void;
  removeProject: (id: number) => void;
  updateCertification: (index: number, certification: CertificationData) => void;
  addCertification: (certification: CertificationData) => void;
  removeCertification: (index: number) => void;
  fetchPortfolioData: () => Promise<void>;
  isLoading: boolean;
}

const defaultData: PortfolioData = {
  user: {
    name: "Chinmay Kumar Panda",
    title: "Software Developer | Python | AI | JavaScript",
    email: "chinmaykumarpanda004@gmail.com",
    phone: "+91 7815014638",
    location: "Bhubaneswar, Odisha, India",
    bio: "Aspiring software developer with expertise in Python, JavaScript, and AI. Passionate about building scalable applications and leveraging AI tools to improve productivity.",
    profileImage: "/lovable-uploads/78295e37-4b4d-4900-b613-21ed6626ab3f.png",
    social: {
      github: "https://github.com/chinmaykumarpanda",
      linkedin: "https://linkedin.com/in/chinmay-kumar-panda",
      twitter: "#",
      instagram: "#",
      facebook: "#"
    }
  },
  skills: [
    { name: "Python", category: "Programming Languages", level: 90 },
    { name: "JavaScript", category: "Programming Languages", level: 85 },
    { name: "Java", category: "Programming Languages", level: 75 },
    { name: "C", category: "Programming Languages", level: 70 },
    { name: "MySQL", category: "Databases", level: 80 },
    { name: "Firebase", category: "Databases", level: 75 },
    { name: "MongoDB", category: "Databases", level: 70 },
    { name: "HTML", category: "Web Development", level: 95 },
    { name: "CSS", category: "Web Development", level: 90 },
    { name: "React.js", category: "Web Development", level: 85 },
    { name: "Node.js", category: "Web Development", level: 80 },
    { name: "Git", category: "Tools & Platforms", level: 85 },
    { name: "VS Code", category: "Tools & Platforms", level: 95 },
    { name: "Data Structures", category: "Technical Skills", level: 85 },
    { name: "Algorithms", category: "Technical Skills", level: 80 },
    { name: "AI Prompting", category: "AI & ML", level: 90 },
    { name: "OpenAI/Gemini APIs", category: "AI & ML", level: 85 },
    { name: "Machine Learning", category: "AI & ML", level: 75 },
    { name: "Team Leadership", category: "Soft Skills", level: 90 },
    { name: "Communication", category: "Soft Skills", level: 85 },
  ],
  projects: [
    {
      id: 1,
      title: "AI-Powered Symptom Checker",
      description: "Developed an AI-powered symptom checker that analyzes user health data and predicts potential diseases using Python, AI, ML, and Gemini AI.",
      technologies: ["Python", "AI", "ML", "Gemini AI"],
      image: "/lovable-uploads/84ae8bec-4c2f-4a49-94cf-34673064b572.png",
      github: "https://github.com/chinmaykumarpanda/ai-symptom-checker",
    },
    {
      id: 2,
      title: "Coding Ninjas Platform",
      description: "Contributed to the Coding Ninjas developer club platform, organizing workshops and hackathons for students.",
      technologies: ["React", "Node.js", "MongoDB", "JavaScript"],
      image: "/lovable-uploads/1480455c-5be4-41bc-891a-58010ebc836f.png",
      github: "https://github.com/chinmaykumarpanda/coding-ninjas",
      demo: "https://coding-ninjas.com",
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "My personal portfolio website showcasing my projects, skills, and experience. Built with modern web technologies.",
      technologies: ["React", "Tailwind CSS", "TypeScript"],
      image: "/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png",
      github: "https://github.com/chinmaykumarpanda/portfolio",
      demo: "#",
    },
  ],
  certifications: [
    {
      title: "Crash Course on Python",
      issuer: "Google",
      date: "Jun 2024",
      credential: "JA55X9WMWGYK",
      link: "https://coursera.org/verify/JA55X9WMWGYK",
      logo: "/lovable-uploads/f9f301cf-7ee5-4609-845e-2f2afc316a9a.png",
    },
    {
      title: "Python for Data Science",
      issuer: "IBM",
      date: "In Progress",
      credential: "In Progress",
      logo: "/lovable-uploads/bb075ae5-f91f-43e6-b800-4ad15066260c.png",
    },
    {
      title: "Microsoft Cybersecurity Analyst",
      issuer: "Microsoft",
      date: "In Progress",
      credential: "In Progress",
      logo: "/lovable-uploads/84ae8bec-4c2f-4a49-94cf-34673064b572.png",
    },
  ]
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fetchPortfolioData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      // Fetch social links
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*')
        .eq('profile_id', user.id);
      
      if (socialError) throw socialError;
      
      // Fetch skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .eq('profile_id', user.id);
      
      if (skillsError) throw skillsError;
      
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', user.id);
      
      if (projectsError) throw projectsError;
      
      // Fetch certifications
      const { data: certificationsData, error: certificationsError } = await supabase
        .from('certifications')
        .select('*')
        .eq('profile_id', user.id);
      
      if (certificationsError) throw certificationsError;
      
      // Process social links
      const socialLinks = {
        github: socialData?.find(link => link.platform === 'github')?.url || '',
        linkedin: socialData?.find(link => link.platform === 'linkedin')?.url || '',
        twitter: socialData?.find(link => link.platform === 'twitter')?.url || '',
        instagram: socialData?.find(link => link.platform === 'instagram')?.url || '',
        facebook: socialData?.find(link => link.platform === 'facebook')?.url || '',
      };
      
      // Update state with fetched data
      if (profileData) {
        setData(prev => ({
          ...prev,
          user: {
            name: profileData.name || prev.user.name,
            title: profileData.title || prev.user.title,
            email: profileData.email || prev.user.email,
            phone: profileData.phone || prev.user.phone,
            location: profileData.location || prev.user.location,
            bio: profileData.bio || prev.user.bio,
            profileImage: profileData.profile_image || prev.user.profileImage,
            social: socialLinks
          },
          skills: skillsData?.length ? skillsData.map(skill => ({
            name: skill.name,
            category: skill.category,
            level: skill.level
          })) : prev.skills,
          projects: projectsData?.length ? projectsData.map((project, index) => ({
            id: index + 1,
            title: project.title,
            description: project.description,
            technologies: project.technologies || [],
            image: project.image_url || '',
            github: project.github_url,
            demo: project.demo_url
          })) : prev.projects,
          certifications: certificationsData?.length ? certificationsData.map(cert => ({
            title: cert.title,
            issuer: cert.issuer,
            date: cert.date,
            credential: cert.credential || '',
            link: cert.link,
            logo: cert.logo_url || ''
          })) : prev.certifications
        }));
      }
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
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
    fetchPortfolioData();
  }, [user?.id]);
  
  const updateUserData = (userData: Partial<UserData>) => {
    setData(prev => ({
      ...prev,
      user: { ...prev.user, ...userData }
    }));
  };
  
  const updateSkill = (index: number, skill: SkillData) => {
    const skills = [...data.skills];
    skills[index] = skill;
    setData(prev => ({ ...prev, skills }));
  };
  
  const addSkill = (skill: SkillData) => {
    setData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
  };
  
  const removeSkill = (index: number) => {
    const skills = [...data.skills];
    skills.splice(index, 1);
    setData(prev => ({ ...prev, skills }));
  };
  
  const updateProject = (index: number, project: ProjectData) => {
    const projects = [...data.projects];
    projects[index] = project;
    setData(prev => ({ ...prev, projects }));
  };
  
  const addProject = (project: ProjectData) => {
    const newId = Math.max(...data.projects.map(p => p.id), 0) + 1;
    setData(prev => ({ 
      ...prev, 
      projects: [...prev.projects, { ...project, id: newId }] 
    }));
  };
  
  const removeProject = (id: number) => {
    const projects = data.projects.filter(project => project.id !== id);
    setData(prev => ({ ...prev, projects }));
  };
  
  const updateCertification = (index: number, certification: CertificationData) => {
    const certifications = [...data.certifications];
    certifications[index] = certification;
    setData(prev => ({ ...prev, certifications }));
  };
  
  const addCertification = (certification: CertificationData) => {
    setData(prev => ({ 
      ...prev, 
      certifications: [...prev.certifications, certification] 
    }));
  };
  
  const removeCertification = (index: number) => {
    const certifications = [...data.certifications];
    certifications.splice(index, 1);
    setData(prev => ({ ...prev, certifications }));
  };
  
  return (
    <DataContext.Provider value={{
      data,
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
