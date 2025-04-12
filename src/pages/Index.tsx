
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
import { usePortfolioData } from "@/components/DataManager";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { initializeStorage } from "@/utils/storage";

// Wrapper component to ensure data is loaded
const IndexContent = () => {
  const { fetchPortfolioData, isLoading, data } = usePortfolioData();
  const [localLoading, setLocalLoading] = useState(true);
  
  useEffect(() => {
    // Initialize storage first, then fetch portfolio data
    const init = async () => {
      try {
        console.log("IndexContent mounted - initializing storage");
        // Make sure storage bucket exists first
        const storageResult = await initializeStorage();
        if (!storageResult.success) {
          console.warn("Storage initialization warning:", storageResult.message);
          // Continue anyway, might still work
        }
        
        console.log("IndexContent - fetching portfolio data");
        await fetchPortfolioData();
      } catch (err: any) {
        console.error("Error initializing in IndexContent:", err);
        toast('Failed to load portfolio data. Please try refreshing the page.');
      } finally {
        setLocalLoading(false);
      }
    };
    
    init();
    
    // Animation on scroll effect
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
      for (let i = 0; i < revealElements.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = revealElements[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          revealElements[i].classList.add('active');
        }
      }
    };
    
    window.addEventListener('scroll', revealOnScroll);
    // Initial check on page load
    revealOnScroll();
    
    return () => {
      window.removeEventListener('scroll', revealOnScroll);
    };
  }, [fetchPortfolioData]);

  if (isLoading || localLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-portfolio-purple mx-auto" />
          <p className="mt-4 text-portfolio-purple">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

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

const Index = () => {
  return <IndexContent />;
};

export default Index;
