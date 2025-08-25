import { useState } from "react";
import PublicNavbar from "@/components/layout/public-navbar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleSignup = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      <PublicNavbar onLogin={() => setShowLogin(true)} onSignup={() => setShowSignup(true)} />
      
      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-cyber-surface/20 to-cyber-dark"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsla(271,76%,53%,0.1),transparent_70%)]"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 gradient-text animate-glow">
            NEXT-GEN
            <br />
            CREATOR PLATFORM
          </h1>
          <p className="text-xl md:text-2xl text-cyber-muted mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect elite creators with forward-thinking brands in the cyberpunk future of digital modeling
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => setShowSignup(true)}
              className="px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-magenta hover:from-neon-purple/80 hover:to-neon-magenta/80 text-white font-bold rounded-lg transition-all duration-300 shadow-neon-purple transform hover:scale-105 uppercase tracking-wide"
              data-testid="button-join-creator"
            >
              <i className="fas fa-user-circle mr-2"></i>
              Join as Creator
            </Button>
            <Button 
              onClick={() => setShowLogin(true)}
              variant="outline"
              className="px-8 py-4 bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 font-bold rounded-lg transition-all duration-300 shadow-neon-cyan transform hover:scale-105 uppercase tracking-wide"
              data-testid="button-admin-portal"
            >
              <i className="fas fa-briefcase mr-2"></i>
              Admin Portal
            </Button>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-neon-magenta rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-neon-purple rounded-full animate-pulse"></div>
      </section>

      {/* Login Modal */}
      <Modal open={showLogin} onOpenChange={setShowLogin}>
        <div className="bg-cyber-surface p-8 rounded-lg border border-neon-purple/30 max-w-md w-full neon-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-orbitron font-bold text-neon-purple">ACCESS PORTAL</h2>
          </div>
          <div className="space-y-6">
            <p className="text-cyber-muted text-center">
              Use your existing account to access the NeoModel platform
            </p>
            <Button 
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-magenta hover:from-neon-purple/80 hover:to-neon-magenta/80 text-white font-bold rounded transition-all duration-300 shadow-neon-purple uppercase tracking-wide"
              data-testid="button-login"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Initialize Login
            </Button>
          </div>
          <div className="text-center mt-6">
            <span className="text-cyber-muted text-sm">New to the platform? </span>
            <button 
              onClick={() => {setShowLogin(false); setShowSignup(true);}} 
              className="text-neon-cyan hover:text-neon-cyan/80 text-sm font-bold"
              data-testid="link-create-account"
            >
              Create Account
            </button>
          </div>
        </div>
      </Modal>

      {/* Signup Modal */}
      <Modal open={showSignup} onOpenChange={setShowSignup}>
        <div className="bg-cyber-surface p-8 rounded-lg border border-neon-purple/30 max-w-md w-full neon-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-orbitron font-bold text-neon-purple">JOIN MATRIX</h2>
          </div>
          <div className="space-y-6">
            <p className="text-cyber-muted text-center">
              Create your account to join the NeoModel creator network
            </p>
            <Button 
              onClick={handleSignup}
              className="w-full py-3 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80 text-white font-bold rounded transition-all duration-300 shadow-neon-cyan uppercase tracking-wide"
              data-testid="button-signup"
            >
              <i className="fas fa-rocket mr-2"></i>
              Connect to Matrix
            </Button>
          </div>
          <div className="text-center mt-6">
            <span className="text-cyber-muted text-sm">Already connected? </span>
            <button 
              onClick={() => {setShowSignup(false); setShowLogin(true);}} 
              className="text-neon-cyan hover:text-neon-cyan/80 text-sm font-bold"
              data-testid="link-access-portal"
            >
              Access Portal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
