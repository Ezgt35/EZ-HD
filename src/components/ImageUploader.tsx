import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-cyan-400 bg-cyan-400/10 scale-105' 
            : 'border-gray-600 bg-white/5 hover:border-gray-500 hover:bg-white/10'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Upload className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">
              Upload Your Photo
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Drag and drop your image here, or click to browse. 
              Supports JPG, PNG, and WebP formats up to 10MB.
            </p>
          </div>

          <div className="space-y-4">
            <label className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 cursor-pointer transform hover:scale-105">
              <ImageIcon className="w-5 h-5 mr-2" />
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>Max size: 10MB</span>
              <span>•</span>
              <span>JPG, PNG, WebP</span>
            </div>
          </div>
        </div>

        {isDragOver && (
          <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl flex items-center justify-center">
            <div className="text-cyan-400 text-xl font-semibold">
              Drop your image here!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;