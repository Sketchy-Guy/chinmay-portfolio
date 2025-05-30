
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Mail, Twitter, Instagram, Facebook, Sparkles, ArrowDown, Zap } from "lucide-react";
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
    { icon: Github, href: data.user.social.github || "#", label: "GitHub", color: "hover:text-purple-400" },
    { icon: Linkedin, href: data.user.social.linkedin || "#", label: "LinkedIn", color: "hover:text-blue-400" },
    { icon: Twitter, href: data.user.social.twitter || "#", label: "Twitter", color: "hover:text-cyan-400" },
    { icon: Instagram, href: data.user.social.instagram || "#", label: "Instagram", color: "hover:text-pink-400" },
    { icon: Facebook, href: data.user.social.facebook || "#", label: "Facebook", color: "hover:text-blue-500" },
    { icon: Mail, href: `mailto:${data.user.email}`, label: "Email", color: "hover:text-green-400" },
  ];

  const defaultImage = "/lovable-uploads/WhatsApp Image 2024-06-18 at 13.19.59_2b7a27bc.jpg";
  let profileImage = defaultImage;
  
  if (!imageError && data.user.profileImage) {
    profileImage = `${data.user.profileImage}?t=${imageTimestamp}`;
  }

  return (
    <section id="hero" className={`min-h-screen flex flex-col justify-center pt-20 relative overflow-hidden cyber-grid ${isVisible ? 'page-transition loaded' : 'page-transition'}`}>
      {/* Enhanced 3D Background Scene */}
      <ThreeJSErrorBoundary>
        <Hero3D />
      </ThreeJSErrorBoundary>
      
      {/* Neural Network Pattern */}
      <div className="neural-network">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8">
            {/* Enhanced welcome badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 glass-morphism rounded-full text-sm font-medium text-purple-300 reveal border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 group">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="holographic-text font-medium">Welcome to the digital frontier</span>
              <Zap className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-medium text-cyan-400 reveal font-orbitron" style={{ animationDelay: '0.2s' }}>
                Initialize Protocol:
              </h3>
              
              <h1 className="text-6xl md:text-8xl font-bold leading-tight reveal font-orbitron" style={{ animationDelay: '0.4s' }}>
                <span className="holographic-text">{data.user.name}</span>
              </h1>
              
              <div className="h-12 md:h-16 flex items-center reveal" style={{ animationDelay: '0.6s' }}>
                <h2 className="text-xl md:text-3xl font-medium text-gray-300 font-orbitron">
                  {typedText}
                  <span className="ml-1 inline-block w-1 h-8 bg-gradient-to-b from-purple-500 to-cyan-400 animate-pulse"></span>
                </h2>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl glass-morphism p-6 rounded-2xl border border-purple-500/20 reveal data-stream" style={{ animationDelay: '0.8s' }}>
                {data.user.bio}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 reveal" style={{ animationDelay: '1s' }}>
              {socialLinks.map((link, index) => (
                link.href !== "#" && (
                  <a 
                    key={index}
                    href={link.href}
                    aria-label={link.label}
                    className={`w-12 h-12 glass-morphism rounded-xl flex items-center justify-center text-gray-400 ${link.color} transition-all duration-300 border border-purple-500/20 hover:border-purple-400/50 hover:scale-110 group animate-pulse-neon`}
                    rel="noopener noreferrer"
                    target="_blank"
                    style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                  >
                    <link.icon size={20} className="group-hover:rotate-12 transition-all duration-300" />
                  </a>
                )
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 reveal" style={{ animationDelay: '1.4s' }}>
              <Button 
                className="cyber-button group relative overflow-hidden"
                onClick={handleDownloadCV}
              >
                <Download className="mr-3 h-5 w-5 group-hover:animate-bounce relative z-10" /> 
                <span className="relative z-10">Download CV</span>
              </Button>
              <Button 
                className="cyber-button group relative overflow-hidden border-cyan-500 text-cyan-400 hover:text-white hover:border-cyan-400"
                onClick={handleContactClick}
              >
                <Mail className="mr-3 h-5 w-5 group-hover:animate-pulse relative z-10" /> 
                <span className="relative z-10">Contact Me</span>
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative z-20 reveal" style={{ animationDelay: '0.5s' }}>
            <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto group">
              {/* Enhanced loading state */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center glass-morphism rounded-full border border-purple-500/30">
                  <div className="quantum-loader"></div>
                </div>
              )}
              
              {/* Enhanced profile image */}
              <div className="relative w-full h-full animate-float-3d group-hover:scale-105 transition-all duration-700">
                <img 
                  src={profileImage} 
                  alt={data.user.name}
                  className={`rounded-full object-cover border-4 border-purple-500/50 shadow-2xl w-full h-full transition-all duration-700 glass-morphism hover:border-cyan-400/70 neon-border ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
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
                
                {/* Enhanced decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full animate-pulse group-hover:scale-125 transition-all duration-500"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full animate-pulse group-hover:scale-125 transition-all duration-500" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/4 -left-6 w-4 h-4 bg-gradient-to-r from-green-400 to-purple-500 rounded-full animate-pulse group-hover:scale-125 transition-all duration-500" style={{ animationDelay: '1s' }}></div>
                
                {/* Holographic effect overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 data-stream"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 group cursor-pointer">
          <a href="#about" className="flex flex-col items-center text-purple-300 hover:text-white transition-all duration-300 group-hover:scale-110">
            <span className="text-sm mb-2 font-orbitron group-hover:text-cyan-400 transition-colors duration-300">Explore Journey</span>
            <div className="relative">
              <ArrowDown className="w-5 h-5 animate-bounce group-hover:translate-y-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
