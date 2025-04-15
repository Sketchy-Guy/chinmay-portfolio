
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to check if the portfolio storage bucket exists
export const checkStorageBucket = async () => {
  try {
    console.log("Checking storage bucket status...");
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return { success: false, message: 'Session error' };
    }
    
    // Check if the portfolio bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return { success: false, message: bucketsError.message };
    }
    
    const portfolioBucket = buckets.find(bucket => bucket.name === 'portfolio');
    
    if (!portfolioBucket) {
      console.log('Portfolio bucket not found, will create it');
      return { success: false, message: 'Portfolio bucket not found' };
    } else {
      console.log('Portfolio bucket verified');
      return { success: true, message: 'Portfolio bucket exists' };
    }
  } catch (error: any) {
    console.error('Error checking storage bucket:', error);
    return { success: false, message: error.message };
  }
};

// Function to create the portfolio storage bucket
export const createStorageBucket = async () => {
  try {
    console.log("Creating portfolio bucket...");
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error when creating bucket:', sessionError);
      return { success: false, message: 'Session error: ' + sessionError.message };
    }
    
    if (!session) {
      console.log("No authenticated session, cannot create bucket");
      return { success: false, message: 'Authentication required to create bucket' };
    }
    
    const { error } = await supabase.storage.createBucket('portfolio', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log('Bucket already exists, continuing...');
        return { success: true, message: 'Bucket already exists' };
      }
      console.error('Error creating bucket:', error);
      return { success: false, message: error.message };
    }
    
    console.log('Portfolio bucket created successfully');
    return { success: true, message: 'Bucket created successfully' };
  } catch (error: any) {
    console.error('Error creating bucket:', error);
    return { success: false, message: error.message };
  }
};

// Function to initialize the portfolio storage bucket
export const initializeStorage = async () => {
  try {
    console.log("Initializing storage...");
    
    // Get the current session first to check authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("No authenticated session, skipping storage initialization");
      return { success: false, message: 'Authentication required for storage initialization' };
    }
    
    // Check if bucket exists first
    const bucketCheck = await checkStorageBucket();
    
    if (!bucketCheck.success) {
      console.log('Storage bucket check failed, creating bucket...');
      const createResult = await createStorageBucket();
      
      if (!createResult.success) {
        console.error('Failed to create storage bucket:', createResult.message);
        return { success: false, message: createResult.message };
      }
    }
    
    console.log('Storage initialized successfully');
    return { success: true, message: 'Storage initialized' };
  } catch (error: any) {
    console.error('Error initializing storage:', error);
    return { success: false, message: error.message };
  }
};

// Function to upload a file to the portfolio bucket
export const uploadFile = async (file: File, path: string) => {
  try {
    // First check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Error uploading file: Not authenticated');
      throw new Error('Authentication required to upload files');
    }
    
    // Then ensure the bucket exists
    const bucketStatus = await initializeStorage();
    if (!bucketStatus.success) {
      console.error(`Storage initialization error: ${bucketStatus.message}`);
      throw new Error(`Storage bucket not available: ${bucketStatus.message}`);
    }
    
    console.log(`Uploading file to ${path}...`);
    
    // Ensure path includes user ID from session to comply with RLS
    const userId = session.user.id;
    if (!path.startsWith(`${userId}/`) && !path.includes(`/${userId}/`)) {
      // Prepend user ID to path if not already included
      path = `${userId}/${path}`;
      console.log(`Adjusted path to include user ID: ${path}`);
    }
    
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
