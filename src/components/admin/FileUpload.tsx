
import { useState, useRef } from 'react';
import { Upload, X, Crop, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  label: string;
  currentUrl?: string;
  cropAspectRatio?: number;
}

const FileUpload = ({ 
  onUpload, 
  accept = "image/*", 
  maxSize = 5, 
  label, 
  currentUrl,
  cropAspectRatio 
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Generate unique filename
      const timestamp = new Date().getTime();
      const safeName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${safeName}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      onUpload(publicUrl);
      toast.success('File uploaded successfully!');
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(currentUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Preview or upload area */}
          <div className="relative">
            {previewUrl ? (
              <div className="relative group">
                <div className="w-full h-40 bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-600">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openFilePicker}
                    className="text-white border-white/20"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                    className="text-white border-white/20"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={openFilePicker}
                className="w-full h-40 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-purple-400"
              >
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium">Click to upload {label.toLowerCase()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Max {maxSize}MB • {accept.split(',').map(type => type.split('/')[1]).join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {!previewUrl && (
              <Button
                onClick={openFilePicker}
                variant="outline"
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            )}
            
            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            )}
          </div>

          {/* File info */}
          {selectedFile && (
            <div className="text-xs text-gray-400 space-y-1">
              <div>File: {selectedFile.name}</div>
              <div>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              <div>Type: {selectedFile.type}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
