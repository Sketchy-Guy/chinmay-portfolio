
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
import { usePortfolioData } from "@/contexts/DataContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { fetchPortfolioData, isLoading, error, data } = usePortfolioData();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
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
          }, index * 50); // Staggered animation
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
    
    // Enhanced styling fixes
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced hover effects and consistency */
      .certifications-card:hover,
      .project-card:hover,
      .skills-card:hover {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(-8px) scale(1.02) !important;
      }
      
      /* Improved card styling */
      .card, .card-content {
        z-index: 5;
        position: relative;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      /* Prevent flickering */
      section:hover *, div:hover * {
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      /* Smooth page transitions */
      .page-enter {
        opacity: 0;
        transform: translateY(20px);
      }
      
      .page-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.6s ease-out;
      }
      
      /* Enhanced loading states */
      .loading-state {
        background: linear-gradient(90deg, 
          rgba(255,255,255,0.1) 25%, 
          rgba(255,255,255,0.2) 50%, 
          rgba(255,255,255,0.1) 75%
        );
        background-size: 200% 100%;
        animation: loading-shimmer 1.5s infinite;
      }
      
      @keyframes loading-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      window.removeEventListener('scroll', handleRevealOnScroll);
      document.removeEventListener('click', handleSmoothScroll);
      document.head.removeChild(style);
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
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-portfolio-purple mx-auto mb-6" />
            <div className="absolute inset-0 h-16 w-16 bg-portfolio-purple/20 rounded-full blur-md animate-pulse mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-2">Loading Portfolio</h2>
          <p className="text-gray-400">Preparing an amazing experience...</p>
          
          {/* Loading bar */}
          <div className="w-64 h-1 bg-white/10 rounded-full mt-6 mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-portfolio-purple to-portfolio-teal animate-pulse"></div>
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

export default Index;
