import { useState, useEffect } from "react";
import { usePortfolioData, ProjectData } from "@/components/DataManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { Trash2, Upload, Edit, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile } from "@/utils/storage";
import { toast } from "sonner";

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  technologies: z.string().optional(),
  github_url: z.string().url("Must be a valid URL").optional().or(z.string().length(0)),
  demo_url: z.string().url("Must be a valid URL").optional().or(z.string().length(0)),
  image_url: z.string().optional(),
});

export function ProjectsManager() {
  const { data, fetchPortfolioData } = usePortfolioData();
  const { toast: uiToast } = useToast();
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectData[]>(data.projects);
  const [newProjectImage, setNewProjectImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  useEffect(() => {
    setProjects(data.projects);
  }, [data.projects]);
  
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      technologies: "",
      github_url: "",
      demo_url: "",
      image_url: "",
    },
  });

  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      technologies: "",
      github_url: "",
      demo_url: "",
      image_url: "",
    });
    setNewProjectImage(null);
    setIsEditing(false);
    setEditingProjectId(null);
  };

  const handleEditProject = (project: ProjectData) => {
    setIsEditing(true);
    setEditingProjectId(project.id);
    setNewProjectImage(project.image || null);
    
    form.reset({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(", "),
      github_url: project.github || "",
      demo_url: project.demo || "",
      image_url: project.image || "",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploading(true);
    
    try {
      if (!user) {
        throw new Error("You must be logged in to upload an image");
      }
      
      const filePath = `projects/${user.id}/${Math.random().toString(36).substring(2)}_${file.name}`;
      const result = await uploadFile(file, filePath);
      
      if (!result.success) {
        throw new Error(result.message || "Upload failed");
      }
      
      setNewProjectImage(result.path);
      form.setValue('image_url', result.path || '');
      
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: z.infer<typeof projectSchema>) => {
    if (!user) {
      toast.error('You must be logged in to save projects');
      return;
    }
    
    try {
      const technologiesArray = values.technologies?.split(',').map(tech => tech.trim()) || [];
      
      if (isEditing && editingProjectId) {
        let projectId = editingProjectId;
        let uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        if (!uuidPattern.test(projectId)) {
          console.log("Project ID is not a valid UUID, trying to find the actual UUID");
          const { data: projectData, error: fetchError } = await supabase
            .from('projects')
            .select('id')
            .eq('profile_id', user.id)
            .eq('title', values.title)
            .limit(1);
          
          if (fetchError) {
            console.error("Error fetching project:", fetchError);
            throw new Error("Could not find project: " + fetchError.message);
          }
          
          if (projectData && projectData.length > 0) {
            projectId = projectData[0].id;
            console.log("Found project UUID:", projectId);
          } else {
            console.log("No existing project found with this title, creating new");
            const { error } = await supabase
              .from('projects')
              .insert({
                profile_id: user.id,
                title: values.title,
                description: values.description,
                technologies: technologiesArray,
                github_url: values.github_url || null,
                demo_url: values.demo_url || null,
                image_url: newProjectImage || values.image_url || null,
              });
            
            if (error) throw error;
            
            toast.success('Project added successfully');
            await fetchPortfolioData();
            resetForm();
            return;
          }
        }
        
        const { error } = await supabase
          .from('projects')
          .update({
            title: values.title,
            description: values.description,
            technologies: technologiesArray,
            github_url: values.github_url || null,
            demo_url: values.demo_url || null,
            image_url: newProjectImage || values.image_url || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);
        
        if (error) throw error;
        
        toast.success('Project updated successfully');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({
            profile_id: user.id,
            title: values.title,
            description: values.description,
            technologies: technologiesArray,
            github_url: values.github_url || null,
            demo_url: values.demo_url || null,
            image_url: newProjectImage || values.image_url || null,
          });
        
        if (error) throw error;
        
        toast.success('Project added successfully');
      }
      
      await fetchPortfolioData();
      resetForm();
    } catch (error: any) {
      console.error(isEditing ? "Error updating project:" : "Error adding project:", error);
      toast.error(`${isEditing ? 'Update' : 'Add'} failed: ${error.message}`);
    }
  };
  
  const handleDeleteProject = async (id: string) => {
    try {
      if (!user) {
        throw new Error("You must be logged in to delete projects");
      }
      
      let projectId = id;
      let uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (!uuidPattern.test(projectId)) {
        console.log("Project ID is not a valid UUID for deletion, trying to find the actual UUID");
        const project = projects.find(p => p.id === id);
        
        if (!project) {
          throw new Error("Could not find project with ID: " + id);
        }
        
        const { data: projectData, error: fetchError } = await supabase
          .from('projects')
          .select('id')
          .eq('profile_id', user.id)
          .eq('title', project.title)
          .limit(1);
        
        if (fetchError) {
          console.error("Error fetching project for deletion:", fetchError);
          throw new Error("Could not find project: " + fetchError.message);
        }
        
        if (projectData && projectData.length > 0) {
          projectId = projectData[0].id;
          console.log("Found project UUID for deletion:", projectId);
        } else {
          throw new Error("Could not find project with title: " + project.title);
        }
      }
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
      
      await fetchPortfolioData();
      
      if (id === editingProjectId) {
        resetForm();
      }
      
      toast.success('Project deleted successfully');
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error('Delete failed: ' + error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-portfolio-purple">
            {isEditing ? 'Edit Project' : 'Add New Project'}
          </CardTitle>
          {isEditing && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={resetForm}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Project Image</label>
                <div className="flex items-center space-x-6">
                  <div className="relative w-32 h-32 rounded-md overflow-hidden border-2 border-gray-200 shadow-md">
                    <img 
                      src={newProjectImage || form.getValues("image_url") || "/placeholder.svg"} 
                      alt="Project" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('project-image-upload')?.click()}
                      disabled={uploading}
                      className="flex items-center"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    <input
                      id="project-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: Square image, at least 300x300 pixels
                    </p>
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Project Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write a brief description about the project..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies Used</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., React, Node.js, Tailwind CSS" {...field} />
                    </FormControl>
                    <FormDescription>Separate each technology with a comma.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="github_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username/repo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="demo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://projectdemo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="bg-portfolio-purple hover:bg-portfolio-purple/90 transition-all duration-300 transform hover:scale-105"
              >
                {isEditing ? 'Update Project' : 'Add Project'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Existing Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 rounded-md shadow-sm border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200">
                      <img 
                        src={project.image || "/placeholder.svg"} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{project.title}</h3>
                      <p className="text-sm text-gray-500">{project.description.substring(0, 50)}...</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No projects added yet. Add your first project above.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
