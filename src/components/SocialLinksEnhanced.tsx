import { motion } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Facebook, 
  Mail, 
  Globe,
  Youtube,
  MessageCircle
} from 'lucide-react';
import { usePortfolioData } from '@/contexts/DataContext';

const SocialLinksEnhanced = () => {
  const { data, isLoading } = usePortfolioData();

  const socialIcons = {
    github: { icon: Github, color: 'from-gray-600 to-gray-800', hoverColor: 'hover:from-gray-500 hover:to-gray-700' },
    linkedin: { icon: Linkedin, color: 'from-blue-600 to-blue-800', hoverColor: 'hover:from-blue-500 hover:to-blue-700' },
    twitter: { icon: Twitter, color: 'from-sky-500 to-sky-700', hoverColor: 'hover:from-sky-400 hover:to-sky-600' },
    instagram: { icon: Instagram, color: 'from-pink-500 to-purple-600', hoverColor: 'hover:from-pink-400 hover:to-purple-500' },
    facebook: { icon: Facebook, color: 'from-blue-700 to-blue-900', hoverColor: 'hover:from-blue-600 hover:to-blue-800' },
    youtube: { icon: Youtube, color: 'from-red-600 to-red-800', hoverColor: 'hover:from-red-500 hover:to-red-700' },
    website: { icon: Globe, color: 'from-emerald-600 to-emerald-800', hoverColor: 'hover:from-emerald-500 hover:to-emerald-700' },
    email: { icon: Mail, color: 'from-purple-600 to-purple-800', hoverColor: 'hover:from-purple-500 hover:to-purple-700' },
    whatsapp: { icon: MessageCircle, color: 'from-green-600 to-green-800', hoverColor: 'hover:from-green-500 hover:to-green-700' }
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 justify-center lg:justify-start">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-14 h-14 rounded-xl bg-slate-800/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Get all social links from data, including email
  const socialLinks = [
    { platform: 'github', url: data.user.social.github, label: 'GitHub' },
    { platform: 'linkedin', url: data.user.social.linkedin, label: 'LinkedIn' },
    { platform: 'twitter', url: data.user.social.twitter, label: 'Twitter' },
    { platform: 'instagram', url: data.user.social.instagram, label: 'Instagram' },
    { platform: 'facebook', url: data.user.social.facebook, label: 'Facebook' },
    { platform: 'email', url: data.user.email ? `mailto:${data.user.email}` : null, label: 'Email' }
  ].filter(social => social.url); // Only show links that have URLs

  if (socialLinks.length === 0) {
    return (
      <div className="text-center text-gray-400">
        <p>No social links available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.6 }}
      className="flex gap-4 justify-center lg:justify-start flex-wrap"
    >
      {socialLinks.map((social, index) => {
        const socialConfig = socialIcons[social.platform as keyof typeof socialIcons];
        
        if (!socialConfig) return null;
        
        const IconComponent = socialConfig.icon;
        
        return (
          <motion.a
            key={social.platform}
            href={social.url!}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative w-14 h-14 rounded-xl bg-slate-900/60 backdrop-blur-md border border-blue-400/30 flex items-center justify-center text-blue-400 hover:text-white transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r ${socialConfig.color} ${socialConfig.hoverColor}`}
            whileHover={{ scale: 1.1, rotateY: 180 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
            title={social.label}
          >
            <IconComponent className="w-6 h-6 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {social.label}
            </div>
          </motion.a>
        );
      })}
    </motion.div>
  );
};

export default SocialLinksEnhanced;