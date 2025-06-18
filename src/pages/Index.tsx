
import { useEffect, useState } from "react";
import EnhancedHeroSection from "@/components/modern/portfolio/EnhancedHeroSection";
import EnhancedAboutSection from "@/components/modern/portfolio/EnhancedAboutSection";
import Skills from "@/components/Skills";
import SkillsRadar from "@/components/SkillsRadar";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import GitHubStatsEnhanced from "@/components/GitHubStatsEnhanced";
import CodingAchievements from "@/components/CodingAchievements";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { usePortfolioData } from "@/contexts/DataContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { modernConnectionManager } from "@/utils/modern/connectionManager";

const Index = () => {
  const { fetchPortfolioData, isLoading, error, data } = usePortfolioData();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      const startTime = performance.now();
      
      try {
        console.log("Loading portfolio data...");
        await fetchPortfolioData();
        
        const loadTime = performance.now() - startTime;
        console.log(`Portfolio data loaded successfully in ${loadTime.toFixed(2)}ms`);
        
        // Track page view analytics (non-blocking)
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
    
    const handleRevealOnScroll = () => {
      requestAnimationFrame(() => {
        const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
        const windowHeight = window.innerHeight;
        
        revealElements.forEach((element, index) => {
          const elementTop = element.getBoundingClientRect().top;
          const elementVisible = 100;
          
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
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerOffset = 100; // Increased for better spacing
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
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    document.addEventListener('click', handleSmoothScroll);
    
    handleRevealOnScroll();
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900"></div>
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        
        <div className="text-center relative z-10">
          <div className="w-20 h-20 mx-auto mb-6">
            <div className="quantum-loader"></div>
          </div>
          <h2 className="text-2xl text-purple-400 font-orbitron mb-3 font-bold">
            Loading Portfolio Experience...
          </h2>
          <p className="text-gray-400 animate-pulse mb-4">
            Preparing neural networks and data streams
          </p>
          
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          
          <div className="mt-6 text-xs text-gray-500">
            Optimizing for best performance...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Main content with proper header spacing */}
      <main className="flex-grow pt-20">
        <EnhancedHeroSection />
        <EnhancedAboutSection />
        <Skills />
        <SkillsRadar />
        <Timeline />
        <Projects />
        <GitHubStatsEnhanced />
        <CodingAchievements />
        <Certifications />
        <Contact />
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
