import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnailUrl?: string;
  caption?: string;
  views: number;
  uploadedAt: string;
}

interface GalleryGridProps {
  media: Media[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function GalleryGrid({ media, isLoading, onDelete, isDeleting }: GalleryGridProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-cyber-surface rounded-lg overflow-hidden border border-neon-purple/20 animate-pulse">
            <div className="aspect-square bg-cyber-dark/50"></div>
            <div className="p-4">
              <div className="h-4 bg-cyber-dark/50 rounded mb-2"></div>
              <div className="h-3 bg-cyber-dark/50 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-neon-purple/20 rounded-full flex items-center justify-center">
          <i className="fas fa-images text-neon-purple text-3xl"></i>
        </div>
        <h3 className="text-xl font-orbitron font-bold text-cyber-text mb-2">No Media Yet</h3>
        <p className="text-cyber-muted mb-6">Upload your first photo or video to get started</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {media.map((item) => (
          <div key={item.id} className="bg-cyber-surface rounded-lg overflow-hidden border border-neon-purple/20 neon-border" data-testid={`media-item-${item.id}`}>
            <div className="aspect-square relative group cursor-pointer" onClick={() => setSelectedMedia(item)}>
              {item.type === 'video' ? (
                <>
                  <video 
                    src={item.url} 
                    className="w-full h-full object-cover"
                    muted
                    poster={item.thumbnailUrl}
                  />
                  <div className="absolute top-2 left-2 bg-neon-magenta/80 text-white px-2 py-1 rounded text-xs uppercase font-bold">
                    <i className="fas fa-play mr-1"></i>Video
                  </div>
                </>
              ) : (
                <img 
                  src={item.url} 
                  alt={item.caption || 'Gallery image'} 
                  className="w-full h-full object-cover"
                />
              )}
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="p-2 bg-neon-purple/80 text-white rounded-full hover:bg-neon-purple transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMedia(item);
                    }}
                    data-testid={`button-view-${item.id}`}
                  >
                    <i className="fas fa-eye"></i>
                  </Button>
                  <Button
                    size="sm"
                    className="p-2 bg-neon-magenta/80 text-white rounded-full hover:bg-neon-magenta transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    disabled={isDeleting}
                    data-testid={`button-delete-${item.id}`}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-cyber-text text-sm font-medium truncate" data-testid={`caption-${item.id}`}>
                  {item.caption || 'Untitled'}
                </span>
                <span className="text-cyber-muted text-xs" data-testid={`date-${item.id}`}>
                  {formatDate(item.uploadedAt)}
                </span>
              </div>
              <div className="flex items-center mt-2">
                <i className="fas fa-eye text-neon-cyan text-xs mr-1"></i>
                <span className="text-cyber-muted text-xs" data-testid={`views-${item.id}`}>
                  {item.views} views
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Preview Modal */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl bg-cyber-surface border border-neon-purple/30">
          {selectedMedia && (
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-orbitron font-bold text-neon-purple">
                  {selectedMedia.caption || 'Untitled'}
                </h3>
                <p className="text-cyber-muted text-sm">
                  {selectedMedia.views} views • {formatDate(selectedMedia.uploadedAt)}
                </p>
              </div>
              
              <div className="flex justify-center">
                {selectedMedia.type === 'video' ? (
                  <video 
                    src={selectedMedia.url} 
                    controls 
                    className="max-w-full max-h-96 rounded-lg"
                    data-testid="video-preview"
                  />
                ) : (
                  <img 
                    src={selectedMedia.url} 
                    alt={selectedMedia.caption || 'Preview'} 
                    className="max-w-full max-h-96 rounded-lg object-contain"
                    data-testid="image-preview"
                  />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
