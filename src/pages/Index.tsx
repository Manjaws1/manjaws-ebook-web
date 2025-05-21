
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Upload, Library, BookOpen } from "lucide-react";
import FeaturedBooks from "@/components/FeaturedBooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-10 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeIn">
                Discover and Share Your Favorite E-Books
              </h1>
              <p className="text-lg mb-8 text-gray-100 animate-slideIn">
                A platform for readers and writers to discover, share, and discuss e-books on any topic. Upload your own or browse our vast collection.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-secondary hover:bg-secondary-600 text-secondary-foreground">
                  <Link to="/browse">
                    <Search className="mr-2 h-5 w-5" />
                    Browse Books
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  <Link to="/upload">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Your Book
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
                alt="Books collection" 
                className="rounded-lg shadow-xl max-w-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse E-Books</h3>
              <p className="text-gray-600">
                Search our extensive collection of e-books across various categories and genres.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your E-Book</h3>
              <p className="text-gray-600">
                Share your knowledge by uploading your own e-books with our community.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
                <Library className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Build Your Library</h3>
              <p className="text-gray-600">
                Download e-books and create your personal digital library.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Books */}
      <FeaturedBooks />
      
      {/* CTA Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-secondary-foreground">Ready to start reading?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-secondary-foreground/80">
            Join thousands of readers and authors in our growing community. Register now to start uploading, downloading, and exploring e-books.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary-700">
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
