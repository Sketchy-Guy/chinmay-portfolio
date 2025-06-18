
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Award, Calendar, MapPin, Code, Palette, Zap, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface AboutEntry {
  id: string;
  order?: number;
  type?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  period?: string;
}

/**
 * Enhanced About Section with Database Integration
 * Features: Dynamic data from database, futuristic design, advanced animations
 */
const EnhancedAboutSection = () => {
  const [educationEntries, setEducationEntries] = useState<AboutEntry[]>([]);
  const [experienceEntries, setExperienceEntries] = useState<AboutEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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

  // Core strengths data with icons and descriptions
  const strengths = [
    {
      icon: Code,
      title: 'Full Stack Development',
      description: 'Expert in modern web technologies and frameworks',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Creating intuitive and beautiful user experiences',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Building fast, scalable, and efficient applications',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Leading projects and mentoring developers',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const renderEntries = (entries: AboutEntry[], borderColor: string, icon: React.ReactNode) => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="futuristic-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (entries.length === 0) {
      return (
        <Card className="futuristic-card">
          <CardContent className="p-6 text-center">
            <p className="text-gray-400">No entries available</p>
          </CardContent>
        </Card>
      );
    }

    return entries.map((entry, index) => (
      <motion.div
        key={entry.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="futuristic-card group cursor-pointer h-full">
          <CardContent className="p-6">
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${borderColor} rounded-l-2xl`}></div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
              
              <div className="flex-1 space-y-2">
                <h4 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300 font-orbitron">
                  {entry.title}
                </h4>
                <p className="text-purple-300 font-medium">{entry.subtitle}</p>
                
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
                        <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </CardContent>
        </Card>
      </motion.div>
    ));
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-900/50 via-purple-900/10 to-gray-900/50 relative overflow-hidden">
      {/* Advanced background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Neural Grid Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">
            About <span className="holographic-text">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mb-8"></div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Discover my journey through education, experience, and the skills that drive innovation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto mb-20">
          {/* Education Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold mb-8 flex items-center justify-center lg:justify-start gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <Award className="w-6 h-6" />
                </div>
                <span className="gradient-text font-orbitron">Education</span>
              </h3>
            </div>
            <div className="space-y-6">
              {renderEntries(educationEntries, 'from-purple-500 to-purple-600', <Award className="w-5 h-5" />)}
            </div>
          </motion.div>
          
          {/* Experience Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold mb-8 flex items-center justify-center lg:justify-start gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="gradient-text font-orbitron">Experience</span>
              </h3>
            </div>
            <div className="space-y-6">
              {renderEntries(experienceEntries, 'from-cyan-500 to-cyan-600', <MapPin className="w-5 h-5" />)}
            </div>
          </motion.div>
        </div>

        {/* Core strengths grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-white font-orbitron">
            Core <span className="holographic-text">Strengths</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {strengths.map((strength, index) => (
              <motion.div
                key={strength.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="futuristic-card h-full group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${strength.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <strength.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 font-orbitron">
                      {strength.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {strength.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistics section with enhanced effects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: '50+', label: 'Projects Completed' },
              { number: '5+', label: 'Years Experience' },
              { number: '100+', label: 'Happy Clients' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-orbitron group-hover:scale-110 transition-transform duration-300">
                  <span className="holographic-text">{stat.number}</span>
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedAboutSection;
