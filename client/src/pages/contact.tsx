import { useState } from "react";
import PublicNavbar from "@/components/layout/public-navbar";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleSignup = () => {
    window.location.href = '/api/login';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (in real app, would send to backend)
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent Successfully",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      <PublicNavbar onLogin={() => setShowLogin(true)} onSignup={() => setShowSignup(true)} />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-cyber-surface/20 to-cyber-dark"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 gradient-text">
              CONTACT NEOMODEL
            </h1>
            <p className="text-xl text-cyber-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              Ready to join the future of digital modeling? Connect with our team and let's build something extraordinary together.
            </p>
          </div>
        </section>
        
        {/* Contact Form & Info */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="bg-cyber-surface border-neon-purple/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-orbitron text-neon-purple">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-cyber-muted uppercase text-sm">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan"
                          placeholder="Your full name"
                          data-testid="input-contact-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-cyber-muted uppercase text-sm">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan"
                          placeholder="your@email.com"
                          data-testid="input-contact-email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject" className="text-cyber-muted uppercase text-sm">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan"
                        placeholder="What can we help you with?"
                        data-testid="input-contact-subject"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-cyber-muted uppercase text-sm">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="bg-cyber-dark border-neon-purple/30 text-cyber-text focus:border-neon-cyan resize-none"
                        placeholder="Tell us more about your inquiry..."
                        data-testid="input-contact-message"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-magenta hover:from-neon-purple/80 hover:to-neon-magenta/80 text-white font-bold rounded-lg transition-all duration-300 shadow-neon-purple uppercase tracking-wide"
                      data-testid="button-send-message"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-orbitron font-bold text-neon-purple mb-6">Get in Touch</h2>
                  <p className="text-cyber-muted text-lg leading-relaxed mb-8">
                    Whether you're a creator looking to join our platform or a brand seeking exceptional talent, 
                    we're here to help you navigate the digital modeling landscape.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-6 bg-cyber-surface rounded-lg border border-neon-purple/20" data-testid="contact-info-email">
                    <div className="w-12 h-12 bg-neon-cyan/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-envelope text-neon-cyan text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-cyber-text font-semibold mb-2">Email Us</h3>
                      <p className="text-cyber-muted">hello@neomodel.agency</p>
                      <p className="text-cyber-muted text-sm">We typically respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-6 bg-cyber-surface rounded-lg border border-neon-purple/20" data-testid="contact-info-location">
                    <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-neon-purple text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-cyber-text font-semibold mb-2">Location</h3>
                      <p className="text-cyber-muted">Digital Metropolis</p>
                      <p className="text-cyber-muted text-sm">Serving creators worldwide</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-6 bg-cyber-surface rounded-lg border border-neon-purple/20" data-testid="contact-info-hours">
                    <div className="w-12 h-12 bg-neon-magenta/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-clock text-neon-magenta text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-cyber-text font-semibold mb-2">Office Hours</h3>
                      <p className="text-cyber-muted">24/7 Digital Support</p>
                      <p className="text-cyber-muted text-sm">AI-powered assistance always available</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-orbitron font-bold text-neon-purple mb-4">Follow the Signal</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-12 h-12 bg-cyber-surface border border-neon-purple/30 rounded-full flex items-center justify-center text-cyber-muted hover:text-neon-cyan hover:border-neon-cyan/50 transition-colors" data-testid="social-link-twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="w-12 h-12 bg-cyber-surface border border-neon-purple/30 rounded-full flex items-center justify-center text-cyber-muted hover:text-neon-cyan hover:border-neon-cyan/50 transition-colors" data-testid="social-link-instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="w-12 h-12 bg-cyber-surface border border-neon-purple/30 rounded-full flex items-center justify-center text-cyber-muted hover:text-neon-cyan hover:border-neon-cyan/50 transition-colors" data-testid="social-link-linkedin">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" className="w-12 h-12 bg-cyber-surface border border-neon-purple/30 rounded-full flex items-center justify-center text-cyber-muted hover:text-neon-cyan hover:border-neon-cyan/50 transition-colors" data-testid="social-link-discord">
                      <i className="fab fa-discord"></i>
                    </a>
                  </div>
                </div>
              </div>
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
              data-testid="button-contact-login"
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
              data-testid="button-contact-signup"
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
