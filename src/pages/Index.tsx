
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
import MatrixRain from "@/components/effects/MatrixRain";
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
    
    // Enhanced scroll reveal animation
    const handleRevealOnScroll = () => {
      const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
      
      revealElements.forEach((element, index) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < windowHeight - elementVisible) {
          setTimeout(() => {
            element.classList.add('active');
          }, index * 50);
        }
      });
    };
    
    // Smooth scroll behavior
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href')?.substring(1);
        const targetElement = document.getElementById(targetId || '');
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
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

  // Enhanced loading screen
  if (isInitialLoading && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <Loader2 className="h-16 w-16 animate-spin text-portfolio-purple mx-auto" />
            <div className="absolute inset-0 h-16 w-16 bg-portfolio-purple/20 rounded-full blur-md animate-pulse mx-auto"></div>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-4 animate-pulse">Loading Portfolio</h2>
          <p className="text-gray-400 text-lg">Preparing an amazing experience...</p>
          
          {/* Enhanced loading bar */}
          <div className="w-80 h-2 bg-white/10 rounded-full mt-8 mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-portfolio-purple via-portfolio-teal to-pink-500 rounded-full animate-pulse transform scale-x-75"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-black"></div>
      </div>
      
      {/* Theme-based effects */}
      <ParticleSystem 
        mouseX={mousePosition.x} 
        mouseY={mousePosition.y} 
        isActive={isMoving && (theme === 'cyber' || theme === 'neon')} 
      />
      <MatrixRain isActive={theme === 'matrix'} />
      
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
