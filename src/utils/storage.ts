
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to initialize the portfolio storage bucket - now simplified since we manage it through SQL
export const initializeStorage = async () => {
  try {
    console.log("Checking storage bucket status...");
    
    // Check if the bucket exists (but don't try to create it if it doesn't)
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return { success: false, message: bucketsError.message };
    }
    
    const portfolioBucket = buckets.find(bucket => bucket.name === 'portfolio');
    
    if (!portfolioBucket) {
      console.log('Portfolio bucket not found. Using the one created by SQL migration.');
      return { success: true, message: 'Portfolio bucket managed by SQL migration' };
    }
    
    console.log('Portfolio bucket verified');
    return { success: true, message: 'Portfolio bucket exists' };
  } catch (error: any) {
    console.error('Error checking storage bucket:', error);
    return { success: false, message: error.message };
  }
};

// Function to upload a file to the portfolio bucket
export const uploadFile = async (file: File, path: string) => {
  try {
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
      toast('Upload failed: ' + error.message);
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
    toast('Upload failed: ' + error.message);
    return { success: false, message: error.message, path: null };
  }
};
