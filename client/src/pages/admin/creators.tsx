import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import CreatorTable from "@/components/admin/creator-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminCreators() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [hairColorFilter, setHairColorFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

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

  const { data: creators = [], isLoading: creatorsLoading, error } = useQuery({
    queryKey: ['/api/admin/creators', { search: searchQuery, hairColor: hairColorFilter, location: locationFilter }],
    enabled: !!user && user.role === 'admin',
    retry: false,
  });

  // Handle unauthorized errors from API
  useEffect(() => {
    if (error && isUnauthorizedError(error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  if (isLoading || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-cyber-dark">
      <Sidebar userRole="admin" />
      
      <main className={`flex-1 min-h-screen ${isMobile ? 'pb-20' : 'ml-64'}`}>
        <header className="bg-cyber-surface/90 backdrop-blur-md border-b border-neon-purple/20 px-8 py-4">
          <div>
            <h2 className="text-2xl font-orbitron font-bold text-neon-purple">CREATOR MANAGEMENT</h2>
            <p className="text-cyber-muted text-sm mt-1">Search, filter, and manage creator profiles</p>
          </div>
        </header>
        
        <div className="p-8">
          {/* Search and Filter Controls */}
          <div className="bg-cyber-surface p-6 rounded-lg border border-neon-purple/20 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-orbitron font-bold text-neon-purple">Search & Filter</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Input
                  type="text"
                  placeholder="Search creators by name, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan"
                  data-testid="input-search-creators"
                />
                <i className="fas fa-search absolute left-3 top-3 text-cyber-muted"></i>
              </div>
              
              <Select value={hairColorFilter} onValueChange={setHairColorFilter}>
                <SelectTrigger className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan" data-testid="select-hair-filter">
                  <SelectValue placeholder="All Hair Colors" />
                </SelectTrigger>
                <SelectContent className="bg-cyber-surface border-neon-purple/30">
                  <SelectItem value="">All Hair Colors</SelectItem>
                  <SelectItem value="blonde">Blonde</SelectItem>
                  <SelectItem value="brunette">Brunette</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setHairColorFilter("");
                    setLocationFilter("");
                  }}
                  variant="outline"
                  className="flex-1 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
                  data-testid="button-clear-filters"
                >
                  <i className="fas fa-times mr-2"></i>
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <CreatorTable 
            creators={creators} 
            isLoading={creatorsLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}
