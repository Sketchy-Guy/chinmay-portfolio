
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Mail, Twitter, Instagram, Facebook, Sparkles, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePortfolioData } from "@/contexts/DataContext";
import Hero3D from "./3d/Hero3D";
import ThreeJSErrorBoundary from "./3d/ThreeJSErrorBoundary";

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const { data, isLoading } = usePortfolioData();
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const fullText = data?.user?.title || "";
  const { toast: uiToast } = useToast();
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  useEffect(() => {
    setImageTimestamp(Date.now());
    setImageError(false);
    setImageLoaded(false);
  }, [data?.user?.profileImage]);
  
  useEffect(() => {
    if (!fullText) return;
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);
    
    return () => clearInterval(typingInterval);
  }, [fullText]);
  
  const handleDownloadCV = () => {
    uiToast({
      title: "CV Downloaded! 📄",
      description: "Your CV has been downloaded successfully!",
    });
  };

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  if (!data || !data.user) {
    return null;
  }
  
  const socialLinks = [
    { icon: Github, href: data.user.social.github || "#", label: "GitHub" },
    { icon: Linkedin, href: data.user.social.linkedin || "#", label: "LinkedIn" },
    { icon: Twitter, href: data.user.social.twitter || "#", label: "Twitter" },
    { icon: Instagram, href: data.user.social.instagram || "#", label: "Instagram" },
    { icon: Facebook, href: data.user.social.facebook || "#", label: "Facebook" },
    { icon: Mail, href: `mailto:${data.user.email}`, label: "Email" },
  ];

  const defaultImage = "/lovable-uploads/WhatsApp Image 2024-06-18 at 13.19.59_2b7a27bc.jpg";
  let profileImage = defaultImage;
  
  if (!imageError && data.user.profileImage) {
    profileImage = `${data.user.profileImage}?t=${imageTimestamp}`;
  }

  return (
    <section className={`min-h-screen flex flex-col justify-center pt-20 relative overflow-hidden ${isVisible ? 'page-transition loaded' : 'page-transition'}`}>
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-portfolio-purple/10 to-portfolio-teal/10 rounded-full blur-2xl animate-spin-slow"></div>
      </div>

      {/* 3D Background Scene */}
      <ThreeJSErrorBoundary>
        <Hero3D />
      </ThreeJSErrorBoundary>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8">
            {/* Welcome badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/80 animate-fade-in">
              <Sparkles className="w-4 h-4 text-portfolio-purple" />
              Welcome to my digital space
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-medium text-portfolio-teal animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Hello, I'm
              </h3>
              
              <h1 className="text-6xl md:text-8xl font-bold leading-tight animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <span className="gradient-text animate-gradient">{data.user.name}</span>
              </h1>
              
              <div className="h-12 md:h-16 flex items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <h2 className="text-xl md:text-3xl font-medium text-gray-200">
                  {typedText}
                  <span className="ml-1 inline-block w-1 h-8 bg-gradient-to-b from-portfolio-purple to-portfolio-teal animate-pulse"></span>
                </h2>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-white/10 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                {data.user.bio}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '1s' }}>
              {socialLinks.map((link, index) => (
                link.href !== "#" && (
                  <a 
                    key={index}
                    href={link.href}
                    aria-label={link.label}
                    className="social-icon"
                    rel="noopener noreferrer"
                    target="_blank"
                    style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                  >
                    <link.icon size={24} />
                  </a>
                )
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '1.4s' }}>
              <Button 
                className="btn-primary group"
                onClick={handleDownloadCV}
              >
                <Download className="mr-3 h-5 w-5 group-hover:animate-bounce" /> 
                Download CV
              </Button>
              <Button 
                className="btn-secondary group"
                onClick={handleContactClick}
              >
                <Mail className="mr-3 h-5 w-5 group-hover:animate-pulse" /> 
                Contact Me
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative z-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {/* Enhanced background elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full max-w-lg max-h-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-portfolio-purple/20 via-portfolio-teal/20 to-pink-500/20 rounded-full blur-3xl animate-spin-slow"></div>
                <div className="absolute inset-4 bg-gradient-to-l from-cyan-500/20 via-purple-500/20 to-portfolio-purple/20 rounded-full blur-2xl animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '40s' }}></div>
              </div>
            </div>
            
            <div className="relative z-30 w-80 h-80 md:w-96 md:h-96 mx-auto">
              {/* Loading state */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/20">
                  <div className="loading-shimmer w-16 h-16 rounded-full"></div>
                </div>
              )}
              
              {/* Profile image */}
              <div className="relative w-full h-full animate-float">
                <img 
                  src={profileImage} 
                  alt={data.user.name}
                  className={`rounded-full object-cover border-4 border-white/20 shadow-2xl w-full h-full transition-all duration-700 hover:scale-105 backdrop-blur-sm hover:border-white/40 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onError={(e) => {
                    console.log('Hero: Image failed to load, using fallback');
                    (e.target as HTMLImageElement).src = defaultImage;
                    setImageError(true);
                    setImageLoaded(true);
                  }}
                  onLoad={() => {
                    console.log('Hero: Image loaded successfully');
                    setImageLoaded(true);
                  }}
                />
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-portfolio-purple to-portfolio-teal rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-portfolio-teal to-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/4 -left-6 w-4 h-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#about" className="flex flex-col items-center text-white/60 hover:text-white transition-colors duration-300">
            <span className="text-sm mb-2">Scroll to explore</span>
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
