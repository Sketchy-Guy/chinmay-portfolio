
import { CheckCircle, Award, Calendar, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AboutEntry {
  id: string;
  order?: number;
  type?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  period?: string;
}

const About = () => {
  const [educationEntries, setEducationEntries] = useState<AboutEntry[]>([]);
  const [experienceEntries, setExperienceEntries] = useState<AboutEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('about');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data, error } = await supabase
          .from('about_me')
          .select('*')
          .order('order', { ascending: true });

        if (error) {
          console.error('Error fetching about data:', error);
          return;
        }

        if (data) {
          const education = data.filter(entry => entry.type === 'education');
          const experience = data.filter(entry => entry.type === 'experience');
          
          setEducationEntries(education);
          setExperienceEntries(experience);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const renderEntries = (entries: AboutEntry[], borderColor: string, icon: React.ReactNode) => {
    if (entries.length === 0) {
      return (
        <div className="glass-card p-6">
          <p className="text-gray-400">No entries available</p>
        </div>
      );
    }

    return entries.map((entry, index) => (
      <div 
        key={entry.id} 
        className={`glass-card-hover p-6 relative overflow-hidden group ${isVisible ? 'reveal-stagger active' : 'reveal-stagger'}`}
        style={{ animationDelay: `${index * 0.2}s` }}
      >
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${borderColor}`}></div>
        
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-portfolio-purple group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          
          <div className="flex-1 space-y-2">
            <h4 className="text-xl font-semibold text-white group-hover:text-portfolio-teal transition-colors duration-300">
              {entry.title}
            </h4>
            <p className="text-gray-300 font-medium">{entry.subtitle}</p>
            
            {entry.period && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                {entry.period}
              </div>
            )}
            
            {entry.description && (
              <div className="mt-4 space-y-2">
                {entry.description.split('\n').map((line, lineIndex) => (
                  <div key={lineIndex} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-portfolio-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-portfolio-purple/5 to-portfolio-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      </div>
    ));
  };

  if (isLoading) {
    return (
      <section id="about" className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-12">
            <div className="loading-shimmer w-64 h-8 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-to-r from-portfolio-purple/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-gradient-to-l from-portfolio-teal/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl mx-auto text-center mb-20 ${isVisible ? 'reveal active' : 'reveal'}`}>
          <h2 className="section-title">About Me</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            I'm a passionate and results-driven software developer specializing in Python, 
            JavaScript, and AI development. Currently pursuing my B.Tech in Computer Science 
            at Nalanda Institute of Technology, Bhubaneswar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Education Section */}
          <div className="space-y-8">
            <div className={`text-center lg:text-left ${isVisible ? 'reveal active' : 'reveal'}`} style={{ animationDelay: '0.2s' }}>
              <h3 className="text-3xl font-bold mb-8 flex items-center justify-center lg:justify-start gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-portfolio-purple to-purple-600 text-white">
                  <Award className="w-6 h-6" />
                </div>
                <span className="gradient-text">Education</span>
              </h3>
            </div>
            <div className="space-y-6">
              {renderEntries(educationEntries, 'from-portfolio-purple to-purple-600', <Award className="w-5 h-5" />)}
            </div>
          </div>
          
          {/* Experience Section */}
          <div className="space-y-8">
            <div className={`text-center lg:text-left ${isVisible ? 'reveal active' : 'reveal'}`} style={{ animationDelay: '0.4s' }}>
              <h3 className="text-3xl font-bold mb-8 flex items-center justify-center lg:justify-start gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-portfolio-teal to-cyan-600 text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="gradient-text">Professional Experience</span>
              </h3>
            </div>
            <div className="space-y-6">
              {renderEntries(experienceEntries, 'from-portfolio-teal to-cyan-600', <MapPin className="w-5 h-5" />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
