import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import CreatorDashboard from "@/pages/creator/dashboard";
import CreatorProfile from "@/pages/creator/profile";
import CreatorGallery from "@/pages/creator/gallery";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCreators from "@/pages/admin/creators";
import Messages from "@/pages/messages";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Blog from "@/pages/blog";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-full flex items-center justify-center animate-pulse">
            <i className="fas fa-atom text-neon-purple text-2xl"></i>
          </div>
          <p className="text-cyber-muted font-orbitron">Initializing Matrix Connection...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      
      {/* Protected routes based on authentication */}
      {isAuthenticated && user ? (
        <>
          {/* Creator routes */}
          {user.role === 'creator' && (
            <>
              <Route path="/" component={CreatorDashboard} />
              <Route path="/dashboard" component={CreatorDashboard} />
              <Route path="/profile" component={CreatorProfile} />
              <Route path="/gallery" component={CreatorGallery} />
              <Route path="/messages" component={Messages} />
            </>
          )}
          
          {/* Admin routes */}
          {user.role === 'admin' && (
            <>
              <Route path="/" component={AdminDashboard} />
              <Route path="/dashboard" component={AdminDashboard} />
              <Route path="/creators" component={AdminCreators} />
              <Route path="/messages" component={Messages} />
            </>
          )}
        </>
      ) : (
        <>
          {/* Landing page for unauthenticated users */}
          <Route path="/" component={Landing} />
        </>
      )}
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-cyber-dark text-cyber-text">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
