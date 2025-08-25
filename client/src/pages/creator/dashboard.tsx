import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import StatsCard from "@/components/creator/stats-card";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CreatorDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const isMobile = useIsMobile();

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

  const { data: unreadCount } = useQuery({
    queryKey: ['/api/messages/unread/count'],
    enabled: !!user,
  });

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-cyber-dark">
      <Sidebar userRole="creator" />
      
      {/* Main Content Area */}
      <main className={`flex-1 min-h-screen ${isMobile ? 'pb-20' : 'ml-64'}`}>
        {/* Top Bar */}
        <header className="bg-cyber-surface/90 backdrop-blur-md border-b border-neon-purple/20 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-orbitron font-bold text-neon-purple">CREATOR DASHBOARD</h2>
              <p className="text-cyber-muted text-sm mt-1">Monitor your digital presence and engagement</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-cyber-muted hover:text-neon-cyan transition-colors" data-testid="button-notifications">
                <i className="fas fa-bell text-lg"></i>
              </button>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Profile Views"
              value={profile?.profileViews || 0}
              icon="fas fa-eye"
              color="cyan"
              trend="+12.5%"
              trendLabel="from last week"
            />
            <StatsCard
              title="Gallery Items"
              value={24}
              icon="fas fa-images"
              color="magenta"
              trend="+3"
              trendLabel="this month"
            />
            <StatsCard
              title="Messages"
              value={8}
              icon="fas fa-envelope"
              color="purple"
              trend={unreadCount?.count ? `${unreadCount.count} unread` : "0 unread"}
              trendLabel="messages"
            />
            <StatsCard
              title="Rating"
              value="4.8"
              icon="fas fa-star"
              color="yellow"
              trend="Based on 23 reviews"
              trendLabel=""
            />
          </div>
          
          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Activity */}
            <div className="bg-cyber-surface p-6 rounded-lg border border-neon-purple/20">
              <h3 className="text-xl font-orbitron font-bold text-neon-purple mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {/* No activity message */}
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-clock text-neon-purple text-2xl"></i>
                  </div>
                  <p className="text-cyber-muted">No recent activity to display</p>
                  <p className="text-cyber-muted text-sm">Start building your profile to see activity here</p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-cyber-surface p-6 rounded-lg border border-neon-purple/20">
              <h3 className="text-xl font-orbitron font-bold text-neon-purple mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => window.location.href = '/gallery'}
                  className="w-full flex items-center justify-between p-4 bg-cyber-dark/30 hover:bg-neon-purple/10 border border-neon-purple/20 hover:border-neon-purple/50 rounded transition-all duration-300"
                  data-testid="button-upload-media"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neon-purple/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-upload text-neon-purple"></i>
                    </div>
                    <span className="text-cyber-text font-medium">Upload Media</span>
                  </div>
                  <i className="fas fa-chevron-right text-cyber-muted"></i>
                </button>
                
                <button 
                  onClick={() => window.location.href = '/profile'}
                  className="w-full flex items-center justify-between p-4 bg-cyber-dark/30 hover:bg-neon-cyan/10 border border-neon-purple/20 hover:border-neon-cyan/50 rounded transition-all duration-300"
                  data-testid="button-edit-profile"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-edit text-neon-cyan"></i>
                    </div>
                    <span className="text-cyber-text font-medium">Edit Profile</span>
                  </div>
                  <i className="fas fa-chevron-right text-cyber-muted"></i>
                </button>
                
                <button 
                  onClick={() => window.location.href = '/messages'}
                  className="w-full flex items-center justify-between p-4 bg-cyber-dark/30 hover:bg-neon-magenta/10 border border-neon-purple/20 hover:border-neon-magenta/50 rounded transition-all duration-300"
                  data-testid="button-check-messages"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neon-magenta/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-envelope text-neon-magenta"></i>
                    </div>
                    <span className="text-cyber-text font-medium">Check Messages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {unreadCount?.count && unreadCount.count > 0 && (
                      <span className="bg-neon-magenta text-white text-xs px-2 py-1 rounded-full">
                        {unreadCount.count}
                      </span>
                    )}
                    <i className="fas fa-chevron-right text-cyber-muted"></i>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
