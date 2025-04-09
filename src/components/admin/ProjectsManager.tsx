
import { useState } from "react";
import { usePortfolioData, ProjectData } from "@/components/DataManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Edit, Link, Github, ExternalLink, X, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function ProjectsManager() {
  const { data, addProject, removeProject, updateProject } = usePortfolioData();
  const { toast } = useToast();
  const [newProject, setNewProject] = useState<Omit<ProjectData, 'id'>>({ 
    title: "", 
    description: "", 
    technologies: [], 
    image: "",
    github: "",
    demo: ""
  });
  const [editingProject, setEditingProject] = useState<{ index: number; project: ProjectData } | null>(null);
  const [currentTech, setCurrentTech] = useState("");
  const [editCurrentTech, setEditCurrentTech] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) {
      toast({
        title: "Error",
        description: "Project title and description are required.",
        variant: "destructive",
      });
      return;
    }
    
    addProject(newProject as ProjectData);
    setNewProject({ 
      title: "", 
      description: "", 
      technologies: [], 
      image: "",
      github: "",
      demo: ""
    });
    setOpen(false);
    
    toast({
      title: "Project Added",
      description: `${newProject.title} has been added to your projects.`,
    });
  };

  const handleUpdateProject = () => {
    if (!editingProject) return;
    
    updateProject(
      data.projects.findIndex(p => p.id === editingProject.project.id), 
      editingProject.project
    );
    setEditingProject(null);
    setEditOpen(false);
    
    toast({
      title: "Project Updated",
      description: `${editingProject.project.title} has been updated.`,
    });
  };

  const handleEditProject = (project: ProjectData) => {
    const index = data.projects.findIndex(p => p.id === project.id);
    setEditingProject({ index, project: { ...project } });
    setEditOpen(true);
  };

  const handleDeleteProject = (id: number) => {
    const projectTitle = data.projects.find(p => p.id === id)?.title || "Project";
    removeProject(id);
    
    toast({
      title: "Project Removed",
      description: `${projectTitle} has been removed from your projects.`,
    });
  };

  const addTechToNewProject = () => {
    if (!currentTech.trim()) return;
    setNewProject({
      ...newProject,
      technologies: [...(newProject.technologies || []), currentTech.trim()]
    });
    setCurrentTech("");
  };

  const removeTechFromNewProject = (index: number) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies?.filter((_, i) => i !== index) || []
    });
  };

  const addTechToEditProject = () => {
    if (!editCurrentTech.trim() || !editingProject) return;
    setEditingProject({
      ...editingProject,
      project: {
        ...editingProject.project,
        technologies: [...(editingProject.project.technologies || []), editCurrentTech.trim()]
      }
    });
    setEditCurrentTech("");
  };

  const removeTechFromEditProject = (index: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      project: {
        ...editingProject.project,
        technologies: editingProject.project.technologies?.filter((_, i) => i !== index) || []
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-portfolio-purple">Manage Projects</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-portfolio-purple hover:bg-portfolio-purple/90 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <PlusCircle size={16} /> Add New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="projectTitle" className="text-right">Title</Label>
                  <Input
                    id="projectTitle"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="projectDescription" className="text-right pt-2">Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="col-span-3"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="projectImage" className="text-right">Image URL</Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="projectImage"
                      value={newProject.image}
                      onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                      placeholder="URL to project screenshot or image"
                      className="flex-1"
                    />
                    <Image className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="projectGithub" className="text-right">GitHub URL</Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="projectGithub"
                      value={newProject.github || ""}
                      onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                      placeholder="Optional GitHub repository URL"
                      className="flex-1"
                    />
                    <Github className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="projectDemo" className="text-right">Demo URL</Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="projectDemo"
                      value={newProject.demo || ""}
                      onChange={(e) => setNewProject({ ...newProject, demo: e.target.value })}
                      placeholder="Optional live demo URL"
                      className="flex-1"
                    />
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Technologies</Label>
                  <div className="col-span-3">
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={currentTech}
                        onChange={(e) => setCurrentTech(e.target.value)}
                        placeholder="Add technology"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTechToNewProject();
                          }
                        }}
                      />
                      <Button type="button" onClick={addTechToNewProject} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newProject.technologies?.map((tech, index) => (
                        <Badge 
                          key={index} 
                          className="flex items-center gap-1 pl-3"
                          variant="secondary"
                        >
                          {tech}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 text-gray-500 hover:text-gray-700 hover:bg-transparent p-0"
                            onClick={() => removeTechFromNewProject(index)}
                          >
                            <X size={12} />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleAddProject}>Add Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {data.projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {project.image && (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/90 text-blue-600 hover:bg-white hover:text-blue-700"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/90 text-red-600 hover:bg-white hover:text-red-700"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies?.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {project.github && (
                          <a 
                            href={project.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-portfolio-purple transition-colors"
                          >
                            <Github size={18} />
                          </a>
                        )}
                        {project.demo && (
                          <a 
                            href={project.demo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-portfolio-purple transition-colors"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editProjectTitle" className="text-right">Title</Label>
                <Input
                  id="editProjectTitle"
                  value={editingProject.project.title}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    project: { ...editingProject.project, title: e.target.value }
                  })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="editProjectDescription" className="text-right pt-2">Description</Label>
                <Textarea
                  id="editProjectDescription"
                  value={editingProject.project.description}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    project: { ...editingProject.project, description: e.target.value }
                  })}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editProjectImage" className="text-right">Image URL</Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="editProjectImage"
                    value={editingProject.project.image}
                    onChange={(e) => setEditingProject({
                      ...editingProject,
                      project: { ...editingProject.project, image: e.target.value }
                    })}
                    placeholder="URL to project screenshot or image"
                    className="flex-1"
                  />
                  <Image className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editProjectGithub" className="text-right">GitHub URL</Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="editProjectGithub"
                    value={editingProject.project.github || ""}
                    onChange={(e) => setEditingProject({
                      ...editingProject,
                      project: { ...editingProject.project, github: e.target.value }
                    })}
                    placeholder="Optional GitHub repository URL"
                    className="flex-1"
                  />
                  <Github className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editProjectDemo" className="text-right">Demo URL</Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="editProjectDemo"
                    value={editingProject.project.demo || ""}
                    onChange={(e) => setEditingProject({
                      ...editingProject,
                      project: { ...editingProject.project, demo: e.target.value }
                    })}
                    placeholder="Optional live demo URL"
                    className="flex-1"
                  />
                  <ExternalLink className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Technologies</Label>
                <div className="col-span-3">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={editCurrentTech}
                      onChange={(e) => setEditCurrentTech(e.target.value)}
                      placeholder="Add technology"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTechToEditProject();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTechToEditProject} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingProject.project.technologies?.map((tech, index) => (
                      <Badge 
                        key={index} 
                        className="flex items-center gap-1 pl-3"
                        variant="secondary"
                      >
                        {tech}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 text-gray-500 hover:text-gray-700 hover:bg-transparent p-0"
                          onClick={() => removeTechFromEditProject(index)}
                        >
                          <X size={12} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateProject}>Update Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
