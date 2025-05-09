
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

// Function to create necessary folders in the portfolio bucket
export const ensureStorageBucket = async () => {
  try {
    console.log("Checking storage bucket status...");
    
    // First check if buckets can be listed (tests permissions)
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return { success: false, message: `Cannot list buckets: ${bucketsError.message}` };
    }
    
    console.log("Available buckets:", buckets?.map(b => b.name).join(', ') || 'None');
    
    // Check if portfolio bucket exists
    const portfolioBucket = buckets?.find(bucket => bucket.name === 'portfolio');
    
    if (!portfolioBucket) {
      console.log('Portfolio bucket not found, attempting to create it...');
      
      // Create the bucket with public access and file type restrictions
      const { error: createError } = await supabase.storage.createBucket('portfolio', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });
      
      if (createError) {
        console.error('Error creating portfolio bucket:', createError);
        return { success: false, message: `Failed to create storage bucket: ${createError.message}` };
      }
      
      console.log('Portfolio bucket created successfully');
    } else {
      console.log('Portfolio bucket exists');
    }
    
    // Create necessary folders in the portfolio bucket
    try {
      // Try to list files in the profile folder to see if it exists
      const { error: listError } = await supabase.storage
        .from('portfolio')
        .list('profile');
      
      // If we get a 404, the folder doesn't exist yet
      if (listError && listError.message.includes('Not Found')) {
        // Create an empty file to establish the folder
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload('profile/.folder', new Blob(['']));
        
        if (uploadError && !uploadError.message.includes('already exists')) {
          console.error('Error creating profile folder:', uploadError);
        } else {
          console.log('Profile folder created successfully');
        }
      }
    } catch (folderError) {
      console.warn('Error checking/creating folders:', folderError);
      // Non-critical error, continue
    }
    
    // Test bucket permissions by listing objects
    const { error: listError } = await supabase.storage
      .from('portfolio')
      .list();
    
    if (listError) {
      console.error('Cannot access portfolio bucket:', listError);
      return { 
        success: false, 
        message: `Bucket exists but cannot be accessed: ${listError.message}.` 
      };
    }
    
    console.log('Portfolio bucket verified and accessible');
    return { success: true, message: 'Storage bucket verified and accessible' };
  } catch (error: any) {
    console.error('Unexpected storage initialization error:', error);
    return { 
      success: false, 
      message: error.message || "Unknown error during storage initialization" 
    };
  }
};

// Function to upload a file to the portfolio bucket
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
    
    // Ensure the bucket exists and is accessible
    const bucketResult = await ensureStorageBucket();
    if (!bucketResult.success) {
      console.error('Storage bucket not available:', bucketResult.message);
      throw new Error(`Storage bucket not available: ${bucketResult.message}`);
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
    toast.error('Upload failed: ' + (error.message || 'Unknown error'));
    return { success: false, message: error.message || 'Unknown error', path: null };
  }
};
