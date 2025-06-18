
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail, Download, Sparkles } from 'lucide-react';
import { usePortfolioData } from '@/contexts/DataContext';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Enhanced Hero Section with Database Integration and Advanced Effects
 * Features: Real data integration, particle animations, holographic effects, typing animation
 */
const EnhancedHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const { data, isLoading } = usePortfolioData();

  // Initialize component visibility for animations
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Typing animation effect for the title
  useEffect(() => {
    if (!data.user.title) return;
    
    const title = data.user.title;
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= title.length) {
        setTypedText(title.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [data.user.title]);

  /**
   * Handle CV download functionality
   */
  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/path-to-cv.pdf';
    link.download = `${data.user.name.replace(' ', '_')}_CV.pdf`;
    link.click();
  };

  /**
   * Scroll to next section smoothly
   */
  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Skeleton className="h-20 w-96 mx-auto mb-6" />
            <Skeleton className="h-8 w-full max-w-2xl mx-auto mb-8" />
            <div className="flex gap-4 justify-center mb-12">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
            <div className="flex gap-6 justify-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Advanced Animated Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Neural Network Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.6, 1, 0.6],
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
        <div className="text-center max-w-4xl mx-auto">
          {/* Profile Image with Holographic Effect */}
          {data.user.profileImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-8"
            >
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={data.user.profileImage}
                  alt={data.user.name}
                  className="w-full h-full rounded-full object-cover border-4 border-purple-500/50 shadow-2xl shadow-purple-500/25"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 animate-pulse"></div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </motion.div>
          )}

          {/* Main heading with holographic animation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-orbitron">
              <span className="holographic-text">{data.user.name || 'Developer'}</span>
            </h1>
          </motion.div>

          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl text-purple-400 font-orbitron mb-4">
              {typedText}
              <span className="animate-pulse">|</span>
            </h2>
          </motion.div>

          {/* Bio/Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {data.user.bio || 'Passionate developer creating innovative digital experiences with cutting-edge technologies'}
          </motion.p>

          {/* Action buttons with enhanced effects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              onClick={handleDownloadCV}
              className="cyber-button px-8 py-4 text-lg group relative overflow-hidden"
            >
              <Download className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Download CV
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-400/20 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </Button>
            <Button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="btn-secondary px-8 py-4 text-lg group"
            >
              <Mail className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Get In Touch
            </Button>
          </motion.div>

          {/* Enhanced Social links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex justify-center gap-6 mb-16"
          >
            {[
              { icon: Github, href: data.user.social.github, label: 'GitHub' },
              { icon: Linkedin, href: data.user.social.linkedin, label: 'LinkedIn' },
              { icon: Mail, href: `mailto:${data.user.email}`, label: 'Email' }
            ].filter(social => social.href).map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-purple-600 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 360 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <social.icon className="w-6 h-6 transition-all duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 rounded-full border-2 border-purple-400/0 group-hover:border-purple-400/50 transition-colors duration-300"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 via-purple-400/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.a>
            ))}
          </motion.div>

          {/* Enhanced Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col items-center"
          >
            <Button
              onClick={scrollToNext}
              variant="ghost"
              className="text-white hover:text-purple-400 transition-colors group"
            >
              <ArrowDown className="w-6 h-6 animate-bounce group-hover:scale-110 transition-transform" />
            </Button>
            <span className="text-gray-400 text-sm mt-2 opacity-75 hover:opacity-100 transition-opacity">
              Explore Journey
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
