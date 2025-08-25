import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PublicNavbarProps {
  onLogin: () => void;
  onSignup: () => void;
}

export default function PublicNavbar({ onLogin, onSignup }: PublicNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="fixed top-0 w-full bg-cyber-surface/90 backdrop-blur-md border-b border-neon-purple/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <i className="fas fa-atom text-neon-cyan text-2xl"></i>
            <h1 className="text-xl font-orbitron font-bold text-neon-purple">NeoModel</h1>
          </Link>
          
          {!isMobile ? (
            <div className="flex items-center space-x-8">
              <Link 
                href="/about" 
                className="text-cyber-muted hover:text-neon-cyan transition-colors duration-300 uppercase tracking-wide text-sm"
                data-testid="link-about"
              >
                About
              </Link>
              <Link 
                href="/blog" 
                className="text-cyber-muted hover:text-neon-cyan transition-colors duration-300 uppercase tracking-wide text-sm"
                data-testid="link-blog"
              >
                Blog
              </Link>
              <Link 
                href="/contact" 
                className="text-cyber-muted hover:text-neon-cyan transition-colors duration-300 uppercase tracking-wide text-sm"
                data-testid="link-contact"
              >
                Contact
              </Link>
              <Button 
                onClick={onLogin}
                variant="outline"
                className="px-4 py-2 bg-transparent border border-neon-purple text-neon-purple hover:bg-neon-purple/10 transition-all duration-300 rounded uppercase tracking-wide text-sm"
                data-testid="button-nav-login"
              >
                Login
              </Button>
              <Button 
                onClick={onSignup}
                className="px-4 py-2 bg-neon-purple hover:bg-neon-purple/80 text-white transition-all duration-300 rounded uppercase tracking-wide text-sm shadow-neon-purple"
                data-testid="button-nav-signup"
              >
                Sign Up
              </Button>
            </div>
          ) : (
            <button 
              className="text-cyber-text text-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <i className="fas fa-bars"></i>
            </button>
          )}
        </div>
        
        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden bg-cyber-surface border-t border-neon-purple/20 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/about" className="text-cyber-muted hover:text-neon-cyan transition-colors uppercase tracking-wide text-sm">
                About
              </Link>
              <Link href="/blog" className="text-cyber-muted hover:text-neon-cyan transition-colors uppercase tracking-wide text-sm">
                Blog
              </Link>
              <Link href="/contact" className="text-cyber-muted hover:text-neon-cyan transition-colors uppercase tracking-wide text-sm">
                Contact
              </Link>
              <Button onClick={onLogin} variant="outline" className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 uppercase tracking-wide text-sm">
                Login
              </Button>
              <Button onClick={onSignup} className="bg-neon-purple hover:bg-neon-purple/80 text-white uppercase tracking-wide text-sm">
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
