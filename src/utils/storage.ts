
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
    
    // Explicitly check and create the profile_photo folder
    try {
      console.log("Checking profile_photo folder existence...");
      // Try to list files in the profile_photo folder to see if it exists
      const { data: folderContents, error: listError } = await supabase.storage
        .from('portfolio')
        .list('profile_photo');
      
      if (listError) {
        console.log('Error checking profile_photo folder, attempting to create it:', listError);
        
        // Create an empty file to establish the folder
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload('profile_photo/.folder', new Blob(['']));
        
        if (uploadError && !uploadError.message.includes('already exists')) {
          console.error('Error creating profile_photo folder:', uploadError);
          toast.error('Failed to create profile_photo folder for image uploads');
        } else {
          console.log('profile_photo folder created successfully');
        }
      } else {
        console.log('profile_photo folder exists with contents:', folderContents?.length || 0, 'files');
      }
    } catch (folderError) {
      console.warn('Error checking/creating folders:', folderError);
      // Non-critical error, continue
    }
    
    // Verify that the bucket is publicly accessible
    const { data: publicUrl, error: urlError } = supabase.storage
      .from('portfolio')
      .getPublicUrl('profile_photo/.folder');
    
    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return { success: false, message: 'Error validating public access to storage bucket' };
    }
    
    console.log('Public URL test:', publicUrl);
    
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
    
    console.log(`Uploading file to ${path}...`, file.type, file.size);
    
    // Generate a unique key for this upload for debugging
    const uploadKey = Math.random().toString(36).substring(2, 8);
    console.log(`Upload tracking ID: ${uploadKey}`);
    
    // Upload the file with public access
    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error(`Upload ${uploadKey} failed:`, error);
      throw error;
    }
    
    console.log(`Upload ${uploadKey} succeeded:`, data);
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(path);
    
    console.log(`Upload ${uploadKey} public URL:`, publicUrl);
    
    // Verify the file was uploaded
    const { data: fileCheck, error: checkError } = await supabase.storage
      .from('portfolio')
      .list(path.split('/')[0], {
        search: path.split('/')[1]
      });
    
    if (checkError) {
      console.warn(`Upload ${uploadKey} verification check error:`, checkError);
    } else {
      console.log(`Upload ${uploadKey} verification:`, 
        fileCheck && fileCheck.length > 0 ? 'File found in storage' : 'File not found in verification');
    }
    
    return { success: true, message: 'File uploaded successfully', path: publicUrl };
  } catch (error: any) {
    console.error('Error in uploadFile:', error);
    toast.error('Upload failed: ' + (error.message || 'Unknown error'));
    return { success: false, message: error.message || 'Unknown error', path: null };
  }
};

// Function to specifically upload a profile photo
export const uploadProfilePhoto = async (file: File, userId: string) => {
  try {
    // First ensure the bucket and folder exist
    await ensureStorageBucket();
    
    // Create a timestamped file path to avoid cache issues
    const timestamp = new Date().getTime();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `profile_photo/${userId}_${timestamp}_${safeName}`;
    
    // Upload the file
    const result = await uploadFile(file, filePath);
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    console.log('Profile photo uploaded successfully:', result.path);
    
    return result;
  } catch (error: any) {
    console.error('Profile photo upload failed:', error);
    return { success: false, message: error.message, path: null };
  }
};
