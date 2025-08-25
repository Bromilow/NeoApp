import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import StatsCard from "@/components/creator/stats-card";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const isMobile = useIsMobile();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "Admin access required. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: creators = [] } = useQuery({
    queryKey: ['/api/admin/creators'],
    enabled: !!user && user.role === 'admin',
  });

  const { data: unreadCount } = useQuery({
    queryKey: ['/api/messages/unread/count'],
    enabled: !!user,
  });

  if (isLoading || !user || user.role !== 'admin') {
    return null;
  }

  const activeToday = creators.filter(creator => {
    const lastActive = new Date(creator.updatedAt);
    const today = new Date();
    return lastActive.toDateString() === today.toDateString();
  }).length;

  const pendingReview = creators.filter(creator => !creator.isActive).length;

  return (
    <div className="min-h-screen flex bg-cyber-dark">
      <Sidebar userRole="admin" />
      
      <main className={`flex-1 min-h-screen ${isMobile ? 'pb-20' : 'ml-64'}`}>
        <header className="bg-cyber-surface/90 backdrop-blur-md border-b border-neon-purple/20 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-orbitron font-bold text-neon-purple">ADMIN CONTROL CENTER</h2>
              <p className="text-cyber-muted text-sm mt-1">Manage creators and platform operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-cyber-muted hover:text-neon-cyan transition-colors" data-testid="button-admin-notifications">
                <i className="fas fa-bell text-lg"></i>
              </button>
            </div>
          </div>
        </header>
        
        <div className="p-8">
          {/* Admin Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Creators"
              value={creators.length}
              icon="fas fa-users"
              color="cyan"
              trend="+12"
              trendLabel="this month"
            />
            <StatsCard
              title="Active Today"
              value={activeToday}
              icon="fas fa-chart-line"
              color="magenta"
              trend="+18%"
              trendLabel="vs yesterday"
            />
            <StatsCard
              title="New Messages"
              value={unreadCount?.count || 0}
              icon="fas fa-envelope"
              color="purple"
              trend={unreadCount?.count && unreadCount.count > 5 ? `${Math.floor(unreadCount.count * 0.3)} urgent` : "No urgent"}
              trendLabel="responses needed"
            />
            <StatsCard
              title="Pending Review"
              value={pendingReview}
              icon="fas fa-clock"
              color="yellow"
              trend="Awaiting approval"
              trendLabel=""
            />
          </div>
          
          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Platform Overview */}
            <div className="bg-cyber-surface p-6 rounded-lg border border-neon-purple/20">
              <h3 className="text-xl font-orbitron font-bold text-neon-purple mb-6">Platform Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-cyber-dark/30 rounded border border-neon-purple/10">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-user-plus text-neon-cyan"></i>
                    </div>
                    <div>
                      <p className="text-cyber-text text-sm font-medium">New creator registrations</p>
                      <p className="text-cyber-muted text-xs">This week</p>
                    </div>
                  </div>
                  <span className="text-neon-cyan font-bold">12</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-cyber-dark/30 rounded border border-neon-purple/10">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neon-magenta/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-upload text-neon-magenta"></i>
                    </div>
                    <div>
                      <p className="text-cyber-text text-sm font-medium">New media uploads</p>
                      <p className="text-cyber-muted text-xs">Today</p>
                    </div>
                  </div>
                  <span className="text-neon-magenta font-bold">47</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-cyber-dark/30 rounded border border-neon-purple/10">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neon-purple/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-eye text-neon-purple"></i>
                    </div>
                    <div>
                      <p className="text-cyber-text text-sm font-medium">Total profile views</p>
                      <p className="text-cyber-muted text-xs">This month</p>
                    </div>
                  </div>
                  <span className="text-neon-purple font-bold">8.2k</span>
                </div>
              </div>
            </div>
            
            {/* Quick Admin Actions */}
            <div className="bg-cyber-surface p-6 rounded-lg border border-neon-purple/20">
              <h3 className="text-xl font-orbitron font-bold text-neon-purple mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => window.location.href = '/creators'}
                  className="w-full flex items-center justify-between p-4 bg-cyber-dark/30 hover:bg-neon-purple/10 border border-neon-purple/20 hover:border-neon-purple/50 rounded transition-all duration-300"
                  data-testid="button-manage-creators"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neon-purple/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-users text-neon-purple"></i>
                    </div>
                    <span className="text-cyber-text font-medium">Manage Creators</span>
                  </div>
                  <i className="fas fa-chevron-right text-cyber-muted"></i>
                </button>
                
                <button 
                  onClick={() => window.location.href = '/messages'}
                  className="w-full flex items-center justify-between p-4 bg-cyber-dark/30 hover:bg-neon-cyan/10 border border-neon-purple/20 hover:border-neon-cyan/50 rounded transition-all duration-300"
                  data-testid="button-review-messages"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-envelope text-neon-cyan"></i>
                    </div>
                    <span className="text-cyber-text font-medium">Review Messages</span>
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
                
                <button 
                  className="w-full flex items-center justify-between p-4 bg-cyber-dark/30 hover:bg-neon-magenta/10 border border-neon-purple/20 hover:border-neon-magenta/50 rounded transition-all duration-300"
                  data-testid="button-platform-settings"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neon-magenta/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-cogs text-neon-magenta"></i>
                    </div>
                    <span className="text-cyber-text font-medium">Platform Settings</span>
                  </div>
                  <i className="fas fa-chevron-right text-cyber-muted"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
