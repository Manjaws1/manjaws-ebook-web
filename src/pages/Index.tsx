
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Upload, Library, BookOpen, MessageCircle, Shield } from "lucide-react";
import FeaturedBooks from "@/components/FeaturedBooks";
import FeaturedCategories from "@/components/FeaturedCategories";
import LatestBlogs from "@/components/LatestBlogs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-800 to-primary-900 text-white py-12 sm:py-16 md:py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center min-h-[400px] lg:min-h-[500px]">
            <div className="w-full lg:w-1/2 lg:pr-12 mb-10 lg:mb-0 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 leading-tight animate-fade-in">
                Discover & Share
                <span className="block text-secondary font-extrabold">E-Books</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-6 lg:mb-8 text-white/90 leading-relaxed animate-fade-in animation-delay-200 max-w-2xl mx-auto lg:mx-0">
                Join thousands of readers and writers in our growing digital library. Find your next favorite read or share your knowledge with the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">"
                <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg hover-scale">
                  <Link to="/browse">
                    <Search className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />
                    Get Started
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm font-semibold px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg hover-scale">
                  <Link to="/register">
                    <Upload className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />
                    Join Community
                  </Link>
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center relative mt-8 lg:mt-0">"
              <div className="relative group">
                <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-r from-secondary to-primary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <img 
                  src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
                  alt="Digital library with books and reading experience" 
                  className="relative rounded-2xl shadow-2xl max-w-full h-auto group-hover:scale-105 transition-transform duration-700 max-h-80 lg:max-h-none object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='18' fill='%236b7280'%3EBooks Collection%3C/text%3E%3C/svg%3E";
                  }}
                />"
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-gray-900">How It Works</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to join our thriving community of readers and writers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">"
            <div className="group bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center border border-gray-100">
              <div className="bg-gradient-to-br from-primary to-primary-800 p-3 lg:p-4 rounded-2xl inline-flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4 text-gray-900">Browse E-Books</h3>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                Explore our vast collection of e-books across diverse categories and discover your next favorite read.
              </p>
            </div>"
            
            <div className="group bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center border border-gray-100">
              <div className="bg-gradient-to-br from-secondary to-secondary/80 p-3 lg:p-4 rounded-2xl inline-flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4 text-gray-900">Share Your Knowledge</h3>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                Upload your own e-books and share your expertise with our growing global community.
              </p>
            </div>
            
            <div className="group bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center border border-gray-100 md:col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 lg:p-4 rounded-2xl inline-flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Library className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4 text-gray-900">Build Your Library</h3>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                Create your personal digital library and access your favorite books anytime, anywhere.
              </p>
            </div>"
          </div>
        </div>
      </section>

      {/* New Features Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 lg:mb-12">New Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">"
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-4 lg:p-6 rounded-lg shadow-md text-center border border-secondary/20">
              <div className="bg-secondary/20 p-2 lg:p-3 rounded-full inline-flex items-center justify-center mb-3 lg:mb-4">
                <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-3">Blog & Insights</h3>
              <p className="text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base">
                Stay updated with the latest trends in digital reading and publishing through our expert blog posts.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/blog">Explore Blog</Link>
              </Button>
            </div>"
            
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 lg:p-6 rounded-lg shadow-md text-center border border-primary/20">
              <div className="bg-primary/20 p-2 lg:p-3 rounded-full inline-flex items-center justify-center mb-3 lg:mb-4">
                <MessageCircle className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-3">AI Chat Assistant</h3>
              <p className="text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base">
                Get instant help with book recommendations, platform guidance, and answers to your questions.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/chat">Start Chatting</Link>
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-green-100 to-green-50 p-4 lg:p-6 rounded-lg shadow-md text-center border border-green-200 md:col-span-2 lg:col-span-1">
              <div className="bg-green-200 p-2 lg:p-3 rounded-full inline-flex items-center justify-center mb-3 lg:mb-4">
                <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-green-700" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-3">Copyright Protection</h3>
              <p className="text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base">
                Advanced DRM and copyright protection ensures authors' intellectual property is secure.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/blog">Learn More</Link>
              </Button>
            </div>"
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <FeaturedCategories />
      
      {/* Featured Books */}
      <FeaturedBooks />
      
      {/* Latest Blog Posts */}
      <LatestBlogs />
      
      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary-900 py-12 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-white">Ready to Start Your Journey?</h2>
          <p className="text-lg lg:text-xl mb-8 lg:mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed">
            Join thousands of readers and authors in our thriving community. Discover, share, and explore an endless world of knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center max-w-md mx-auto">
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg hover-scale">
              <Link to="/register">Get Started Today</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm font-semibold px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg hover-scale">
              <Link to="/browse">Explore Books</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
