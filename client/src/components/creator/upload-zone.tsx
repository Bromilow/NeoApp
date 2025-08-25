import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  isUploading: boolean;
}

export default function UploadZone({ onUpload, isUploading }: UploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true
  });

  return (
    <div 
      {...getRootProps()}
      className={`bg-cyber-surface p-8 rounded-lg border-2 border-dashed transition-all duration-300 text-center cursor-pointer neon-border ${
        isDragActive ? 'border-neon-cyan/70 bg-neon-cyan/5' : 'border-neon-purple/30 hover:border-neon-purple/50'
      } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      data-testid="upload-zone"
    >
      <input {...getInputProps()} disabled={isUploading} />
      
      <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-full flex items-center justify-center">
        {isUploading ? (
          <i className="fas fa-spinner fa-spin text-neon-purple text-2xl"></i>
        ) : (
          <i className="fas fa-cloud-upload-alt text-neon-purple text-2xl"></i>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-cyber-text mb-2">
        {isUploading ? 'Uploading...' : 'Drop files here or click to upload'}
      </h3>
      
      <p className="text-cyber-muted text-sm">
        Support for images (JPG, PNG, GIF) and videos (MP4, MOV) up to 100MB
      </p>
      
      {isDragActive && (
        <p className="text-neon-cyan font-medium mt-2">Drop the files here...</p>
      )}
    </div>
  );
}
