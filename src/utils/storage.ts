
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

// Function to verify the storage bucket exists and is properly configured
export const ensureStorageBucket = async () => {
  try {
    console.log("Checking storage bucket status...");
    
    // First try to use an existing bucket - this operation should succeed if the bucket exists
    // and the policies are properly configured
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return { success: false, message: `Cannot list buckets: ${bucketsError.message}` };
    }
    
    console.log("Available buckets:", buckets?.map(b => b.name).join(', ') || 'None');
    
    const portfolioBucket = buckets?.find(bucket => bucket.name === 'portfolio');
    
    if (!portfolioBucket) {
      console.log('Portfolio bucket not found, attempting to create it...');
      
      // Try to create the bucket with appropriate settings
      const { error: createError } = await supabase.storage.createBucket('portfolio', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });
      
      if (createError) {
        console.error('Error creating portfolio bucket:', createError);
        // We'll provide more detailed guidance based on the error
        if (createError.message.includes('row-level security')) {
          return { 
            success: false, 
            message: `Storage bucket access denied: ${createError.message}. Please check RLS policies.` 
          };
        }
        return { success: false, message: `Failed to create storage bucket: ${createError.message}` };
      }
      
      console.log('Portfolio bucket created successfully');
      // Verify the bucket was actually created
      const { data: verifyBuckets, error: verifyError } = await supabase.storage.listBuckets();
      
      if (verifyError || !verifyBuckets?.some(b => b.name === 'portfolio')) {
        console.error('Failed to verify newly created bucket:', verifyError || 'Bucket not found');
        return { 
          success: false, 
          message: 'Created bucket but failed to verify it exists. Check Supabase storage settings.'
        };
      }
    } else {
      console.log('Portfolio bucket exists');
    }
    
    // Test the bucket permissions by attempting to list objects
    const { error: listError } = await supabase.storage
      .from('portfolio')
      .list();
    
    if (listError) {
      console.error('Cannot access portfolio bucket:', listError);
      return { 
        success: false, 
        message: `Bucket exists but cannot be accessed: ${listError.message}. Check RLS policies.` 
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

// Function to upload a file to the portfolio bucket with enhanced validation and error handling
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
    toast.error('Upload failed: ' + error.message);
    return { success: false, message: error.message, path: null };
  }
};
