
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to initialize the portfolio storage bucket
export const initializeStorage = async () => {
  try {
    console.log("Checking storage bucket status...");
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
    }
    
    // Check if the portfolio bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return { success: false, message: bucketsError.message };
    }
    
    const portfolioBucket = buckets.find(bucket => bucket.name === 'portfolio');
    
    if (!portfolioBucket) {
      console.log('Portfolio bucket not found, but should be already created via SQL migration');
      return { success: true, message: 'Portfolio bucket should exist via SQL migration' };
    } else {
      console.log('Portfolio bucket verified');
      return { success: true, message: 'Portfolio bucket exists' };
    }
  } catch (error: any) {
    console.error('Error checking storage bucket:', error);
    return { success: false, message: error.message };
  }
};

// Function to upload a file to the portfolio bucket
export const uploadFile = async (file: File, path: string) => {
  try {
    // First ensure the bucket exists
    const bucketStatus = await initializeStorage();
    if (!bucketStatus.success) {
      console.warn(`Storage initialization warning: ${bucketStatus.message}`);
    }
    
    // Check authentication status before uploading
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Error uploading file: Not authenticated');
      toast.error('Upload failed: You must be logged in to upload files');
      return { success: false, message: 'Not authenticated', path: null };
    }
    
    console.log(`Uploading file to ${path}...`);
    
    // Upload the file with public access
    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      toast.error('Upload failed: ' + error.message);
      return { success: false, message: error.message, path: null };
    }
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(data.path);
    
    console.log('File uploaded successfully:', publicUrl);
    return { success: true, message: 'File uploaded successfully', path: publicUrl };
  } catch (error: any) {
    console.error('Error in uploadFile:', error);
    toast.error('Upload failed: ' + error.message);
    return { success: false, message: error.message, path: null };
  }
};
