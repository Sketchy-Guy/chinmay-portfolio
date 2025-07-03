
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail, Download, Code, Zap, Database } from 'lucide-react';
import { usePortfolioData } from '@/contexts/DataContext';
import { useOptimizedSiteSettings } from '@/hooks/modern/useOptimizedSiteSettings';
import { Skeleton } from '@/components/ui/skeleton';

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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 lg:pt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Professional Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/6 w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 h-32 sm:h-48 md:h-64 lg:h-80 xl:h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-28 sm:w-40 md:w-56 lg:w-72 xl:w-80 h-28 sm:h-40 md:h-56 lg:h-72 xl:h-80 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)] lg:min-h-screen py-8 lg:py-0">
          {/* Left Side - Profile & Visual Effects */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-2 lg:order-1 flex justify-center lg:justify-start"
          >
            <div className="relative">
              {profileImage && (
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 mx-auto lg:mx-0 mb-4 sm:mb-6 md:mb-8">
                  {/* Professional Border Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-1 animate-spin-slow">
                    <div className="w-full h-full rounded-full bg-slate-900"></div>
                  </div>
                  
                  {/* Main Profile Image */}
                  <div className="absolute inset-2 rounded-full overflow-hidden border-2 sm:border-4 border-white/10 shadow-2xl">
                    <img
                      src={profileImage}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Profile image failed to load:', profileImage);
                        e.currentTarget.src = "/lovable-uploads/a5f88509-5d42-4d11-8b7c-6abe9e64cfd0.png";
                      }}
                    />
                  </div>
                  
                  {/* Professional Floating Icons */}
                  <motion.div
                    className="absolute -top-1 sm:-top-2 md:-top-4 -right-1 sm:-right-2 md:-right-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Code className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute -bottom-1 sm:-bottom-2 md:-bottom-4 -left-1 sm:-left-2 md:-left-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-indigo-600 rounded-full flex items-center justify-center"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Database className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute top-1/2 -right-2 sm:-right-4 md:-right-6 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-purple-600 rounded-full flex items-center justify-center"
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Zap className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
                  </motion.div>
                </div>
              )}

              {/* Professional Status Indicator */}
              <div className="absolute top-0 left-0 bg-green-500/90 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm font-orbitron">
                ● AVAILABLE
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4 sm:space-y-6 md:space-y-8 order-1 lg:order-2 text-center lg:text-left"
          >
            {/* Professional Terminal Header */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-blue-400/20 rounded-lg p-2 sm:p-3 md:p-4 font-mono text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-400 ml-1 sm:ml-2 text-xs sm:text-sm">portfolio.exe</span>
              </div>
              <div className="text-green-400 text-xs sm:text-sm">
                <span className="text-blue-400">$</span> init_developer_profile<br/>
                <span className="text-indigo-400">Loading:</span> {userName?.split(' ')[0] || 'User'}...
              </div>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 font-orbitron leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  {userName}
                </span>
              </h1>
              
              {/* Professional Animated Title */}
              <div className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-blue-400 font-orbitron mb-3 sm:mb-4 md:mb-6 h-6 sm:h-8 md:h-10 lg:h-12">
                <span className="text-slate-400">{'>'}</span> {typedText}
                <span className="animate-pulse text-indigo-400">|</span>
              </div>
            </div>

            {/* Professional Bio */}
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {userBio}
              </p>
              
              {/* Professional Stats Display */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 py-2 sm:py-3 md:py-4 max-w-md mx-auto lg:mx-0">
                <div className="text-center">
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-400 font-orbitron">5+</div>
                  <div className="text-xs sm:text-sm text-slate-400">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-indigo-400 font-orbitron">50+</div>
                  <div className="text-xs sm:text-sm text-slate-400">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-purple-400 font-orbitron">100+</div>
                  <div className="text-xs sm:text-sm text-slate-400">Clients</div>
                </div>
              </div>
            </div>

            {/* Professional Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start">
              <Button
                onClick={handleDownloadCV}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg group relative overflow-hidden transition-all duration-300 hover:scale-105 font-orbitron border-0"
              >
                <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline">Download Resume</span>
                <span className="sm:hidden">Resume</span>
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
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg border-2 border-blue-400/50 bg-transparent hover:bg-blue-400/10 text-blue-400 hover:text-white transition-all duration-300 font-orbitron"
              >
                <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Get In Touch</span>
                <span className="sm:hidden">Contact</span>
              </Button>
            </div>

            {/* Professional Social Links */}
            <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start">
              {[
                { icon: Github, href: githubUrl || settings?.social_github, label: 'GitHub', color: 'blue' },
                { icon: Linkedin, href: linkedinUrl || settings?.social_linkedin, label: 'LinkedIn', color: 'indigo' },
                { icon: Mail, href: userEmail ? `mailto:${userEmail}` : null, label: 'Email', color: 'purple' }
              ].filter(social => social.href).map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-slate-800/60 backdrop-blur-md border border-blue-400/30 flex items-center justify-center text-blue-400 hover:text-white transition-all duration-300 hover:bg-blue-600/20"
                  whileHover={{ scale: 1.1, rotateY: 180 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <social.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Professional Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <Button
            onClick={scrollToNext}
            variant="ghost"
            className="text-white hover:text-blue-400 transition-colors group mb-2"
          >
            <ArrowDown className="w-5 h-5 md:w-6 md:h-6 animate-bounce group-hover:scale-110 transition-transform" />
          </Button>
          <span className="text-slate-400 text-xs md:text-sm opacity-75 hover:opacity-100 transition-opacity font-orbitron">
            Explore Portfolio
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default RevolutionaryHeroSection;
