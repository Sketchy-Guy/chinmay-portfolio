import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Mail, Twitter, Instagram, Facebook } from "lucide-react";
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
  const fullText = data?.user?.title || "";
  const { toast: uiToast } = useToast();
  
  // Refresh image when component mounts and whenever profile image changes
  useEffect(() => {
    setImageTimestamp(Date.now());
    setImageError(false);
    setImageLoaded(false);
    console.log("Hero: Refreshing profile image with new timestamp:", imageTimestamp);
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
    }, 50);
    
    return () => clearInterval(typingInterval);
  }, [fullText]);
  
  const handleDownloadCV = () => {
    uiToast({
      title: "CV Downloaded",
      description: "Your CV has been downloaded successfully!",
    });
  };
  
  if (!data || !data.user) {
    return null; // Don't render anything if data isn't loaded yet
  }
  
  const socialLinks = [
    { icon: Github, href: data.user.social.github || "#", label: "GitHub" },
    { icon: Linkedin, href: data.user.social.linkedin || "#", label: "LinkedIn" },
    { icon: Twitter, href: data.user.social.twitter || "#", label: "Twitter" },
    { icon: Instagram, href: data.user.social.instagram || "#", label: "Instagram" },
    { icon: Facebook, href: data.user.social.facebook || "#", label: "Facebook" },
    { icon: Mail, href: `mailto:${data.user.email}`, label: "Email" },
  ];

  // Default image path with fallback

  

  const defaultImage = "/lovable-uploads/WhatsApp Image 2024-06-18 at 13.19.59_2b7a27bc.jpg";
 
  // Make sure we don't add a timestamp to the default image
  let profileImage = defaultImage;
  
  if (!imageError && data.user.profileImage) {
    // Only add timestamp if it's not the default image to bust cache
    profileImage = `${data.user.profileImage}?t=${imageTimestamp}`;
  }

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 relative overflow-hidden">
      {/* 3D Background Scene with Error Boundary */}
      <ThreeJSErrorBoundary>
        <Hero3D />
      </ThreeJSErrorBoundary>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 animate-fade-in">
            <h3 className="text-2xl font-medium text-portfolio-teal mb-2 drop-shadow-lg">Hello, I'm</h3>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text drop-shadow-2xl">{data.user.name}</h1>
            <h2 className="text-xl md:text-2xl font-medium text-gray-100 dark:text-gray-200 mb-6 h-6 drop-shadow-lg">
              {typedText}
              <span className="ml-1 inline-block w-2 h-full bg-portfolio-purple animate-pulse"></span>
            </h2>
            <p className="text-gray-200 dark:text-gray-200 mb-8 max-w-lg drop-shadow-lg backdrop-blur-sm bg-black/20 p-4 rounded-lg">
              {data.user.bio}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {socialLinks.map((link, index) => (
                link.href !== "#" && (
                  <a 
                    key={index}
                    href={link.href}
                    aria-label={link.label}
                    className="social-icon backdrop-blur-sm bg-white/20 hover:bg-portfolio-purple transition-all duration-300 hover:scale-110"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <link.icon size={20} />
                  </a>
                )
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="bg-portfolio-purple hover:bg-portfolio-purple/90 backdrop-blur-sm hover:scale-105 transition-all duration-300 shadow-2xl border border-purple-400/30"
                onClick={handleDownloadCV}
              >
                <Download className="mr-2 h-4 w-4" /> Download CV
              </Button>
              <Button 
                variant="outline" 
                className="border-portfolio-teal text-portfolio-teal hover:bg-portfolio-teal hover:text-white backdrop-blur-sm hover:scale-105 transition-all duration-300 shadow-2xl border-2"
                asChild
              >
                <a href={`mailto:${data.user.email}`}>
                  <Mail className="mr-2 h-4 w-4" /> Contact Me
                </a>
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative z-20">
            <div className="w-64 h-64 md:w-80 md:h-80 mx-auto relative animate-float">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-100/20 backdrop-blur-sm">
                  <div className="animate-spin h-12 w-12 border-4 border-portfolio-purple border-t-transparent rounded-full"></div>
                </div>
              )}
              <img 
                src={profileImage} 
                alt={data.user.name}
                className={`rounded-full object-cover border-4 border-white/30 shadow-2xl w-full h-full transition-all duration-300 hover:scale-105 backdrop-blur-sm ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
