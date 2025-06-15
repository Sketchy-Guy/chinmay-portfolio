import { useState, useEffect, useRef } from "react";
import { Code, Database, Globe, Wrench, Brain, Users } from "lucide-react";

interface Skill {
  name: string;
  category: string;
  level: number;
}

const skillData: Skill[] = [
  { name: "Python", category: "Programming Languages", level: 90 },
  { name: "JavaScript", category: "Programming Languages", level: 85 },
  { name: "Java", category: "Programming Languages", level: 75 },
  { name: "C", category: "Programming Languages", level: 70 },
  { name: "MySQL", category: "Databases", level: 80 },
  { name: "Firebase", category: "Databases", level: 75 },
  { name: "MongoDB", category: "Databases", level: 70 },
  { name: "HTML", category: "Web Development", level: 95 },
  { name: "CSS", category: "Web Development", level: 90 },
  { name: "React.js", category: "Web Development", level: 85 },
  { name: "Node.js", category: "Web Development", level: 80 },
  { name: "Git", category: "Tools & Platforms", level: 85 },
  { name: "VS Code", category: "Tools & Platforms", level: 95 },
  { name: "Figma", category: "Tools & Platforms", level: 75 },
  { name: "Canva", category: "Tools & Platforms", level: 90 },
  { name: "Data Structures", category: "Technical Skills", level: 85 },
  { name: "Algorithms", category: "Technical Skills", level: 80 },
  { name: "AI Prompting", category: "AI & ML", level: 90 },
  { name: "OpenAI/Gemini APIs", category: "AI & ML", level: 85 },
  { name: "Machine Learning", category: "AI & ML", level: 75 },
  { name: "Team Leadership", category: "Soft Skills", level: 90 },
  { name: "Communication", category: "Soft Skills", level: 85 },
  { name: "Project Coordination", category: "Soft Skills", level: 90 },
  { name: "Public Speaking", category: "Soft Skills", level: 80 },
];

const categoryIcons = {
  "Programming Languages": Code,
  "Databases": Database,
  "Web Development": Globe,
  "Tools & Platforms": Wrench,
  "AI & ML": Brain,
  "Technical Skills": Code,
  "Soft Skills": Users,
};

const categoryColors = {
  "Programming Languages": "from-purple-500 to-pink-500",
  "Databases": "from-green-500 to-emerald-500",
  "Web Development": "from-blue-500 to-cyan-500",
  "Tools & Platforms": "from-orange-500 to-amber-500",
  "AI & ML": "from-indigo-500 to-purple-500",
  "Technical Skills": "from-red-500 to-rose-500",
  "Soft Skills": "from-teal-500 to-cyan-500",
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>(skillData);
  const [visibleSkills, setVisibleSkills] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  
  const categories = ["All", ...Array.from(new Set(skillData.map(skill => skill.category)))];
  
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredSkills(skillData);
    } else {
      setFilteredSkills(skillData.filter(skill => skill.category === activeCategory));
    }
  }, [activeCategory]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger animations for visible skills
          const newVisibleSkills = new Array(filteredSkills.length).fill(false);
          filteredSkills.forEach((_, index) => {
            setTimeout(() => {
              setVisibleSkills(prev => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
              });
            }, index * 100);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [filteredSkills]);

  useEffect(() => {
    // Reset animations when category changes
    setVisibleSkills(new Array(filteredSkills.length).fill(false));
    const timer = setTimeout(() => {
      const newVisibleSkills = new Array(filteredSkills.length).fill(false);
      filteredSkills.forEach((_, index) => {
        setTimeout(() => {
          setVisibleSkills(prev => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
        }, index * 100);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [activeCategory, filteredSkills]);

  return (
    <section ref={sectionRef} id="skills" className="py-16 md:py-24 bg-gray-900/50 backdrop-blur-sm cyber-grid">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron holographic-text">
            Neural Capabilities
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-300 text-lg leading-relaxed glass-morphism p-6 rounded-2xl border border-purple-500/20">
            Advanced skill matrix acquired through continuous learning protocols and practical implementation.
          </p>
        </div>
        
        <div className="mb-12 overflow-x-auto reveal">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 min-w-max px-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 font-orbitron border-2 ${
                  activeCategory === category 
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg border-transparent neon-border" 
                  : "glass-morphism hover:glass-morphism text-gray-300 border-purple-500/30 hover:border-purple-400/50 hover:text-white"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 reveal-stagger">
          {filteredSkills.map((skill, index) => {
            const IconComponent = categoryIcons[skill.category as keyof typeof categoryIcons] || Code;
            const gradientClass = categoryColors[skill.category as keyof typeof categoryColors];
            const isVisible = visibleSkills[index];
            
            return (
              <div 
                key={`${skill.name}-${activeCategory}`}
                className={`skill-badge group transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center h-full">
                  <div className={`skill-icon w-12 h-12 glass-morphism rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradientClass} shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="font-semibold text-lg text-white mb-2 font-orbitron text-center">
                    {skill.name}
                  </h3>
                  
                  <div className="w-full mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 font-medium">Proficiency</span>
                      <span className="text-sm font-bold text-purple-400">
                        {skill.level}%
                      </span>
                    </div>
                    
                    <div className="progress-ring relative">
                      <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden border border-purple-500/20">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-2000 ease-out relative`}
                          style={{ 
                            width: isVisible ? `${skill.level}%` : '0%',
                            transitionDelay: `${index * 100 + 400}ms`
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent data-stream"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-auto text-center font-medium">
                    {skill.category}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
