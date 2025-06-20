import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Award, Briefcase } from "lucide-react";
import { usePortfolioData } from "@/contexts/DataContext";

const QuantumTimeline = () => {
  const { data } = usePortfolioData();
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Sample timeline data (can be replaced with database data)
  const timelineData = [
    {
      id: 1,
      title: "Computer Science Graduate",
      organization: "University Name",
      type: "education",
      date: "2024",
      location: "Bhubaneswar, India",
      description: "Completed Bachelor's degree in Computer Science with focus on AI and Software Development.",
      achievements: ["First Class Honors", "AI Research Project", "Programming Club President"]
    },
    {
      id: 2,
      title: "Full Stack Developer Intern",
      organization: "Tech Company",
      type: "work",
      date: "2023",
      location: "Remote",
      description: "Developed web applications using React, Node.js, and modern databases.",
      achievements: ["Built 3 production apps", "Mentored junior developers", "Improved system performance by 40%"]
    },
    {
      id: 3,
      title: "AI/ML Certification",
      organization: "Online Platform",
      type: "certification",
      date: "2023",
      location: "Online",
      description: "Completed comprehensive Machine Learning and AI certification program.",
      achievements: ["95% Course Completion", "3 ML Projects", "Expert Level Badge"]
    },
    {
      id: 4,
      title: "Hackathon Winner",
      organization: "National Coding Competition",
      type: "achievement",
      date: "2022",
      location: "Delhi, India",
      description: "Won first place in national level hackathon with innovative AI solution.",
      achievements: ["1st Place Winner", "Best Innovation Award", "Cash Prize ₹50,000"]
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "education": return Calendar;
      case "work": return Briefcase;
      case "certification": return Award;
      case "achievement": return Award;
      default: return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "education": return "from-blue-500 to-cyan-500";
      case "work": return "from-green-500 to-emerald-500";
      case "certification": return "from-purple-500 to-indigo-500";
      case "achievement": return "from-yellow-500 to-orange-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <section ref={sectionRef} id="timeline" className="py-24 relative overflow-hidden">
      {/* Quantum Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-blue-900/30 to-indigo-900/20"></div>
      
      {/* Animated Matrix Grid */}
      <div className="absolute inset-0 matrix-rain opacity-5"></div>
      
      {/* Floating Timeline Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Quantum Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-orbitron">
            Quantum <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Timeline</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Journey through parallel dimensions of my educational and professional evolution
          </p>
        </motion.div>
        
        {/* Quantum Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 h-full opacity-50"></div>
          
          {timelineData.map((item, index) => {
            const IconComponent = getIcon(item.type);
            const colorClass = getTypeColor(item.type);
            const isLeft = index % 2 === 0;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  type: "spring",
                  bounce: 0.3
                }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-16 ${isLeft ? 'justify-start' : 'justify-end'}`}
                onHoverStart={() => setActiveItem(item.id)}
                onHoverEnd={() => setActiveItem(null)}
              >
                {/* Timeline Item */}
                <div className={`w-full max-w-md ${isLeft ? 'mr-8' : 'ml-8'} group cursor-pointer`}>
                  <motion.div
                    whileHover={{ scale: 1.02, rotateY: isLeft ? 5 : -5 }}
                    className="relative bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group-hover:border-white/30 transition-all duration-300"
                  >
                    {/* Timeline Icon */}
                    <div className={`absolute ${isLeft ? '-right-12' : '-left-12'} top-8 w-8 h-8 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center z-10 shadow-lg`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-4">
                      {/* Header */}
                      <div>
                        <h3 className="font-bold text-xl text-white mb-2 font-orbitron group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-400 transition-all duration-300">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                          <span className="font-medium text-indigo-300">{item.organization}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-300 leading-relaxed">
                        {item.description}
                      </p>
                      
                      {/* Achievements */}
                      {item.achievements && item.achievements.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-indigo-300 font-orbitron">Key Achievements:</h4>
                          <ul className="space-y-1">
                            {item.achievements.map((achievement, achIndex) => (
                              <li key={achIndex} className="text-sm text-gray-300 flex items-center gap-2">
                                <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Type Badge */}
                      <div className="flex justify-end">
                        <span className={`text-xs px-3 py-1 bg-gradient-to-r ${colorClass} text-white rounded-full font-orbitron capitalize`}>
                          {item.type}
                        </span>
                      </div>
                    </div>
                    
                    {/* Quantum Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                  </motion.div>
                </div>
                
                {/* Connection Line to Center */}
                <div className={`absolute ${isLeft ? 'right-4' : 'left-4'} top-10 w-4 h-0.5 bg-gradient-to-r ${colorClass} opacity-60`}></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuantumTimeline;
