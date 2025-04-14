
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to initialize the portfolio storage bucket
export const initializeStorage = async () => {
  try {
    console.log("Checking storage bucket status...");
    
    // Check if the portfolio bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return { success: false, message: bucketsError.message };
    }
    
    const portfolioBucket = buckets.find(bucket => bucket.name === 'portfolio');
    
    if (!portfolioBucket) {
      console.log('Portfolio bucket not found. Creating it now...');
      
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('portfolio', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });
      
      if (createError) {
        console.error('Error creating portfolio bucket:', createError);
        return { success: false, message: createError.message };
      }
      
      console.log('Portfolio bucket created successfully');
    } else {
      console.log('Portfolio bucket verified');
    }
    
    return { success: true, message: 'Portfolio bucket exists' };
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
      throw new Error(`Storage not initialized: ${bucketStatus.message}`);
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
