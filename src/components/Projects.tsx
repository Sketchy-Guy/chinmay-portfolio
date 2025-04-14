
import { useState } from "react";
import { ArrowRight, Github, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortfolioData } from "@/components/DataManager";

const Projects = () => {
  const { data } = usePortfolioData();
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <section id="projects" className="py-16 md:py-24 bg-gradient-to-b from-portfolio-soft-teal/30 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">My Projects</h2>
          <div className="w-20 h-1 bg-portfolio-teal mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-700 dark:text-gray-300">
            Here are some of my recent projects that showcase my skills and passion for software development.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project) => (
            <Card 
              key={project.id}
              className={`overflow-hidden transition-all duration-300 hover:shadow-xl reveal ${
                hoveredProject === project.id ? 'scale-[1.03]' : 'scale-100'
              }`}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image || "/placeholder.svg"} 
                  alt={project.title}
                  className="w-full h-full object-cover object-center transition-all duration-500"
                  style={{
                    transform: hoveredProject === project.id ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-portfolio-purple/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-4">
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white text-portfolio-purple p-2 rounded-full hover:bg-portfolio-purple hover:text-white transition-colors"
                      >
                        <Github size={20} />
                      </a>
                    )}
                    {project.demo && (
                      <a 
                        href={project.demo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white text-portfolio-purple p-2 rounded-full hover:bg-portfolio-purple hover:text-white transition-colors"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl text-portfolio-purple">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="p-0 text-portfolio-purple hover:text-portfolio-teal hover:bg-transparent"
                  asChild
                >
                  <a href={project.github || project.demo || "#"} target="_blank" rel="noopener noreferrer">
                    View Project <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 reveal">
          <Button className="bg-portfolio-purple hover:bg-portfolio-purple/90" asChild>
            <a href="https://github.com/chinmaykumarpanda" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> View More on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
