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
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { Trash2, Plus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  technologies: z.string().optional(),
  github_url: z.string().url("Must be a valid URL").optional(),
  demo_url: z.string().url("Must be a valid URL").optional(),
  image_url: z.string().optional(),
});

export function ProjectsManager() {
  const { data, updateProject, addProject, removeProject, fetchPortfolioData } = usePortfolioData();
  const { toast } = useToast();
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectData[]>(data.projects);
  const [newProjectImage, setNewProjectImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploading(true);
    
    try {
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `projects/${user?.id}/${fileName}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);
      
      if (publicUrlData) {
        const imageUrl = publicUrlData.publicUrl;
        setNewProjectImage(imageUrl);
        form.setValue('image_url', imageUrl);
        
        toast({
          title: "Image Uploaded",
          description: "Your project image has been successfully updated."
        });
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "There was an error uploading your image.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (project: ProjectData) => {
    const technologiesArray = form.getValues("technologies")?.split(',').map(tech => tech.trim()) || [];
    
    try {
      if (user) {
        const { error } = await supabase
          .from('projects')
          .upsert({
            profile_id: user.id,
            title: form.getValues("title"),
            description: form.getValues("description"),
            technologies: technologiesArray,
            github_url: form.getValues("github_url") || null,
            demo_url: form.getValues("demo_url") || null,
            image_url: newProjectImage || form.getValues("image_url") || null,
          });
        
        if (error) throw error;
        
        // After successfully saving to Supabase, fetch the latest data
        await fetchPortfolioData();
        
        toast({
          title: "Project Saved",
          description: "The project has been successfully saved.",
        });
      }
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast({
        title: "Save Failed",
        description: error.message || "There was an error saving the project.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddProject = async () => {
    const technologiesArray = form.getValues("technologies")?.split(',').map(tech => tech.trim()) || [];
    
    try {
      if (user) {
        const { data: newProject, error } = await supabase
          .from('projects')
          .insert({
            profile_id: user.id,
            title: form.getValues("title"),
            description: form.getValues("description"),
            technologies: technologiesArray,
            github_url: form.getValues("github_url") || null,
            demo_url: form.getValues("demo_url") || null,
            image_url: newProjectImage || form.getValues("image_url") || null,
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // After successfully saving to Supabase, fetch the latest data
        await fetchPortfolioData();
        
        toast({
          title: "Project Added",
          description: "The project has been successfully added.",
        });
      }
    } catch (error: any) {
      console.error("Error adding project:", error);
      toast({
        title: "Add Failed",
        description: error.message || "There was an error adding the project.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteProject = async (id: number) => {
    try {
      if (user) {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // After successfully deleting from Supabase, fetch the latest data
        await fetchPortfolioData();
        
        toast({
          title: "Project Deleted",
          description: "The project has been successfully deleted.",
        });
      }
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast({
        title: "Delete Failed",
        description: error.message || "There was an error deleting the project.",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-portfolio-purple">Manage Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Project Image</label>
                <div className="flex items-center space-x-6">
                  <div className="relative w-32 h-32 rounded-md overflow-hidden border-2 border-gray-200 shadow-md">
                    <img 
                      src={newProjectImage || form.getValues("image_url") || "/placeholder-image.png"} 
                      alt="Project" 
                      className="w-full h-full object-cover"
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
                type="button" 
                className="bg-portfolio-purple hover:bg-portfolio-purple/90 transition-all duration-300 transform hover:scale-105"
                onClick={handleAddProject}
              >
                Add Project
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
                  <div>
                    <h3 className="text-lg font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.description.substring(0, 50)}...</p>
                  </div>
                  <Button 
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
