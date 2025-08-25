import { useState } from "react";
import PublicNavbar from "@/components/layout/public-navbar";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  publishedAt: string;
  featured: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Digital Modeling: AI-Powered Portfolio Creation',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way creators build and showcase their portfolios in the digital age.',
    content: 'Full blog post content would go here...',
    category: 'Technology',
    readTime: '5 min read',
    publishedAt: '2024-01-15',
    featured: true,
  },
  {
    id: '2',
    title: 'Building Your Brand in the Cyberpunk Era',
    excerpt: 'Learn essential strategies for creators to establish their unique identity in an increasingly digital marketplace.',
    content: 'Full blog post content would go here...',
    category: 'Creator Tips',
    readTime: '7 min read',
    publishedAt: '2024-01-10',
    featured: false,
  },
  {
    id: '3',
    title: 'Virtual Fashion Shows: The New Runway Experience',
    excerpt: 'Exploring how virtual reality and digital environments are transforming fashion presentations and creator opportunities.',
    content: 'Full blog post content would go here...',
    category: 'Industry',
    readTime: '4 min read',
    publishedAt: '2024-01-05',
    featured: false,
  },
  {
    id: '4',
    title: 'Maximizing Your Profile Views: Data-Driven Strategies',
    excerpt: 'Analyze platform analytics to understand what content resonates with your audience and drives engagement.',
    content: 'Full blog post content would go here...',
    category: 'Analytics',
    readTime: '6 min read',
    publishedAt: '2024-01-01',
    featured: false,
  },
];

export default function Blog() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleSignup = () => {
    window.location.href = '/api/login';
  };

  const categories = ['All', 'Technology', 'Creator Tips', 'Industry', 'Analytics'];
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              NEOMODEL INSIGHTS
            </h1>
            <p className="text-xl text-cyber-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              Stay ahead of the curve with the latest trends, tips, and innovations in digital modeling and creator economy.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="pb-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-neon-purple text-white shadow-neon-purple'
                      : 'bg-cyber-surface text-cyber-muted border border-neon-purple/30 hover:border-neon-purple/50 hover:text-neon-purple'
                  }`}
                  data-testid={`category-filter-${category.toLowerCase().replace(' ', '-')}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && (
          <section className="pb-16">
            <div className="max-w-6xl mx-auto px-4">
              <Card className="bg-cyber-surface border-neon-purple/20 overflow-hidden" data-testid="featured-post">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-star text-neon-purple text-6xl mb-4 opacity-50"></i>
                      <Badge className="bg-neon-purple text-white">Featured</Badge>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <Badge variant="outline" className="border-neon-cyan text-neon-cyan w-fit mb-4">
                      {featuredPost.category}
                    </Badge>
                    <h2 className="text-2xl font-orbitron font-bold text-cyber-text mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-cyber-muted mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-cyber-muted mb-6">
                      <span>{formatDate(featuredPost.publishedAt)}</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <Button className="bg-gradient-to-r from-neon-purple to-neon-magenta hover:from-neon-purple/80 hover:to-neon-magenta/80 text-white">
                      Read Full Article
                      <i className="fas fa-arrow-right ml-2"></i>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}
        
        {/* Blog Posts Grid */}
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <Card key={post.id} className="bg-cyber-surface border-neon-purple/20 hover:border-neon-purple/50 transition-all duration-300 group" data-testid={`blog-post-${post.id}`}>
                  <CardHeader>
                    <div className="relative h-48 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 rounded-lg mb-4 flex items-center justify-center">
                      <i className="fas fa-file-alt text-neon-purple text-3xl opacity-50 group-hover:opacity-70 transition-opacity"></i>
                    </div>
                    <Badge variant="outline" className="border-neon-cyan text-neon-cyan w-fit mb-2">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl font-orbitron font-bold text-cyber-text group-hover:text-neon-purple transition-colors">
                      {post.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyber-muted mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-cyber-muted mb-4">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Button variant="ghost" className="w-full text-neon-purple hover:bg-neon-purple/10">
                      Read More
                      <i className="fas fa-arrow-right ml-2"></i>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-search text-neon-purple text-2xl"></i>
                </div>
                <h3 className="text-xl font-orbitron font-bold text-cyber-text mb-2">No Posts Found</h3>
                <p className="text-cyber-muted">No articles match the selected category. Try choosing a different filter.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-cyber-surface/50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-neon-cyan/20 rounded-full flex items-center justify-center">
              <i className="fas fa-rss text-neon-cyan text-2xl"></i>
            </div>
            <h2 className="text-3xl font-orbitron font-bold text-neon-purple mb-4">Stay in the Loop</h2>
            <p className="text-cyber-muted text-lg mb-8 max-w-2xl mx-auto">
              Get the latest insights, trends, and tips delivered directly to your digital inbox. Join the NeoModel community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-cyber-dark border border-neon-purple/30 rounded-lg text-cyber-text focus:border-neon-cyan focus:outline-none transition-colors"
                data-testid="input-newsletter-email"
              />
              <Button className="bg-gradient-to-r from-neon-purple to-neon-magenta hover:from-neon-purple/80 hover:to-neon-magenta/80 text-white px-8 py-3" data-testid="button-subscribe">
                Subscribe
              </Button>
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
              data-testid="button-blog-login"
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
              data-testid="button-blog-signup"
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
