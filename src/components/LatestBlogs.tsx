import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Blog {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  featured_image: string | null;
  created_at: string;
  author?: {
    full_name: string | null;
    email: string;
  };
}

const useLatestBlogs = () => {
  return useQuery({
    queryKey: ["latest-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          id,
          title,
          excerpt,
          category,
          featured_image,
          created_at,
          author:profiles(full_name, email)
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data as Blog[];
    },
  });
};

const LatestBlogs: React.FC = () => {
  const { data: blogs = [], isLoading } = useLatestBlogs();

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Latest Blog Posts
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Latest Blog Posts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with insights, tips, and stories from our community of readers and writers
          </p>
        </div>
        
        {blogs.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog, index) => (
                <article
                  key={blog.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={blog.featured_image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='system-ui' font-size='16' fill='%236b7280'%3EBlog Post ${index + 1}%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {blog.excerpt || "Discover insights and tips from our community of passionate readers and writers."}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(blog.created_at)}</span>
                      </div>
                      {blog.author?.full_name && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{blog.author.full_name}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      asChild 
                      variant="ghost" 
                      size="sm" 
                      className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      <Link to={`/blog/${blog.id}`} className="flex items-center justify-center gap-2">
                        Read More <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="text-center">
              <Button asChild size="lg" variant="outline" className="hover-scale">
                <Link to="/blog">
                  View All Posts
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
            <p className="text-gray-600">We're working on exciting blog content for you!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestBlogs;