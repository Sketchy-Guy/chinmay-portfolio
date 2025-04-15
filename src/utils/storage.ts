
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Helper function to check file size with better error message
const validateFileSize = (file: File, maxSizeInMB: number = 5) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      message: `File size exceeds the maximum allowed size of ${maxSizeInMB}MB. Please crop or resize the image.`
    };
  }
  return { valid: true, message: 'File size is valid' };
};

// Function to ensure the storage bucket exists
export const ensureStorageBucket = async () => {
  try {
    console.log("Checking and ensuring storage bucket...");
    
    // Check if the bucket exists first to avoid unnecessary operations
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      // Don't throw immediately, try to create the bucket anyway
    }
    
    const portfolioBucket = buckets?.find(bucket => bucket.name === 'portfolio');
    
    if (!portfolioBucket) {
      console.log('Portfolio bucket not found, creating it...');
      // Create the bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket('portfolio', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        return { success: false, message: `Failed to create storage bucket: ${error.message}` };
      }
      
      console.log('Portfolio bucket created successfully');
    } else {
      console.log('Portfolio bucket exists');
    }
    
    return { success: true, message: 'Storage bucket verified' };
  } catch (error: any) {
    console.error('Storage initialization error:', error);
    return { success: false, message: error.message || "Unknown error during storage initialization" };
  }
};

// Function to upload a file to the portfolio bucket with enhanced validation
export const uploadFile = async (file: File, path: string) => {
  try {
    // First validate file size
    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.valid) {
      console.error('File size validation failed:', sizeValidation.message);
      throw new Error(sizeValidation.message);
    }
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Error uploading file: Not authenticated');
      throw new Error('Authentication required to upload files');
    }
    
    // Ensure the bucket exists
    await ensureStorageBucket();
    
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
      throw error;
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
