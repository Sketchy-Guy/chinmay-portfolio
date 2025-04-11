
import { supabase } from '@/integrations/supabase/client';

// Function to initialize the portfolio storage bucket
export const initializeStorage = async () => {
  try {
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
      
      console.log('Portfolio storage bucket created successfully');
      return { success: true, message: 'Portfolio storage bucket created' };
    }
    
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
    await initializeStorage();
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      return { success: false, message: error.message, path: null };
    }
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(data.path);
    
    return { success: true, message: 'File uploaded successfully', path: publicUrl };
  } catch (error: any) {
    console.error('Error in uploadFile:', error);
    return { success: false, message: error.message, path: null };
  }
};
