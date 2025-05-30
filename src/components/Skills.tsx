
import { useState, useEffect, useRef } from "react";

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

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>(skillData);
  const [isVisible, setIsVisible] = useState(false);
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
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
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
  }, [isVisible]);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <section ref={sectionRef} id="skills" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="section-title">My Skills</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            I've acquired a diverse set of skills throughout my education and projects. 
            Here's a comprehensive list of my technical and professional competencies.
          </p>
        </div>
        
        <div className="mb-12 overflow-x-auto reveal">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 min-w-max px-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  activeCategory === category 
                  ? "bg-portfolio-purple text-white shadow-lg" 
                  : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-md"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
          {filteredSkills.map((skill, index) => (
            <div 
              key={`${skill.name}-${activeCategory}`}
              className={`glass-card p-6 hover:shadow-xl transition-all duration-500 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                  {skill.name}
                </h3>
                <span className="text-sm font-bold text-portfolio-purple">
                  {skill.level}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-portfolio-purple to-portfolio-teal h-full rounded-full transition-all duration-2000 ease-out relative"
                  style={{ 
                    width: isVisible ? `${skill.level}%` : '0%',
                    transitionDelay: `${index * 100 + 200}ms`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {skill.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
