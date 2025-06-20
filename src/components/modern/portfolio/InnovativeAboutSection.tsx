
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Award, Calendar, MapPin, Brain, Cpu, Network, Rocket } from 'lucide-react';
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

const InnovativeAboutSection = () => {
  const [educationEntries, setEducationEntries] = useState<AboutEntry[]>([]);
  const [experienceEntries, setExperienceEntries] = useState<AboutEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const neuralPathways = [
    {
      icon: Brain,
      title: 'Neural Architecture',
      description: 'Advanced AI and machine learning implementations',
      gradient: 'from-purple-500 to-pink-500',
      delay: 0
    },
    {
      icon: Cpu,
      title: 'Quantum Processing',
      description: 'High-performance computing and optimization',
      gradient: 'from-cyan-500 to-blue-500',
      delay: 0.2
    },
    {
      icon: Network,
      title: 'Network Synthesis',
      description: 'Distributed systems and cloud architecture',
      gradient: 'from-green-500 to-emerald-500',
      delay: 0.4
    },
    {
      icon: Rocket,
      title: 'Innovation Engine',
      description: 'Cutting-edge technology research and development',
      gradient: 'from-orange-500 to-red-500',
      delay: 0.6
    }
  ];

  const renderNeuralEntries = (entries: AboutEntry[], type: string) => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="neural-card-loading">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex-1 space-y-3">
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
        <Card className="neural-card">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 text-lg">
              Neural pathway under construction...
            </div>
          </CardContent>
        </Card>
      );
    }

    return entries.map((entry, index) => (
      <motion.div
        key={entry.id}
        initial={{ opacity: 0, y: 30, rotateX: -15 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <Card className="neural-card group cursor-pointer">
          <CardContent className="p-6 relative">
            {/* Neural Connection Lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-start gap-6">
              {/* Enhanced Icon Container */}
              <div className={`relative p-4 rounded-xl bg-gradient-to-br ${type === 'education' ? 'from-purple-600 to-pink-600' : 'from-cyan-600 to-blue-600'} group-hover:scale-110 transition-transform duration-300`}>
                {type === 'education' ? (
                  <Award className="w-8 h-8 text-white" />
                ) : (
                  <MapPin className="w-8 h-8 text-white" />
                )}
                
                {/* Floating Particles */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex-1 space-y-3">
                <h4 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300 font-orbitron">
                  {entry.title}
                </h4>
                
                <p className="text-lg text-purple-300 font-medium">
                  {entry.subtitle}
                </p>
                
                {entry.period && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="font-orbitron">{entry.period}</span>
                  </div>
                )}
                
                {entry.description && (
                  <div className="mt-4 space-y-2">
                    {entry.description.split('\n').map((line, lineIndex) => (
                      <div key={lineIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 leading-relaxed">{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
          </CardContent>
        </Card>
      </motion.div>
    ));
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Revolutionary Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-purple-900/20 to-cyan-900/20"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 neural-grid opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/50 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Revolutionary Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-orbitron">
            Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400">Matrix</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Exploring the intersection of human creativity and artificial intelligence through continuous learning and revolutionary development
          </p>
        </motion.div>

        {/* Neural Pathways Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-white font-orbitron">
            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Neural Pathways</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {neuralPathways.map((pathway, index) => (
              <motion.div
                key={pathway.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: pathway.delay }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
              >
                <Card className="neural-pathway-card h-full group cursor-pointer">
                  <CardContent className="p-6 text-center relative">
                    {/* Pathway Icon */}
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-xl bg-gradient-to-br ${pathway.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative`}>
                      <pathway.icon className="w-10 h-10 text-white" />
                      
                      {/* Pulse Effect */}
                      <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 font-orbitron group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                      {pathway.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {pathway.description}
                    </p>
                    
                    {/* Connection Lines */}
                    <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-1/2"></div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience & Education Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Education Neural Network */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold mb-8 flex items-center justify-center lg:justify-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  <Award className="w-8 h-8" />
                </div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-orbitron">
                  Knowledge Matrix
                </span>
              </h3>
            </div>
            <div className="space-y-6">
              {renderNeuralEntries(educationEntries, 'education')}
            </div>
          </motion.div>
          
          {/* Experience Neural Network */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold mb-8 flex items-center justify-center lg:justify-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                  <MapPin className="w-8 h-8" />
                </div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-orbitron">
                  Experience Matrix
                </span>
              </h3>
            </div>
            <div className="space-y-6">
              {renderNeuralEntries(experienceEntries, 'experience')}
            </div>
          </motion.div>
        </div>

        {/* Revolutionary Stats Display */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: '99.9%', label: 'System Uptime', color: 'text-green-400' },
              { number: '∞', label: 'Learning Capacity', color: 'text-purple-400' },
              { number: '24/7', label: 'Neural Activity', color: 'text-cyan-400' },
              { number: '100+', label: 'Successful Deployments', color: 'text-pink-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="group"
              >
                <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2 font-orbitron group-hover:animate-pulse`}>
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm font-orbitron tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InnovativeAboutSection;
