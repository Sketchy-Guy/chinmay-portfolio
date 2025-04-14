
import { useEffect } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { usePortfolioData } from "@/components/DataManager";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { fetchPortfolioData, isLoading, error, data } = usePortfolioData();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Index - loading portfolio data");
        await fetchPortfolioData();
      } catch (err: any) {
        console.error("Error loading portfolio data:", err);
        toast.error('Failed to load portfolio data. Please try refreshing the page.');
      }
    };
    
    loadData();
    
    // Animation on scroll effect
    const handleRevealOnScroll = () => {
      const revealElements = document.querySelectorAll('.reveal');
      
      for (let i = 0; i < revealElements.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = revealElements[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          revealElements[i].classList.add('active');
        }
      }
    };
    
    window.addEventListener('scroll', handleRevealOnScroll);
    // Initial check on page load
    handleRevealOnScroll();
    
    // Apply fix for hover issues on tiles
    const style = document.createElement('style');
    style.textContent = `
      /* Fix for tiles disappearing on hover */
      .certifications-card:hover,
      .project-card:hover,
      .skills-card:hover {
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
      }
      
      /* Ensure all cards have proper z-index */
      .card, .card-content {
        z-index: 5;
        position: relative;
      }
      
      /* Prevent elements from disappearing on hover */
      section:hover *, div:hover * {
        opacity: 1 !important;
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      window.removeEventListener('scroll', handleRevealOnScroll);
      document.head.removeChild(style);
    };
  }, [fetchPortfolioData]);

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-portfolio-purple mx-auto" />
          <p className="mt-4 text-portfolio-purple">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  // Show error state if there was an error fetching data
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Error loading portfolio data</p>
          <p className="text-gray-600">{error?.message || 'Unknown error'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-portfolio-purple text-white rounded hover:bg-portfolio-purple/80"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Once data is loaded, display the content
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
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
