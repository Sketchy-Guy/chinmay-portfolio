
import { useEffect, useState } from "react";
import HeroSection from "@/components/modern/portfolio/HeroSection";
import AboutSection from "@/components/modern/portfolio/AboutSection";
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

/**
 * Main Portfolio Index Page
 * Displays all portfolio sections with optimized loading and analytics
 * Features: Performance monitoring, error handling, real-time analytics
 */
const Index = () => {
  const { fetchPortfolioData, isLoading, error, data } = usePortfolioData();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  /**
   * Load portfolio data and track analytics
   * Includes error handling and performance monitoring
   */
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
          // Analytics errors should not impact user experience
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
    
    /**
     * Enhanced scroll reveal animation with performance optimization
     * Uses requestAnimationFrame for smooth animations
     */
    const handleRevealOnScroll = () => {
      requestAnimationFrame(() => {
        const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
        const windowHeight = window.innerHeight;
        
        revealElements.forEach((element, index) => {
          const elementTop = element.getBoundingClientRect().top;
          const elementVisible = 100;
          
          if (elementTop < windowHeight - elementVisible && !element.classList.contains('active')) {
            // Staggered animation for better visual effect
            setTimeout(() => {
              element.classList.add('active');
            }, index * 30);
          }
        });
      });
    };
    
    /**
     * Enhanced smooth scroll with easing for anchor links
     */
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      
      if (href?.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Track navigation analytics
          try {
            supabase
              .from('analytics_data')
              .insert({
                event_type: 'navigation',
                event_data: { 
                  target_section: targetId,
                  timestamp: new Date().toISOString()
                },
                page_url: window.location.href
              });
          } catch {
            // Silent fail for analytics
          }
        }
      }
    };
    
    // Add optimized event listeners
    const throttledScrollHandler = throttle(handleRevealOnScroll, 16); // ~60fps
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    document.addEventListener('click', handleSmoothScroll);
    
    // Initial reveal check
    handleRevealOnScroll();
    
    // Enhanced CSS injection for performance and visual fixes
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced performance and visibility fixes */
      .project-card,
      .certification-card,
      .skill-badge,
      .futuristic-card {
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
        will-change: transform, opacity;
        contain: layout style paint;
      }
      
      /* Smooth hover effects with GPU acceleration */
      .futuristic-card:hover {
        transform: translateY(-5px) !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      /* Optimized animations */
      .reveal.active,
      .reveal-stagger.active {
        opacity: 1 !important;
        transform: translateY(0) scale(1) !important;
        visibility: visible !important;
      }
      
      /* Enhanced loading states */
      .loading-skeleton {
        background: linear-gradient(90deg, rgba(139,92,246,0.1) 25%, rgba(139,92,246,0.2) 50%, rgba(139,92,246,0.1) 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Performance optimization for smooth scrolling */
      html {
        scroll-behavior: smooth;
      }
      
      /* Prevent layout shift */
      section {
        min-height: fit-content;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup function with connection management
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      document.removeEventListener('click', handleSmoothScroll);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      
      // Clean up any remaining connections
      console.log("Cleaning up page connections...");
      modernConnectionManager.cleanup();
    };
  }, [fetchPortfolioData]);

  /**
   * Throttle function for performance optimization
   * @param func - Function to throttle
   * @param limit - Time limit in ms
   */
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

  // Enhanced loading screen with better UX
  if (isInitialLoading && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900"></div>
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        
        {/* Loading content */}
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
          
          {/* Enhanced progress indicators */}
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          
          {/* Performance indicator */}
          <div className="mt-6 text-xs text-gray-500">
            Optimizing for best performance...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Enhanced header with better performance */}
      <Header />
      
      {/* Main content sections */}
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <Skills />
        <SkillsRadar />
        <Timeline />
        <Projects />
        <GitHubStatsEnhanced />
        <CodingAchievements />
        <Certifications />
        <Contact />
      </main>
      
      {/* Footer and utilities */}
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
