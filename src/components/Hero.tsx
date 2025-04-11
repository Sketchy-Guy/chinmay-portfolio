
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Mail, Twitter, Instagram, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePortfolioData } from "@/components/DataManager";

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const { data, isLoading } = usePortfolioData();
  const fullText = data.user.title;
  const { toast } = useToast();
  
  useEffect(() => {
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
    // This would be a real download in a production environment
    toast({
      title: "CV Downloaded",
      description: "Your CV has been downloaded successfully!",
    });
  };
  
  const socialLinks = [
    { icon: Github, href: data.user.social.github || "#", label: "GitHub" },
    { icon: Linkedin, href: data.user.social.linkedin || "#", label: "LinkedIn" },
    { icon: Twitter, href: data.user.social.twitter || "#", label: "Twitter" },
    { icon: Instagram, href: data.user.social.instagram || "#", label: "Instagram" },
    { icon: Facebook, href: data.user.social.facebook || "#", label: "Facebook" },
    { icon: Mail, href: `mailto:${data.user.email}`, label: "Email" },
  ];

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 animate-fade-in">
            <h3 className="text-2xl font-medium text-portfolio-teal mb-2">Hello, I'm</h3>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text">{data.user.name}</h1>
            <h2 className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 mb-6 h-6">
              {typedText}
              <span className="ml-1 inline-block w-2 h-full bg-portfolio-purple animate-pulse"></span>
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-lg">
              {data.user.bio}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  aria-label={link.label}
                  className="social-icon"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="bg-portfolio-purple hover:bg-portfolio-purple/90"
                onClick={handleDownloadCV}
              >
                <Download className="mr-2 h-4 w-4" /> Download CV
              </Button>
              <Button 
                variant="outline" 
                className="border-portfolio-teal text-portfolio-teal hover:bg-portfolio-teal hover:text-white"
                asChild
              >
                <a href={`mailto:${data.user.email}`}>
                  <Mail className="mr-2 h-4 w-4" /> Contact Me
                </a>
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative z-10">
            <div className="w-64 h-64 md:w-80 md:h-80 mx-auto relative z-20 animate-float">
              <img 
                src={data.user.profileImage || "/lovable-uploads/78295e37-4b4d-4900-b613-21ed6626ab3f.png"} 
                alt={data.user.name}
                className="rounded-full object-cover border-4 border-white shadow-xl w-full h-full"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md max-h-md z-10">
              <div className="w-full h-full rounded-full bg-portfolio-purple opacity-5 animate-spin-slow blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
