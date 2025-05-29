
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import ParticleSystem from "@/components/effects/ParticleSystem";
import { ThemeProvider, useTheme } from "@/components/effects/ThemeProvider";
import { usePortfolioData } from "@/contexts/DataContext";
import { useMouseTracker } from "@/hooks/useMouseTracker";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const IndexContent = () => {
  const { fetchPortfolioData, isLoading, error, data } = usePortfolioData();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { theme } = useTheme();
  const { mousePosition, isMoving } = useMouseTracker();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Index - loading portfolio data");
        await fetchPortfolioData();
        console.log("Index - portfolio data loaded successfully");
      } catch (err: any) {
        console.error("Error loading portfolio data:", err);
        toast.error('Failed to load portfolio data. Please try refreshing the page.');
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadData();
    
    // Enhanced scroll reveal animation with stagger
    const handleRevealOnScroll = () => {
      const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
      
      revealElements.forEach((element, index) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < windowHeight - elementVisible) {
          setTimeout(() => {
            element.classList.add('active');
          }, index * 100);
        }
      });
    };
    
    // Smooth scroll behavior with easing
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href')?.substring(1);
        const targetElement = document.getElementById(targetId || '');
        
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };
    
    // Add event listeners
    window.addEventListener('scroll', handleRevealOnScroll, { passive: true });
    document.addEventListener('click', handleSmoothScroll);
    
    // Initial check
    handleRevealOnScroll();
    
    return () => {
      window.removeEventListener('scroll', handleRevealOnScroll);
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, [fetchPortfolioData]);

  // Enhanced loading screen with theme awareness
  if (isInitialLoading && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-portfolio-purple/20 to-portfolio-teal/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <Loader2 className="h-20 w-20 animate-spin text-portfolio-purple mx-auto" />
            <div className="absolute inset-0 h-20 w-20 bg-portfolio-purple/30 rounded-full blur-lg animate-pulse mx-auto"
              style={{ boxShadow: 'var(--border-glow)' }}
            ></div>
          </div>
          <h2 className="text-4xl font-bold gradient-text mb-4 animate-pulse"
            style={{ textShadow: 'var(--text-glow)' }}
          >
            Loading Portfolio
          </h2>
          <p className="text-gray-300 text-xl mb-8">Preparing an amazing experience...</p>
          
          {/* Enhanced loading bar */}
          <div className="w-96 h-3 bg-white/10 rounded-full mt-8 mx-auto overflow-hidden border border-white/20">
            <div className="h-full bg-gradient-to-r from-portfolio-purple via-portfolio-teal to-pink-500 rounded-full animate-pulse transform origin-left animate-pulse"
              style={{ 
                animation: 'pulse 2s ease-in-out infinite, scale-x-75 3s ease-in-out infinite',
                boxShadow: 'var(--border-glow)'
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Dynamic Background with theme awareness */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{ background: 'var(--bg-gradient)' }}
        ></div>
      </div>
      
      {/* Theme-based Particle Effects */}
      <ParticleSystem 
        mouseX={mousePosition.x} 
        mouseY={mousePosition.y} 
        isActive={isMoving && (theme === 'cyber' || theme === 'neon' || theme === 'holographic')} 
      />
      
      {/* Theme Switcher */}
      <ThemeSwitcher />
      
      <Header />
      
      <main className="flex-grow relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;
