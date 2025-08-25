import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import GalleryGrid from "@/components/creator/gallery-grid";
import UploadZone from "@/components/creator/upload-zone";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CreatorGallery() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [showUpload, setShowUpload] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: profile } = useQuery({
    queryKey: ['/api/creator/profile'],
    enabled: !!user,
  });

  const { data: media = [], isLoading: mediaLoading } = useQuery({
    queryKey: ['/api/media/creator', profile?.id],
    enabled: !!profile?.id,
  });

  const uploadMutation = useMutation({
    mutationFn: async (mediaData: { url: string; type: 'image' | 'video'; caption?: string; thumbnailUrl?: string }) => {
      const response = await apiRequest('POST', '/api/media', mediaData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media/creator'] });
      toast({
        title: "Success",
        description: "Media uploaded successfully!",
      });
      setShowUpload(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to upload media. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (mediaId: string) => {
      await apiRequest('DELETE', `/api/media/${mediaId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media/creator'] });
      toast({
        title: "Success",
        description: "Media deleted successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete media. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !user) {
    return null;
  }

  const handleUpload = (files: File[]) => {
    // In a real app, you would upload to S3 and get URLs
    // For now, we'll simulate the upload with placeholder URLs
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      uploadMutation.mutate({
        url,
        type,
        caption: file.name,
        thumbnailUrl: type === 'video' ? url : undefined,
      });
    });
  };

  return (
    <div className="min-h-screen flex bg-cyber-dark">
      <Sidebar userRole="creator" />
      
      <main className={`flex-1 min-h-screen ${isMobile ? 'pb-20' : 'ml-64'}`}>
        <header className="bg-cyber-surface/90 backdrop-blur-md border-b border-neon-purple/20 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-orbitron font-bold text-neon-purple">MEDIA GALLERY</h2>
              <p className="text-cyber-muted text-sm mt-1">Manage your digital portfolio</p>
            </div>
            <Button 
              onClick={() => setShowUpload(!showUpload)}
              className="px-4 py-2 bg-neon-purple hover:bg-neon-purple/80 text-white rounded-lg transition-colors uppercase tracking-wide text-sm"
              data-testid="button-toggle-upload"
            >
              <i className="fas fa-upload mr-2"></i>
              Upload Media
            </Button>
          </div>
        </header>
        
        <div className="p-8">
          {showUpload && (
            <div className="mb-8">
              <UploadZone 
                onUpload={handleUpload}
                isUploading={uploadMutation.isPending}
              />
            </div>
          )}
          
          <GalleryGrid 
            media={media}
            isLoading={mediaLoading}
            onDelete={(id) => deleteMutation.mutate(id)}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      </main>
    </div>
  );
}
