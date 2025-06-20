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
        console.log("Loading revolutionary portfolio data...");
        await fetchPortfolioData();
        
        const loadTime = performance.now() - startTime;
        console.log(`Portfolio data loaded successfully in ${loadTime.toFixed(2)}ms`);
        
        // Track analytics
        try {
          await supabase
            .from('analytics_data')
            .insert({
              event_type: 'page_view',
              event_data: { 
                page: 'revolutionary_home',
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
        toast.error('Some portfolio data failed to load. Displaying with enhanced defaults.');
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadData();

    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Enhanced scroll reveal system
    const handleRevealOnScroll = () => {
      requestAnimationFrame(() => {
        const revealElements = document.querySelectorAll('.quantum-reveal, .matrix-reveal, .hologram-reveal');
        const windowHeight = window.innerHeight;
        
        revealElements.forEach((element, index) => {
          const elementTop = element.getBoundingClientRect().top;
          const elementVisible = 150;
          
          if (elementTop < windowHeight - elementVisible && !element.classList.contains('active')) {
            setTimeout(() => {
              element.classList.add('active');
            }, index * 50);
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
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerOffset = 120;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };
    
    const throttledScrollHandler = throttle(handleRevealOnScroll, 16);
    const throttledMouseHandler = throttle(handleMouseMove, 16);
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('mousemove', throttledMouseHandler, { passive: true });
    document.addEventListener('click', handleSmoothScroll);
    
    handleRevealOnScroll();
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('mousemove', throttledMouseHandler);
      document.removeEventListener('click', handleSmoothScroll);
      console.log("Cleaning up revolutionary page connections...");
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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/30 to-cyan-900/20">
        <InteractiveBackground mousePosition={mousePosition} />
        
        <div className="text-center relative z-10">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="quantum-loader-advanced"></div>
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-pulse"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 font-orbitron mb-4 font-bold animate-pulse">
            Initializing Neural Interface...
          </h2>
          
          <p className="text-gray-300 animate-pulse mb-6 text-lg">
            Establishing quantum connections to portfolio matrix
          </p>
          
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          
          <div className="text-xs text-gray-400 font-orbitron">
            Loading revolutionary experience framework...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <InteractiveBackground mousePosition={mousePosition} />
      <Header />
      
      <main className="flex-grow pt-24 relative z-10">
        <RevolutionaryHeroSection />
        <InnovativeAboutSection />
        <QuantumSkillsSection />
        <QuantumTimeline />
        <ProjectGallery3D />
        <FuturisticContact />
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
