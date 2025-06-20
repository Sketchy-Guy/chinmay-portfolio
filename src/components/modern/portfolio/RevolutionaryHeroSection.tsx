
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail, Download, Sparkles, Code, Zap, Database } from 'lucide-react';
import { usePortfolioData } from '@/contexts/DataContext';
import { Skeleton } from '@/components/ui/skeleton';

const RevolutionaryHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const { data, isLoading } = usePortfolioData();

  const phrases = [
    "Full Stack Developer",
    "AI Integration Specialist", 
    "Neural Network Architect",
    "Digital Innovation Engineer"
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Advanced typing animation with multiple phrases
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
    link.download = `${data?.user?.name?.replace(' ', '_') || 'Portfolio'}_CV.pdf`;
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

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Revolutionary Background Effects */}
      <div className="absolute inset-0 opacity-20 md:opacity-30">
        <div className="absolute top-1/4 left-1/6 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-56 sm:w-72 md:w-80 h-56 sm:h-72 md:h-80 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 bg-pink-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 matrix-rain opacity-10 md:opacity-20"></div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 hidden md:block">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 md:w-4 md:h-4 border border-cyan-400/50 transform rotate-45"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [45, 135, 45],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen">
          {/* Left Side - Profile & Visual Effects */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative order-2 lg:order-1"
          >
            {/* Holographic Profile Container */}
            <div className="relative">
              {/* Profile Image with Revolutionary Effects */}
              {data?.user?.profileImage && (
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 mx-auto mb-6 md:mb-8">
                  {/* Holographic Border Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 p-1 animate-spin-slow">
                    <div className="w-full h-full rounded-full bg-gray-900"></div>
                  </div>
                  
                  {/* Main Profile Image */}
                  <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                    <img
                      src={data.user.profileImage}
                      alt={data.user.name || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                    {/* Scan Line Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent h-6 md:h-8 animate-pulse"></div>
                  </div>
                  
                  {/* Floating Icons */}
                  <motion.div
                    className="absolute -top-2 md:-top-4 -right-2 md:-right-4 w-8 h-8 md:w-12 md:h-12 bg-purple-600 rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Code className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute -bottom-2 md:-bottom-4 -left-2 md:-left-4 w-8 h-8 md:w-12 md:h-12 bg-cyan-600 rounded-full flex items-center justify-center"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Database className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute top-1/2 -right-4 md:-right-8 w-6 h-6 md:w-10 md:h-10 bg-pink-600 rounded-full flex items-center justify-center"
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-3 h-3 md:w-5 md:h-5 text-white" />
                  </motion.div>
                </div>
              )}

              {/* Status Indicators */}
              <div className="absolute top-0 left-0 bg-green-500/80 backdrop-blur-md px-2 md:px-3 py-1 rounded-full text-white text-xs md:text-sm font-orbitron">
                ● ONLINE
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-6 md:space-y-8 order-1 lg:order-2"
          >
            {/* Terminal-Style Header */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-cyan-400/30 rounded-lg p-3 md:p-4 font-mono text-xs md:text-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 ml-2 text-xs md:text-sm">neural_interface.exe</span>
              </div>
              <div className="text-green-400">
                <span className="text-cyan-400">$</span> initialize_developer_profile<br/>
                <span className="text-purple-400">Loading:</span> {data?.user?.name || 'Unknown Developer'}...
              </div>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 md:mb-4 font-orbitron leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400">
                  {data?.user?.name || 'Developer'}
                </span>
              </h1>
              
              {/* Animated Title */}
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-cyan-400 font-orbitron mb-4 md:mb-6 h-8 md:h-12">
                <span className="text-gray-400">{'>'}</span> {typedText}
                <span className="animate-pulse text-purple-400">|</span>
              </div>
            </div>

            {/* Enhanced Bio */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                {data?.user?.bio || 'Crafting digital experiences through the fusion of cutting-edge technology and innovative design. Specializing in neural networks, quantum computing interfaces, and revolutionary web architectures.'}
              </p>
              
              {/* Stats Display */}
              <div className="grid grid-cols-3 gap-2 md:gap-4 py-3 md:py-4">
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400 font-orbitron">5+</div>
                  <div className="text-xs md:text-sm text-gray-400">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-400 font-orbitron">50+</div>
                  <div className="text-xs md:text-sm text-gray-400">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-pink-400 font-orbitron">100+</div>
                  <div className="text-xs md:text-sm text-gray-400">Clients</div>
                </div>
              </div>
            </div>

            {/* Revolutionary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button
                onClick={handleDownloadCV}
                className="cyber-button-advanced px-6 md:px-8 py-3 md:py-4 text-base md:text-lg group relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
              >
                <Download className="mr-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
                Download Neural CV
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
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
                className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg border-2 border-cyan-400/50 bg-transparent hover:bg-cyan-400/10 text-cyan-400 hover:text-white transition-all duration-300"
              >
                <Mail className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Initialize Contact
              </Button>
            </div>

            {/* Social Links with Enhanced Design */}
            <div className="flex gap-3 md:gap-4">
              {[
                { icon: Github, href: data?.user?.social?.github, label: 'GitHub', color: 'purple' },
                { icon: Linkedin, href: data?.user?.social?.linkedin, label: 'LinkedIn', color: 'cyan' },
                { icon: Mail, href: `mailto:${data?.user?.email}`, label: 'Email', color: 'pink' }
              ].filter(social => social.href).map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative w-10 h-10 md:w-14 md:h-14 rounded-lg bg-gradient-to-br from-${social.color}-500/20 to-${social.color}-600/20 backdrop-blur-md border border-${social.color}-400/30 flex items-center justify-center text-${social.color}-400 hover:text-white transition-all duration-300`}
                  whileHover={{ scale: 1.1, rotateY: 180 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <social.icon className="w-4 h-4 md:w-6 md:h-6 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <Button
            onClick={scrollToNext}
            variant="ghost"
            className="text-white hover:text-cyan-400 transition-colors group mb-2"
          >
            <ArrowDown className="w-5 h-5 md:w-6 md:h-6 animate-bounce group-hover:scale-110 transition-transform" />
          </Button>
          <span className="text-gray-400 text-xs md:text-sm opacity-75 hover:opacity-100 transition-opacity font-orbitron">
            Explore Neural Network
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default RevolutionaryHeroSection;
