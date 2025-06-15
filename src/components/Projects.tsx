
import { useState, useEffect } from "react";
import { ArrowRight, Github, ExternalLink, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortfolioData } from "@/contexts/DataContext";
import { ProjectData } from "@/types/portfolio";

const ProjectCard = ({ project, isHovered, onHover, onLeaveHover, index }: { 
  project: ProjectData, 
  isHovered: boolean, 
  onHover: () => void, 
  onLeaveHover: () => void,
  index: number
}) => {
  return (
    <Card 
      className={`project-card overflow-hidden transition-all duration-500 ease-out reveal-stagger relative ${
        isHovered ? 'scale-[1.02] -translate-y-2 shadow-2xl shadow-purple-500/25' : 'shadow-xl'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeaveHover}
    >
      <div className="relative h-48 overflow-hidden rounded-xl mb-6">
        <img 
          src={project.image || "/placeholder.svg"} 
          alt={project.title}
          className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-3 justify-center">
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary p-3 rounded-full hover:scale-110 transition-all duration-300"
              >
                <Github size={20} />
              </a>
            )}
            {project.demo && (
              <a 
                href={project.demo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary p-3 rounded-full hover:scale-110 transition-all duration-300"
              >
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>
        <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
          <Star className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xl text-white mb-2 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400 transition-all duration-500">
          {project.title}
        </CardTitle>
        <CardDescription className="text-gray-300 hover:text-gray-200 transition-colors duration-300">
          {project.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0 mb-6">
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-white/10 backdrop-blur-sm text-gray-300 text-xs rounded-full border border-white/20 hover:border-purple-400/50 hover:bg-purple-500/20 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-0">
        <Button 
          className="btn-primary w-full"
          asChild
        >
          <a href={project.github || project.demo || "#"} target="_blank" rel="noopener noreferrer">
            View Project <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </Button>
      </CardFooter>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-400/5 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
    </Card>
  );
};

const Projects = () => {
  const { data } = usePortfolioData();
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('projects');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-l from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className={`max-w-4xl mx-auto text-center mb-20 ${isVisible ? 'reveal active' : 'reveal'}`}>
          <h2 className="section-title">Featured Projects</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mt-6">
            Explore my latest projects that showcase cutting-edge technologies, innovative solutions, 
            and my passion for creating exceptional digital experiences.
          </p>
        </div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto p-6">
          {data.projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              isHovered={hoveredProject === project.id}
              onHover={() => setHoveredProject(project.id)}
              onLeaveHover={() => setHoveredProject(null)}
              index={index}
            />
          ))}
        </div>
        
        {/* GitHub CTA */}
        <div className={`text-center mt-20 ${isVisible ? 'reveal-stagger active' : 'reveal-stagger'}`} style={{ animationDelay: '0.8s' }}>
          <div className="glass-card-enhanced p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold gradient-text mb-4">Explore More Projects</h3>
            <p className="text-gray-300 mb-6">
              Discover additional projects and contributions on my GitHub profile
            </p>
            <Button className="btn-primary" asChild>
              <a href="https://github.com/chinmaykumarpanda" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" /> 
                View GitHub Profile
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
