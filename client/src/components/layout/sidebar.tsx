import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface SidebarProps {
  userRole: 'creator' | 'admin';
}

export default function Sidebar({ userRole }: SidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: unreadCount } = useQuery({
    queryKey: ['/api/messages/unread/count'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const logout = () => {
    window.location.href = '/api/logout';
  };

  const creatorNavItems = [
    { href: "/dashboard", icon: "fas fa-chart-line", label: "Dashboard" },
    { href: "/profile", icon: "fas fa-user-edit", label: "Profile" },
    { href: "/gallery", icon: "fas fa-images", label: "Gallery" },
    { href: "/messages", icon: "fas fa-envelope", label: "Messages", badge: unreadCount?.count },
  ];

  const adminNavItems = [
    { href: "/dashboard", icon: "fas fa-tachometer-alt", label: "Dashboard" },
    { href: "/creators", icon: "fas fa-users", label: "Creators" },
    { href: "/messages", icon: "fas fa-envelope", label: "Messages", badge: unreadCount?.count },
  ];

  const navItems = userRole === 'creator' ? creatorNavItems : adminNavItems;

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-cyber-surface/95 backdrop-blur-md border-t border-neon-purple/20 z-40">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center space-y-1 p-2 ${
                  location === item.href 
                    ? 'text-neon-purple bg-neon-purple/20' 
                    : 'text-cyber-muted hover:text-neon-cyan'
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <div className="relative">
                  <i className={`${item.icon} text-sm`}></i>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-neon-magenta text-white text-xs px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <aside className={`fixed left-0 top-0 h-full bg-cyber-surface/95 backdrop-blur-md border-r border-neon-purple/20 transform transition-transform duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <i className="fas fa-atom text-neon-cyan text-2xl"></i>
          {!isCollapsed && (
            <h1 className="text-xl font-orbitron font-bold text-neon-purple">NeoModel</h1>
          )}
        </div>
        
        {/* User Profile Card */}
        {!isCollapsed && (
          <div className="bg-cyber-dark/50 p-4 rounded-lg border border-neon-purple/20 mb-6">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user?.profileImageUrl || ''} />
                <AvatarFallback className="bg-gradient-to-r from-neon-purple to-neon-magenta text-white">
                  {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-cyber-text" data-testid="text-username">
                  {user?.firstName || user?.email}
                </h3>
                <p className="text-xs text-cyber-muted uppercase tracking-wide">
                  {userRole}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full flex items-center justify-start space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  location === item.href
                    ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                    : 'text-cyber-muted hover:text-neon-cyan hover:bg-neon-cyan/10'
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <i className={`${item.icon} text-lg`}></i>
                {!isCollapsed && (
                  <>
                    <span className="font-medium uppercase tracking-wide text-sm flex-1 text-left">
                      {item.label}
                    </span>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-neon-magenta text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Button>
            </Link>
          ))}
        </nav>
        
        {/* Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <Button
            onClick={logout}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 p-3 bg-transparent border border-neon-magenta/30 text-neon-magenta hover:bg-neon-magenta/10 transition-all duration-300 rounded-lg"
            data-testid="button-logout"
          >
            <i className="fas fa-sign-out-alt"></i>
            {!isCollapsed && (
              <span className="font-medium uppercase tracking-wide text-sm">Disconnect</span>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
