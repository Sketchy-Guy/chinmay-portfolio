
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import SkillsRadar from "@/components/SkillsRadar";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import GitHubStats from "@/components/GitHubStats";
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

const Index = () => {
  const { fetchPortfolioData, isLoading, error, data } = usePortfolioData();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [pageViews, setPageViews] = useState(0);
  
  // Track page analytics and load portfolio data
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Index - loading portfolio data");
        await fetchPortfolioData();
        console.log("Index - portfolio data loaded successfully");
        
        // Track page view in analytics
        try {
          await supabase
            .from('analytics_data')
            .insert({
              event_type: 'page_view',
              event_data: { 
                page: 'home',
                timestamp: new Date().toISOString()
              },
              user_agent: navigator.userAgent,
              page_url: window.location.href,
              referrer: document.referrer || null
            });
          
          console.log("Page view tracked successfully");
        } catch (analyticsError) {
          console.error("Failed to track page view:", analyticsError);
        }
        
      } catch (err: any) {
        console.error("Error loading portfolio data:", err);
        toast.error('Failed to load portfolio data. Please try refreshing the page.');
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadData();
    
    // Enhanced scroll reveal animation with stagger effect
    const handleRevealOnScroll = () => {
      const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
      
      revealElements.forEach((element, index) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < windowHeight - elementVisible) {
          setTimeout(() => {
            element.classList.add('active');
          }, index * 50); // Staggered animation
        }
      });
    };
    
    // Smooth scroll behavior with easing for anchor links
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
    
    // Add event listeners for scroll animations and smooth scrolling
    window.addEventListener('scroll', handleRevealOnScroll, { passive: true });
    document.addEventListener('click', handleSmoothScroll);
    
    // Initial reveal check on page load
    handleRevealOnScroll();
    
    // Enhanced CSS fixes for card visibility issues
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced fixes for card visibility and hover effects */
      .project-card,
      .certification-card,
      .skill-badge,
      .glass-card-enhanced {
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
        z-index: 1;
        position: relative;
      }
      
      /* Prevent cards from disappearing on hover */
      .project-card:hover,
      .certification-card:hover,
      .skill-badge:hover,
      .glass-card-enhanced:hover {
        opacity: 1 !important;
        visibility: visible !important;
        z-index: 2;
      }
      
      /* Ensure parent containers don't hide overflow */
      section, .container, .grid {
        overflow: visible !important;
      }
      
      /* Fix for any transform issues */
      .reveal.active,
      .reveal-stagger.active {
        opacity: 1 !important;
        transform: translateY(0) scale(1) !important;
        visibility: visible !important;
      }
      
      /* Enhanced loading skeleton for better UX */
      .loading-skeleton {
        background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Quantum loader enhancement */
      .quantum-loader {
        width: 64px;
        height: 64px;
        border: 3px solid rgba(139, 92, 246, 0.3);
        border-radius: 50%;
        border-top-color: #8b5cf6;
        animation: quantum-spin 1s ease-in-out infinite;
        position: relative;
      }
      
      .quantum-loader::before,
      .quantum-loader::after {
        content: '';
        position: absolute;
        border: 3px solid transparent;
        border-radius: 50%;
      }
      
      .quantum-loader::before {
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border-top-color: #06b6d4;
        animation: quantum-spin 2s ease-in-out infinite reverse;
      }
      
      .quantum-loader::after {
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
        border-top-color: #ec4899;
        animation: quantum-spin 1.5s ease-in-out infinite;
      }
      
      @keyframes quantum-spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleRevealOnScroll);
      document.removeEventListener('click', handleSmoothScroll);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [fetchPortfolioData]);

  // Show enhanced loading state while data is being fetched initially
  if (isInitialLoading && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background for loading */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900"></div>
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        
        {/* Loading content */}
        <div className="text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="quantum-loader"></div>
          </div>
          <h2 className="text-xl text-purple-400 font-orbitron mb-2">
            Initializing Portfolio Matrix...
          </h2>
          <p className="text-gray-400 animate-pulse">
            Loading neural networks and data streams
          </p>
          
          {/* Progress indicators */}
          <div className="flex justify-center gap-1 mt-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Enhanced header with analytics tracking */}
      <Header />
      
      {/* Main content with all portfolio sections */}
      <main className="flex-grow">
        <Hero />
        <About />
        <Skills />
        <SkillsRadar />
        <Timeline />
        <Projects />
        <GitHubStats />
        <CodingAchievements />
        <Certifications />
        <Contact />
      </main>
      
      {/* Footer and scroll to top functionality */}
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
