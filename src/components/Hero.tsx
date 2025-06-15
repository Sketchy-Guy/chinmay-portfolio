
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Mail, Twitter, Instagram, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePortfolioData } from "@/contexts/DataContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Hero = () => {
  const [typedText, setTypedText] = useState("");
  const { data } = usePortfolioData();
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const [imageLoaded, setImageLoaded] = useState(false);
  const fullText = data?.user?.title || "";
  const { toast: uiToast } = useToast();
  const { settings } = useSiteSettings();

  useEffect(() => {
    setImageTimestamp(Date.now());
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
    return null;
  }

  const socialLinks = [
    { icon: Github, href: data.user.social.github || "#", label: "GitHub", color: "#171515" },
    { icon: Linkedin, href: data.user.social.linkedin || "#", label: "LinkedIn", color: "#2867B2" },
    { icon: Twitter, href: data.user.social.twitter || "#", label: "Twitter", color: "#1DA1F2" },
    { icon: Instagram, href: data.user.social.instagram || "#", label: "Instagram", color: "#E4405F" },
    { icon: Facebook, href: data.user.social.facebook || "#", label: "Facebook", color: "#1877F3" },
    { icon: Mail, href: `mailto:${data.user.email}`, label: "Email", color: "#EA4335" },
  ];

  const profileImage = data.user.profileImage
    ? `${data.user.profileImage}?t=${imageTimestamp}`
    : "";

  return (
    <section className="min-h-screen flex flex-col justify-center pt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 animate-fade-in">
            {/* SHOW SITE/PORTFOLIO NAME FROM SETTINGS HERE */}
            {settings.site_name && (
              <h1 className="text-6xl md:text-7xl font-bold mb-2 gradient-text">{settings.site_name}</h1>
            )}
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
                link.href !== "#" && (
                  <a
                    key={index}
                    href={link.href}
                    aria-label={link.label}
                    className="social-icon rounded-full p-2 hover:scale-110 transition-all shadow-lg"
                    rel="noopener noreferrer"
                    target="_blank"
                    style={{
                      backgroundColor: "white",
                      border: `2px solid ${link.color}`,
                      color: link.color,
                    }}
                  >
                    <link.icon size={22} strokeWidth={2} />
                  </a>
                )
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
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md max-h-md z-10">
              <div className="w-full h-full rounded-full bg-portfolio-purple opacity-5 animate-spin-slow blur-3xl"></div>
            </div>
            <div className="w-64 h-64 md:w-80 md:h-80 mx-auto relative z-20 animate-float">
              {!imageLoaded && profileImage && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-100">
                  <div className="animate-spin h-12 w-12 border-4 border-portfolio-purple border-t-transparent rounded-full"></div>
                </div>
              )}
              {profileImage && (
                <img
                  src={profileImage}
                  alt={data.user.name}
                  className={`rounded-full object-cover border-4 border-white shadow-xl w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
