
import { useState } from "react";
import { usePortfolioData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Upload, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile, initializeStorage, createStorageBucket } from "@/utils/storage";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  email: z.string().email("Must be a valid email"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  github: z.string().url("Must be a valid URL").optional().or(z.string().length(0)),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.string().length(0)),
  twitter: z.string().url("Must be a valid URL").optional().or(z.string().length(0)),
  instagram: z.string().url("Must be a valid URL").optional().or(z.string().length(0)),
  facebook: z.string().url("Must be a valid URL").optional().or(z.string().length(0)),
  profileImage: z.string().optional(),
});

export function ProfileForm() {
  const { data, updateUserData, fetchPortfolioData } = usePortfolioData();
  const { toast: uiToast } = useToast();
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState(data.user.profileImage || "/lovable-uploads/78295e37-4b4d-4900-b613-21ed6626ab3f.png");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: data.user.name,
      title: data.user.title,
      email: data.user.email,
      phone: data.user.phone,
      location: data.user.location,
      bio: data.user.bio,
      github: data.user.social.github,
      linkedin: data.user.social.linkedin,
      twitter: data.user.social.twitter,
      instagram: data.user.social.instagram,
      facebook: data.user.social.facebook,
      profileImage: data.user.profileImage,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploading(true);
    setUploadError("");
    
    try {
      if (!user) {
        throw new Error("You must be logged in to upload an image");
      }
      
      // Ensure bucket exists and is properly initialized
      console.log("Initializing storage for profile image upload...");
      
      // Try to create the bucket first in case it doesn't exist
      await createStorageBucket();
      
      // Then initialize storage
      const bucketInitResult = await initializeStorage();
      if (!bucketInitResult.success) {
        throw new Error(`Storage bucket not available: ${bucketInitResult.message}`);
      }
      
      const filePath = `profile/${user.id}/${Math.random().toString(36).substring(2)}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      console.log("Uploading profile image to path:", filePath);
      
      const result = await uploadFile(file, filePath);
      
      if (!result.success) {
        throw new Error(result.message || "Failed to upload image");
      }
      
      setImagePreview(result.path || imagePreview);
      form.setValue('profileImage', result.path || '');
      
      // Update the user data immediately with the new image
      await updateUserData({
        ...data.user,
        profileImage: result.path
      });
      
      toast.success('Profile image uploaded successfully');
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setUploadError(error.message || "There was an error uploading your image");
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      // Update user data in context and database
      await updateUserData({
        name: values.name,
        title: values.title,
        email: values.email,
        phone: values.phone || "",
        location: values.location || "",
        bio: values.bio,
        profileImage: values.profileImage,
        social: {
          github: values.github || "",
          linkedin: values.linkedin || "",
          twitter: values.twitter || "",
          instagram: values.instagram || "",
          facebook: values.facebook || "",
        },
      });
      
      // Refresh data after update
      await fetchPortfolioData();
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error('Update failed: ' + error.message);
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
          <CardTitle className="text-2xl font-bold text-portfolio-purple">Manage Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Profile Image</label>
            <div className="flex items-center space-x-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={imagePreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/lovable-uploads/78295e37-4b4d-4900-b613-21ed6626ab3f.png";
                  }}
                />
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('profile-image-upload')?.click()}
                  disabled={uploading}
                  className="flex items-center"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: Square image, at least 300x300 pixels
                </p>
                {uploadError && (
                  <div className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {uploadError}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Software Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="New York, NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write a brief description about yourself..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="bg-portfolio-purple hover:bg-portfolio-purple/90 transition-all duration-300 transform hover:scale-105"
              >
                Update Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
