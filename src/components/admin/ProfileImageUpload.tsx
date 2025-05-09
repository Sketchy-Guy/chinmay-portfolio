
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CropIcon, AlertCircle } from "lucide-react";
import { ImageCropper } from "./ImageCropper";
import { uploadFile, ensureStorageBucket } from "@/utils/storage";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

interface ProfileImageUploadProps {
  currentImageUrl: string;
  onImageUploaded: (imageUrl: string) => void;
  user: User | null;
}

export function ProfileImageUpload({ 
  currentImageUrl, 
  onImageUploaded,
  user
}: ProfileImageUploadProps) {
  const [imagePreview, setImagePreview] = useState(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSrc, setCropperSrc] = useState<string>("");
  
  // Default fallback image if current image fails to load
  const fallbackImage = "/lovable-uploads/78295e37-4b4d-4900-b613-21ed6626ab3f.png";

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setSelectedFile(file);
    setUploadError("");
    
    // Check file size and warn if too large
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.warning("Image is larger than 5MB. You'll need to crop it before uploading.");
    }
    
    // Create object URL for the cropper
    const objectUrl = URL.createObjectURL(file);
    setCropperSrc(objectUrl);
    setCropperOpen(true);
  };

  const handleCropCancel = () => {
    setCropperOpen(false);
    setSelectedFile(null);
    
    // Clean up object URL to prevent memory leaks
    if (cropperSrc) {
      URL.revokeObjectURL(cropperSrc);
      setCropperSrc("");
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setCropperOpen(false);
      setUploading(true);
      setUploadError("");
      
      if (!user) {
        throw new Error("You must be logged in to upload an image");
      }
      
      // Create a new File object from the blob
      const croppedFile = new File(
        [croppedBlob], 
        selectedFile ? selectedFile.name : "profile-image.jpg", 
        { type: "image/jpeg" }
      );
      
      // Clean up object URL
      if (cropperSrc) {
        URL.revokeObjectURL(cropperSrc);
        setCropperSrc("");
      }
      
      // Initialize storage bucket to ensure it exists
      console.log("Initializing storage for profile image upload...");
      const bucketInitResult = await ensureStorageBucket();
      
      if (!bucketInitResult.success) {
        throw new Error(`Storage bucket not available: ${bucketInitResult.message}`);
      }
      
      // Use a simplified path for profile images
      const timestamp = new Date().getTime();
      const safeName = croppedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `profile/${timestamp}_${safeName}`;
      
      console.log("Uploading profile image to path:", filePath);
      
      const result = await uploadFile(croppedFile, filePath);
      
      if (!result.success) {
        throw new Error(result.message || "Failed to upload image");
      }
      
      const imagePath = result.path;
      console.log("Upload successful, image path:", imagePath);
      setImagePreview(imagePath || imagePreview);
      
      // Notify parent component of new image URL
      onImageUploaded(imagePath || '');
      
      toast.success('Profile image uploaded successfully');
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setUploadError(error.message || "There was an error uploading your image");
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Profile Image</label>
      <div className="flex items-center space-x-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img 
            src={imagePreview} 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log("Image failed to load, using fallback:", fallbackImage);
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        </div>
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('profile-image-upload')?.click()}
            disabled={uploading}
            className="flex items-center"
          >
            {uploading ? (
              <span className="animate-spin mr-2">◌</span>
            ) : (
              <CropIcon className="mr-2 h-4 w-4" />
            )}
            {uploading ? 'Uploading...' : 'Select & Crop Image'}
          </Button>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
            disabled={uploading}
          />
          <p className="text-xs text-gray-500 mt-2">
            Recommended: Square image, at least 300x300 pixels
          </p>
          {uploadError && (
            <div className="mt-2 text-sm text-red-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {uploadError}
            </div>
          )}
        </div>
      </div>

      {/* Image Cropper Modal */}
      {cropperOpen && cropperSrc && (
        <ImageCropper
          imageSrc={cropperSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1}
          open={cropperOpen}
        />
      )}
    </div>
  );
}
