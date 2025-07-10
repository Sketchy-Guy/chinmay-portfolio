
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Download, Code, Zap, Database, Mail } from 'lucide-react';
import { usePortfolioData } from '@/contexts/DataContext';
import { useOptimizedSiteSettings } from '@/hooks/modern/useOptimizedSiteSettings';
import { Skeleton } from '@/components/ui/skeleton';
import InteractiveTerminal from '@/components/InteractiveTerminal';
import SocialLinksEnhanced from '@/components/SocialLinksEnhanced';

const RevolutionaryHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const { data, isLoading: dataLoading } = usePortfolioData();
  const { settings, loading: settingsLoading } = useOptimizedSiteSettings();

  const isLoading = dataLoading || settingsLoading;

  const phrases = [
    "Full Stack Developer",
    "AI Integration Specialist", 
    "Software Engineer",
    "Digital Innovation Expert"
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const typePhrase = () => {
      const phrase = phrases[currentPhrase];
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex <= phrase.length) {
          setTypedText(phrase.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            const deleteInterval = setInterval(() => {
              if (currentIndex > 0) {
                setTypedText(phrase.slice(0, currentIndex));
                currentIndex--;
              } else {
                clearInterval(deleteInterval);
                setCurrentPhrase((prev) => (prev + 1) % phrases.length);
              }
            }, 50);
          }, 2000);
        }
      }, 100);
    };

    typePhrase();
  }, [currentPhrase]);

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/path-to-cv.pdf';
    link.download = `${(settings?.site_name || data?.user?.name)?.replace(' ', '_') || 'Portfolio'}_CV.pdf`;
    link.click();
  };

  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      const headerOffset = 100;
      const elementPosition = nextSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Use data from settings or fallback to portfolio data
  const profileImage = settings?.site_logo || data?.user?.profileImage;
  const userName = settings?.site_name || data?.user?.name || 'Chinmay Kumar Panda';
  const userBio = settings?.site_description || data?.user?.bio || 'Passionate full-stack developer specializing in modern web technologies, AI integration, and scalable solutions.';
  const userEmail = settings?.social_email || data?.user?.email;
  const githubUrl = settings?.social_github || data?.user?.social?.github;
  const linkedinUrl = settings?.social_linkedin || data?.user?.social?.linkedin;

  console.log('Hero Section Data:', { 
    profileImage, 
    userName, 
    userBio, 
    userEmail, 
    githubUrl, 
    linkedinUrl,
    settings,
    data: data?.user
  });

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <Skeleton className="h-48 sm:h-56 md:h-64 w-48 sm:w-56 md:w-64 rounded-full mx-auto" />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <Skeleton className="h-12 md:h-16 w-full" />
              <Skeleton className="h-6 md:h-8 w-3/4" />
              <Skeleton className="h-20 md:h-24 w-full" />
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-12 w-full sm:w-32" />
                <Skeleton className="h-12 w-full sm:w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/20 to-indigo-950/30 px-4 sm:px-6 lg:px-8">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-4rem)] py-12 md:py-20">
          
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1 text-center lg:text-left space-y-6 lg:space-y-8"
          >
            {/* Interactive Terminal */}
            <InteractiveTerminal />

            {/* Main Title with Better Typography */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-orbitron leading-tight"
              >
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  {userName?.split(' ')[0] || 'Chinmay'}
                </span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-slate-300 mt-2">
                  {userName?.split(' ').slice(1).join(' ') || 'Kumar Panda'}
                </span>
              </motion.h1>
              
              {/* Dynamic Typing Effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-blue-400 font-orbitron min-h-[2.5rem] flex items-center justify-center lg:justify-start"
              >
                <span className="text-slate-400">{'>'}</span>
                <span className="ml-2">{typedText}</span>
                <span className="animate-pulse text-indigo-400 ml-1">|</span>
              </motion.div>
            </div>

            {/* Enhanced Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              {userBio}
            </motion.p>
            
            {/* Enhanced Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="grid grid-cols-3 gap-6 lg:gap-8 py-6 max-w-md mx-auto lg:mx-0"
            >
              <div className="text-center">
                <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-400 font-orbitron">5+</div>
                <div className="text-sm lg:text-base text-slate-400">Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-indigo-400 font-orbitron">50+</div>
                <div className="text-sm lg:text-base text-slate-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-purple-400 font-orbitron">100+</div>
                <div className="text-sm lg:text-base text-slate-400">Clients</div>
              </div>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                onClick={handleDownloadCV}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white px-8 py-4 text-lg group relative overflow-hidden transition-all duration-300 hover:scale-105 font-orbitron border-0 shadow-2xl shadow-blue-500/25"
              >
                <Download className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                Download Resume
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </Button>
              
              <Button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    const headerOffset = 100;
                    const elementPosition = contactSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                variant="outline"
                className="px-8 py-4 text-lg border-2 border-blue-400/50 bg-slate-900/50 hover:bg-blue-400/10 text-blue-400 hover:text-white transition-all duration-300 font-orbitron backdrop-blur-md"
              >
                <Mail className="mr-3 h-5 w-5" />
                Get In Touch
              </Button>
            </motion.div>

            {/* Enhanced Social Links */}
            <SocialLinksEnhanced />
          </motion.div>

          {/* Right Side - Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="order-1 lg:order-2 mb-8 lg:mb-0"
          >
            <div className="relative flex justify-center">
              {profileImage && (
                <div className="relative w-72 h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
                  {/* Enhanced Border Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-1 animate-spin-slow">
                    <div className="w-full h-full rounded-full bg-slate-950"></div>
                  </div>
                  
                  {/* Main Profile Image */}
                  <div className="absolute inset-3 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                    <img
                      src={profileImage}
                      alt={userName}
                      className="w-full h-full object-cover filter brightness-110 contrast-110"
                      onError={(e) => {
                        console.error('Profile image failed to load:', profileImage);
                        e.currentTarget.src = "/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png";
                      }}
                    />
                  </div>
                  
                  {/* Enhanced Floating Tech Icons */}
                  <motion.div
                    className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-xl"
                    animate={{ rotate: 360, y: [-5, 5, -5] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Code className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-xl"
                    animate={{ rotate: -360, y: [5, -5, 5] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Database className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute top-1/2 -right-8 w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-xl"
                    animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    <Zap className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              )}

              {/* Enhanced Status Indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -top-4 -left-4 bg-gradient-to-r from-green-500 to-emerald-500 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-orbitron shadow-xl border border-green-400/30"
              >
                <span className="animate-pulse">●</span> AVAILABLE FOR WORK
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Professional Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <Button
            onClick={scrollToNext}
            variant="ghost"
            className="text-white hover:text-blue-400 transition-colors group mb-2"
          >
            <ArrowDown className="w-6 h-6 animate-bounce group-hover:scale-110 transition-transform" />
          </Button>
          <span className="text-slate-400 text-sm opacity-75 hover:opacity-100 transition-opacity font-orbitron">
            Explore Portfolio
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default RevolutionaryHeroSection;
