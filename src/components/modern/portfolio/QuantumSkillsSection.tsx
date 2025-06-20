
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Code, Database, Globe, Wrench, Brain, Users, Zap, Cpu } from "lucide-react";

interface Skill {
  name: string;
  category: string;
  level: number;
  icon?: any;
}

const skillData: Skill[] = [
  { name: "Python", category: "Programming Languages", level: 90, icon: Code },
  { name: "JavaScript", category: "Programming Languages", level: 85, icon: Code },
  { name: "Java", category: "Programming Languages", level: 75, icon: Code },
  { name: "C", category: "Programming Languages", level: 70, icon: Code },
  { name: "MySQL", category: "Databases", level: 80, icon: Database },
  { name: "Firebase", category: "Databases", level: 75, icon: Database },
  { name: "MongoDB", category: "Databases", level: 70, icon: Database },
  { name: "HTML", category: "Web Development", level: 95, icon: Globe },
  { name: "CSS", category: "Web Development", level: 90, icon: Globe },
  { name: "React.js", category: "Web Development", level: 85, icon: Globe },
  { name: "Node.js", category: "Web Development", level: 80, icon: Globe },
  { name: "Git", category: "Tools & Platforms", level: 85, icon: Wrench },
  { name: "VS Code", category: "Tools & Platforms", level: 95, icon: Wrench },
  { name: "Figma", category: "Tools & Platforms", level: 75, icon: Wrench },
  { name: "AI Prompting", category: "AI & ML", level: 90, icon: Brain },
  { name: "OpenAI/Gemini APIs", category: "AI & ML", level: 85, icon: Brain },
  { name: "Machine Learning", category: "AI & ML", level: 75, icon: Brain },
  { name: "Team Leadership", category: "Soft Skills", level: 90, icon: Users },
  { name: "Communication", category: "Soft Skills", level: 85, icon: Users },
];

const categoryIcons = {
  "Programming Languages": Code,
  "Databases": Database,
  "Web Development": Globe,
  "Tools & Platforms": Wrench,
  "AI & ML": Brain,
  "Soft Skills": Users,
};

const categoryColors = {
  "Programming Languages": "from-purple-500 to-pink-500",
  "Databases": "from-green-500 to-emerald-500",
  "Web Development": "from-blue-500 to-cyan-500",
  "Tools & Platforms": "from-orange-500 to-amber-500",
  "AI & ML": "from-indigo-500 to-purple-500",
  "Soft Skills": "from-teal-500 to-cyan-500",
};

const QuantumSkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>(skillData);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  const categories = ["All", ...Array.from(new Set(skillData.map(skill => skill.category)))];
  
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredSkills(skillData);
    } else {
      setFilteredSkills(skillData.filter(skill => skill.category === activeCategory));
    }
  }, [activeCategory]);

  return (
    <section ref={sectionRef} id="skills" className="py-24 relative overflow-hidden">
      {/* Quantum Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-cyan-900/20"></div>
      
      {/* Animated Quantum Grid */}
      <div className="absolute inset-0 quantum-grid opacity-20"></div>
      
      {/* Floating Quantum Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
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
            Quantum <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400">Skills</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Mastering the art of digital creation through quantum-enhanced skill acquisition and neural network optimization
          </p>
        </motion.div>
        
        {/* Quantum Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16 overflow-x-auto"
        >
          <div className="flex flex-wrap justify-center gap-4 min-w-max px-4">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-full text-sm font-medium transition-all duration-300 font-orbitron border-2 relative overflow-hidden ${
                  activeCategory === category 
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg border-transparent" 
                  : "bg-white/5 backdrop-blur-md text-gray-300 border-purple-500/30 hover:border-purple-400/50 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        {/* Quantum Skills Constellation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredSkills.map((skill, index) => {
            const IconComponent = categoryIcons[skill.category as keyof typeof categoryIcons] || Code;
            const gradientClass = categoryColors[skill.category as keyof typeof categoryColors];
            
            return (
              <motion.div
                key={`${skill.name}-${activeCategory}`}
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  bounce: 0.3
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  z: 10
                }}
                className="quantum-skill-card group cursor-pointer relative"
                onHoverStart={() => setHoveredSkill(skill.name)}
                onHoverEnd={() => setHoveredSkill(null)}
              >
                {/* Quantum Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 via-cyan-500/50 to-pink-500/50 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full flex flex-col items-center text-center group-hover:border-white/30 transition-all duration-300">
                  {/* Skill Icon with Quantum Effects */}
                  <div className={`skill-icon-quantum w-16 h-16 mb-6 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white relative z-10" />
                    
                    {/* Quantum Pulse Effect */}
                    <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                    
                    {/* Floating Particles */}
                    {hoveredSkill === skill.name && (
                      <>
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            initial={{ 
                              x: 0, 
                              y: 0, 
                              opacity: 0 
                            }}
                            animate={{ 
                              x: (Math.random() - 0.5) * 40,
                              y: (Math.random() - 0.5) * 40,
                              opacity: [0, 1, 0]
                            }}
                            transition={{ 
                              duration: 1,
                              delay: i * 0.2,
                              repeat: Infinity
                            }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                  
                  {/* Skill Name */}
                  <h3 className="font-bold text-lg text-white mb-3 font-orbitron group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                    {skill.name}
                  </h3>
                  
                  {/* Quantum Progress Ring */}
                  <div className="relative w-20 h-20 mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      {/* Background Ring */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                      />
                      {/* Progress Ring */}
                      <motion.path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeDasharray={`${skill.level}, 100`}
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0, 100" }}
                        whileInView={{ strokeDasharray: `${skill.level}, 100` }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="50%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Percentage Display */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white font-orbitron">
                        {skill.level}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="mt-auto">
                    <span className="text-xs text-gray-400 font-orbitron px-3 py-1 bg-white/5 rounded-full border border-white/10">
                      {skill.category}
                    </span>
                  </div>
                  
                  {/* Quantum Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default QuantumSkillsSection;
