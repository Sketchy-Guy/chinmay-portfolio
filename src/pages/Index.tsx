
import { useEffect, useState } from "react";
import RevolutionaryHeroSection from "@/components/modern/portfolio/RevolutionaryHeroSection";
import InnovativeAboutSection from "@/components/modern/portfolio/InnovativeAboutSection";
import QuantumSkillsSection from "@/components/modern/portfolio/QuantumSkillsSection";
import ProjectGallery3D from "@/components/modern/portfolio/ProjectGallery3D";
import QuantumTimeline from "@/components/modern/portfolio/QuantumTimeline";
import FuturisticContact from "@/components/modern/portfolio/FuturisticContact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import InteractiveBackground from "@/components/effects/InteractiveBackground";
import FloatingElements from "@/components/3d/FloatingElements";
import { usePortfolioData } from "@/contexts/DataContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { modernConnectionManager } from "@/utils/modern/connectionManager";

const Index = () => {
  const { fetchPortfolioData, isLoading, error, data } = usePortfolioData();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const loadData = async () => {
      const startTime = performance.now();
      
      try {
        console.log("Loading portfolio data...");
        await fetchPortfolioData();
        
        const loadTime = performance.now() - startTime;
        console.log(`Portfolio data loaded successfully in ${loadTime.toFixed(2)}ms`);
        
        // Track analytics with simplified data
        try {
          await supabase
            .from('analytics_data')
            .insert({
              event_type: 'page_view',
              event_data: { 
                page: 'home',
                load_time: loadTime,
                timestamp: new Date().toISOString(),
                user_agent_info: {
                  platform: navigator.platform,
                  language: navigator.language,
                  screen_resolution: `${screen.width}x${screen.height}`
                }
              },
              user_agent: navigator.userAgent,
              page_url: window.location.href,
              referrer: document.referrer || null
            });
          
          console.log("Analytics tracked successfully");
        } catch (analyticsError) {
          console.warn("Failed to track analytics:", analyticsError);
        }
        
      } catch (err: any) {
        console.error("Error loading portfolio data:", err);
        toast.error('Some portfolio data failed to load. Displaying with defaults.');
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadData();

    // Optimized mouse tracking with reduced frequency
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Professional scroll reveal system
    const handleRevealOnScroll = () => {
      requestAnimationFrame(() => {
        const revealElements = document.querySelectorAll('.quantum-reveal, .matrix-reveal, .hologram-reveal');
        const windowHeight = window.innerHeight;
        
        revealElements.forEach((element, index) => {
          const elementTop = element.getBoundingClientRect().top;
          const elementVisible = 120;
          
          if (elementTop < windowHeight - elementVisible && !element.classList.contains('active')) {
            setTimeout(() => {
              element.classList.add('active');
            }, index * 30);
          }
        });
      });
    };
    
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      
      if (href?.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        
        if (targetId === '') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerOffset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };
    
    const throttledScrollHandler = throttle(handleRevealOnScroll, 32);
    const throttledMouseHandler = throttle(handleMouseMove, 50); // Reduced frequency for better performance
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('mousemove', throttledMouseHandler, { passive: true });
    document.addEventListener('click', handleSmoothScroll);
    
    handleRevealOnScroll();
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('mousemove', throttledMouseHandler);
      document.removeEventListener('click', handleSmoothScroll);
      console.log("Cleaning up page connections...");
      modernConnectionManager.cleanup();
    };
  }, [fetchPortfolioData]);

  function throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  if (isInitialLoading && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/20 to-indigo-900/20">
        <InteractiveBackground mousePosition={mousePosition} />
        
        <div className="text-center relative z-10 px-4">
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8 relative">
            <div className="w-full h-full border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-indigo-500/20 border-r-indigo-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 font-orbitron mb-4 font-bold animate-pulse">
            Loading Portfolio...
          </h2>
          
          <p className="text-slate-300 animate-pulse mb-6 text-base md:text-lg">
            Initializing professional interface
          </p>
          
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          
          <div className="text-xs text-slate-400 font-orbitron">
            Loading experience framework...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <InteractiveBackground mousePosition={mousePosition} />
      <FloatingElements />
      <Header />
      
      <main className="flex-grow relative z-10">
        <div className="pt-16">
          <RevolutionaryHeroSection />
        </div>
        
        <div id="about" className="scroll-mt-20">
          <InnovativeAboutSection />
        </div>
        
        <div id="skills" className="scroll-mt-20">
          <QuantumSkillsSection />
        </div>
        
        <div id="timeline" className="scroll-mt-20">
          <QuantumTimeline />
        </div>
        
        <div id="projects" className="scroll-mt-20">
          <ProjectGallery3D />
        </div>
        
        <div id="contact" className="scroll-mt-20">
          <FuturisticContact />
        </div>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
