
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to initialize the portfolio storage bucket
export const initializeStorage = async () => {
  try {
    console.log("Initializing storage bucket...");
    
    // Check if the bucket already exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return { success: false, message: bucketsError.message };
    }
    
    const portfolioBucket = buckets.find(bucket => bucket.name === 'portfolio');
    
    if (!portfolioBucket) {
      // Create bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket('portfolio', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (error) {
        console.error('Error creating portfolio bucket:', error);
        return { success: false, message: error.message };
      }
      
      // Enable public access to the bucket objects by default
      const { error: policyError } = await supabase.rpc('create_storage_policy', {
        bucket_name: 'portfolio',
        policy_name: 'Public Access',
        definition: `storage.object_owner = auth.uid() OR bucket_id = 'portfolio'`
      });
      
      if (policyError) {
        console.warn('Warning: Could not create storage policy:', policyError);
        // Continue anyway, this is not critical for basic functionality
      }
      
      console.log('Portfolio storage bucket created successfully');
      return { success: true, message: 'Portfolio storage bucket created' };
    }
    
    console.log('Portfolio bucket already exists');
    return { success: true, message: 'Portfolio bucket already exists' };
  } catch (error: any) {
    console.error('Error initializing storage:', error);
    return { success: false, message: error.message };
  }
};

// Function to upload a file to the portfolio bucket
export const uploadFile = async (file: File, path: string) => {
  try {
    // Make sure the bucket exists
    const initResult = await initializeStorage();
    if (!initResult.success) {
      toast('Error initializing storage: ' + initResult.message);
      return { success: false, message: initResult.message, path: null };
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
