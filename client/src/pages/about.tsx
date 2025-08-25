import PublicNavbar from "@/components/layout/public-navbar";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function About() {
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
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-cyber-surface/20 to-cyber-dark"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 gradient-text">
              ABOUT NEOMODEL
            </h1>
            <p className="text-xl text-cyber-muted mb-8 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing the modeling industry through cutting-edge technology, connecting elite creators with forward-thinking brands in the digital age.
            </p>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-20 bg-cyber-surface/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-orbitron font-bold text-neon-purple mb-6">Our Mission</h2>
                <p className="text-cyber-muted text-lg leading-relaxed mb-6">
                  NeoModel bridges the gap between traditional modeling agencies and the digital future. We empower creators to showcase their talent through immersive portfolios while providing brands with innovative ways to discover and connect with the perfect talent.
                </p>
                <p className="text-cyber-muted text-lg leading-relaxed">
                  Our cyberpunk-inspired platform isn't just about aesthetics—it's about creating a new paradigm for creative collaboration in the digital age.
                </p>
              </div>
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-lg border border-neon-purple/30 flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-city text-neon-purple text-6xl mb-4 opacity-50"></i>
                    <p className="text-cyber-muted">Futuristic Digital Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-orbitron font-bold text-center text-neon-purple mb-12">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-cyber-surface p-8 rounded-lg border border-neon-purple/20 neon-border text-center" data-testid="feature-digital-portfolios">
                <div className="w-16 h-16 mx-auto mb-4 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-images text-neon-cyan text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-cyber-text mb-4">Digital Portfolios</h3>
                <p className="text-cyber-muted">Showcase your work with high-resolution galleries, video content, and interactive media that brings your creativity to life.</p>
              </div>
              
              <div className="bg-cyber-surface p-8 rounded-lg border border-neon-purple/20 neon-border text-center" data-testid="feature-smart-matching">
                <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-network-wired text-neon-purple text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-cyber-text mb-4">Smart Matching</h3>
                <p className="text-cyber-muted">Our AI-powered system connects creators with opportunities based on style, experience, and project requirements.</p>
              </div>
              
              <div className="bg-cyber-surface p-8 rounded-lg border border-neon-purple/20 neon-border text-center" data-testid="feature-analytics">
                <div className="w-16 h-16 mx-auto mb-4 bg-neon-magenta/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-chart-line text-neon-magenta text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-cyber-text mb-4">Analytics Dashboard</h3>
                <p className="text-cyber-muted">Track your performance, monitor engagement, and gain insights to optimize your creative strategy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-cyber-surface/50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-orbitron font-bold text-center text-neon-purple mb-12">Our Vision</h2>
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-cyber-muted text-lg leading-relaxed mb-8">
                At NeoModel, we believe the future of creative industries lies at the intersection of human talent and digital innovation. 
                We're building more than just a platform—we're creating a movement that empowers creators to thrive in the digital renaissance.
              </p>
              <p className="text-cyber-muted text-lg leading-relaxed">
                Join us as we reshape the modeling landscape, one creator at a time, in our neon-lit digital metropolis.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
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
              data-testid="button-login-modal"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Initialize Login
            </Button>
          </div>
        </div>
      </Modal>

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
              data-testid="button-signup-modal"
            >
              <i className="fas fa-rocket mr-2"></i>
              Connect to Matrix
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
