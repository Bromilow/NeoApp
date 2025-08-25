import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';

interface Creator {
  id: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };
  displayName?: string;
  location?: string;
  profileViews: number;
  isActive: boolean;
  updatedAt: string;
}

interface CreatorTableProps {
  creators: Creator[];
  isLoading: boolean;
  error?: Error | null;
}

export default function CreatorTable({ creators, isLoading, error }: CreatorTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const viewProfileMutation = useMutation({
    mutationFn: async (creatorId: string) => {
      await apiRequest('POST', `/api/admin/creators/${creatorId}/view`);
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
      }
    },
  });

  if (error && !isUnauthorizedError(error)) {
    return (
      <div className="bg-cyber-surface p-8 rounded-lg border border-neon-purple/20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
        </div>
        <h3 className="text-xl font-orbitron font-bold text-cyber-text mb-2">Error Loading Creators</h3>
        <p className="text-cyber-muted">Failed to load creator data. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-cyber-surface rounded-lg border border-neon-purple/20 overflow-hidden">
        <div className="p-6 border-b border-neon-purple/20">
          <div className="h-6 bg-cyber-dark/50 rounded animate-pulse"></div>
        </div>
        <div className="divide-y divide-neon-purple/10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-cyber-dark/50 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-cyber-dark/50 rounded w-1/4"></div>
                  <div className="h-3 bg-cyber-dark/50 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(creators.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCreators = creators.slice(startIndex, startIndex + itemsPerPage);

  if (creators.length === 0) {
    return (
      <div className="bg-cyber-surface p-8 rounded-lg border border-neon-purple/20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-full flex items-center justify-center">
          <i className="fas fa-users text-neon-purple text-2xl"></i>
        </div>
        <h3 className="text-xl font-orbitron font-bold text-cyber-text mb-2">No Creators Found</h3>
        <p className="text-cyber-muted">No creators match your search criteria. Try adjusting your filters.</p>
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
    <div className="bg-cyber-surface rounded-lg border border-neon-purple/20 overflow-hidden">
      <div className="p-6 border-b border-neon-purple/20">
        <h3 className="text-xl font-orbitron font-bold text-neon-purple">
          Creator Database ({creators.length} total)
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cyber-dark/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-cyber-muted uppercase tracking-wider">Creator</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-cyber-muted uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-cyber-muted uppercase tracking-wider">Profile Views</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-cyber-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-cyber-muted uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-cyber-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neon-purple/10">
            {paginatedCreators.map((creator) => (
              <tr key={creator.id} className="hover:bg-cyber-dark/20 transition-colors duration-200" data-testid={`creator-row-${creator.id}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 border-2 border-neon-purple/30">
                      <AvatarImage src={creator.user.profileImageUrl} />
                      <AvatarFallback className="bg-gradient-to-r from-neon-purple to-neon-magenta text-white">
                        {creator.displayName?.[0] || creator.user.firstName?.[0] || creator.user.email[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-cyber-text font-medium" data-testid={`creator-name-${creator.id}`}>
                        {creator.displayName || `${creator.user.firstName || ''} ${creator.user.lastName || ''}`.trim() || creator.user.email}
                      </div>
                      <div className="text-cyber-muted text-sm" data-testid={`creator-email-${creator.id}`}>
                        {creator.user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-cyber-text" data-testid={`creator-location-${creator.id}`}>
                  {creator.location || 'Not specified'}
                </td>
                <td className="px-6 py-4 text-cyber-text" data-testid={`creator-views-${creator.id}`}>
                  {creator.profileViews.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    variant={creator.isActive ? 'default' : 'secondary'}
                    className={creator.isActive 
                      ? 'bg-green-400/20 text-green-400 hover:bg-green-400/30' 
                      : 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30'
                    }
                    data-testid={`creator-status-${creator.id}`}
                  >
                    {creator.isActive ? 'Active' : 'Pending'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-cyber-muted text-sm" data-testid={`creator-last-active-${creator.id}`}>
                  {formatDate(creator.updatedAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-2 text-neon-cyan hover:bg-neon-cyan/10 rounded transition-colors"
                      onClick={() => viewProfileMutation.mutate(creator.id)}
                      title="View Profile"
                      data-testid={`button-view-profile-${creator.id}`}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-2 text-neon-purple hover:bg-neon-purple/10 rounded transition-colors"
                      onClick={() => window.location.href = `/messages?user=${creator.user.id}`}
                      title="Send Message"
                      data-testid={`button-message-${creator.id}`}
                    >
                      <i className="fas fa-envelope"></i>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-2 text-neon-magenta hover:bg-neon-magenta/10 rounded transition-colors"
                      title="More Actions"
                      data-testid={`button-more-actions-${creator.id}`}
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-cyber-dark/30 border-t border-neon-purple/20">
          <div className="flex items-center justify-between">
            <div className="text-cyber-muted text-sm">
              Showing <span className="text-cyber-text">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, creators.length)}</span> of{' '}
              <span className="text-cyber-text">{creators.length}</span> creators
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="border-neon-purple/30 text-cyber-muted hover:border-neon-purple/50"
                data-testid="button-prev-page"
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + Math.max(1, currentPage - 2);
                if (page > totalPages) return null;
                
                return (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page 
                      ? "bg-neon-purple text-white"
                      : "border-neon-purple/30 text-cyber-muted hover:border-neon-purple/50"
                    }
                    data-testid={`button-page-${page}`}
                  >
                    {page}
                  </Button>
                );
              })}
              
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="border-neon-purple/30 text-cyber-muted hover:border-neon-purple/50"
                data-testid="button-next-page"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
