import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Mail, Twitter, Instagram, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePortfolioData } from "@/contexts/DataContext";
import { useOptimizedSiteSettings } from "@/hooks/modern/useOptimizedSiteSettings";

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const { data, isLoading } = usePortfolioData();
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fullText = data?.user?.title || "";
  const { toast: uiToast } = useToast();
  const { settings, loading: settingsLoading } = useOptimizedSiteSettings();

  useEffect(() => {
    setImageTimestamp(Date.now());
    setImageLoaded(false);
    setImageError(false);
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

  if (isLoading || settingsLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto"></div>
          <p className="text-purple-400 animate-pulse">Loading portfolio...</p>
        </div>
      </section>
    );
  }

  if (!data || !data.user) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <p className="text-gray-400">No portfolio data available</p>
        </div>
      </section>
    );
  }

  const socialLinks = [
    { icon: Github, href: data.user.social.github || "#", label: "GitHub", color: "#333" },
    { icon: Linkedin, href: data.user.social.linkedin || "#", label: "LinkedIn", color: "#0077B5" },
    { icon: Twitter, href: data.user.social.twitter || "#", label: "Twitter", color: "#1DA1F2" },
    { icon: Instagram, href: data.user.social.instagram || "#", label: "Instagram", color: "#E4405F" },
    { icon: Facebook, href: data.user.social.facebook || "#", label: "Facebook", color: "#1877F3" },
    { icon: Mail, href: `mailto:${data.user.email}`, label: "Email", color: "#EA4335" },
  ];

  const profileImage = data.user.profileImage
    ? `${data.user.profileImage}?t=${imageTimestamp}`
    : "";

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 overflow-hidden relative">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          <div className="lg:w-1/2 animate-fade-in space-y-6">
            {/* Site name from settings */}
            {settings.site_name && (
              <div className="mb-4">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                  {settings.site_name}
                </h1>
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-medium text-cyan-400 animate-fade-in delay-100">
                Hello, I'm
              </h3>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                {data.user.name}
              </h1>
              <div className="h-8 md:h-10">
                <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-gray-300 flex items-center">
                  {typedText}
                  <span className="ml-1 inline-block w-0.5 h-6 bg-purple-400 animate-pulse"></span>
                </h2>
              </div>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed max-w-lg animate-fade-in delay-300">
              {data.user.bio}
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3 animate-fade-in delay-400">
              {socialLinks.map((link, index) => (
                link.href !== "#" && (
                  <a
                    key={index}
                    href={link.href}
                    aria-label={link.label}
                    className="group relative p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <link.icon 
                      size={22} 
                      className="text-gray-400 group-hover:text-purple-400 transition-colors duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:to-cyan-500/10 rounded-xl transition-all duration-300"></div>
                  </a>
                )
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-500">
              <Button
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                onClick={handleDownloadCV}
              >
                <Download className="mr-2 h-5 w-5" /> 
                Download CV
              </Button>
              <Button
                variant="outline"
                className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105"
                asChild
              >
                <a href={`mailto:${data.user.email}`}>
                  <Mail className="mr-2 h-5 w-5" /> 
                  Contact Me
                </a>
              </Button>
            </div>
          </div>
          
          {/* Profile Image Section */}
          <div className="lg:w-1/2 relative flex justify-center">
            {/* Background effects */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 blur-2xl animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 md:w-88 md:h-88 rounded-full border border-purple-500/30 animate-spin-slow"></div>
            </div>
            
            {/* Profile Image */}
            <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 mx-auto animate-float">
              {profileImage && !imageError ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-800/50 border border-purple-500/30">
                      <div className="animate-spin h-12 w-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"></div>
                    </div>
                  )}
                  <img
                    src={profileImage}
                    alt={data.user.name}
                    className={`rounded-full object-cover border-4 border-gradient-to-br from-purple-500 to-cyan-500 shadow-2xl shadow-purple-500/25 w-full h-full transition-all duration-500 hover:scale-105 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      setImageError(true);
                      setImageLoaded(true);
                    }}
                    loading="lazy"
                  />
                </>
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-purple-500/30 flex items-center justify-center">
                  <span className="text-4xl md:text-6xl font-bold text-purple-400">
                    {data.user.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
