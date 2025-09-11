
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  category: string;
  featured_image: string | null;
  created_at: string;
  author?: {
    full_name: string | null;
    email: string;
  };
}

const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: ["blog-post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          id,
          title,
          content,
          excerpt,
          category,
          featured_image,
          created_at,
          author:profiles(full_name, email)
        `)
        .eq("id", id)
        .eq("status", "published")
        .single();
      
      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!id,
  });
};

// Fallback mock data for demo purposes
interface MockBlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

const getMockBlogPost = (id: string): MockBlogPost | null => {
  const posts = {
    "1": {
      id: 1,
      title: "The Future of Digital Reading",
      content: `
        <p>The landscape of digital reading has evolved dramatically over the past decade, transforming how we consume and interact with written content. From simple PDF viewers to sophisticated e-reading platforms, technology continues to reshape our reading experience.</p>
        
        <h2>Interactive Reading Experiences</h2>
        <p>Modern e-books are no longer static documents. They incorporate multimedia elements, interactive features, and social reading capabilities that enhance comprehension and engagement. Readers can now highlight passages, take notes, and share insights with a global community of book lovers.</p>
        
        <h2>Accessibility and Inclusivity</h2>
        <p>Digital reading platforms have made literature more accessible than ever before. Features like adjustable font sizes, text-to-speech capabilities, and multi-language support ensure that reading is inclusive for people with different needs and preferences.</p>
        
        <h2>The Role of AI in Reading</h2>
        <p>Artificial intelligence is beginning to play a significant role in personalizing the reading experience. From recommendation systems that suggest new books based on reading habits to AI-powered summaries and discussion prompts, technology is making reading more engaging and educational.</p>
        
        <h2>Looking Ahead</h2>
        <p>As we look to the future, we can expect even more innovative features in digital reading platforms. Virtual reality reading environments, advanced copyright protection systems, and seamless integration with educational tools will continue to evolve the way we read and learn.</p>
      `,
      author: "Sarah Johnson",
      date: "2024-05-15",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60&fm=webp",
      category: "Technology"
    },
    "2": {
      id: 2,
      title: "Building Your Digital Library",
      content: `
        <p>Creating a well-organized digital library is an art that combines thoughtful curation with practical organization strategies. Whether you're a casual reader or a research professional, having a systematic approach to managing your digital books can enhance your reading experience significantly.</p>
        
        <h2>Choosing the Right Platform</h2>
        <p>The foundation of a good digital library starts with selecting the right platform. Consider factors like cross-device synchronization, annotation capabilities, and file format support when making your choice.</p>
        
        <h2>Organization Strategies</h2>
        <p>Implement a consistent naming convention and folder structure. Create categories based on genres, subjects, or reading status. Use tags and metadata to make searching easier.</p>
        
        <h2>Backup and Security</h2>
        <p>Always maintain backups of your digital library. Consider using cloud storage solutions and respect copyright restrictions when sharing or storing content.</p>
      `,
      author: "Mike Chen",
      date: "2024-05-10",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "Tips"
    },
    "3": {
      id: 3,
      title: "Copyright Protection in Digital Publishing",
      content: `
        <p>Copyright protection is a critical aspect of digital publishing that affects both authors and readers. Understanding these protections helps create a sustainable ecosystem for digital content creation and distribution.</p>
        
        <h2>Why Copyright Matters</h2>
        <p>Copyright protection ensures that authors and publishers can earn fair compensation for their creative work. This economic incentive drives continued content creation and innovation in the publishing industry.</p>
        
        <h2>Digital Rights Management (DRM)</h2>
        <p>DRM technologies help protect digital content from unauthorized distribution while still allowing legitimate access for purchased content. Modern DRM systems balance security with user convenience.</p>
        
        <h2>Respecting Copyright</h2>
        <p>As consumers of digital content, we have a responsibility to respect copyright restrictions. This includes not sharing copyrighted material without permission and supporting authors through legitimate purchases.</p>
        
        <h2>The Future of Copyright Protection</h2>
        <p>Emerging technologies like blockchain and AI-powered content verification are creating new possibilities for copyright protection while maintaining user-friendly access to digital content.</p>
      `,
      author: "Emily Davis",
      date: "2024-05-05",
      image: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      category: "Legal"
    }
  };
  
  return posts[id as keyof typeof posts] || null;
};

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useBlogPost(id || "");
  
  // Fallback to mock data if no real data found
  const mockPost = getMockBlogPost(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">Loading blog post...</div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayPost = post || mockPost;

  if (!displayPost) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative">
        {('featured_image' in displayPost && displayPost.featured_image) || ('image' in displayPost && displayPost.image) ? (
          <img
            src={('featured_image' in displayPost && displayPost.featured_image)
              ? supabase.storage.from('blog-images').getPublicUrl(displayPost.featured_image as string).data.publicUrl
              : (('image' in displayPost && (displayPost as any).image) || '')}
            alt={displayPost.title}
            className="w-full h-64 md:h-96 object-cover"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60`;
            }}
          />
        ) : (
          <div className="w-full h-64 md:h-96 bg-gradient-to-r from-primary to-primary-800"></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="text-white">
              <span className="bg-primary px-3 py-1 rounded text-sm font-medium">
                {displayPost.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
                {displayPost.title}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>
                    {'author' in displayPost && typeof displayPost.author === 'object' && displayPost.author 
                      ? displayPost.author.full_name || displayPost.author.email 
                      : 'author' in displayPost && typeof displayPost.author === 'string'
                      ? displayPost.author
                      : "Anonymous"
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {'created_at' in displayPost 
                      ? new Date(displayPost.created_at).toLocaleDateString() 
                      : 'date' in displayPost 
                      ? displayPost.date 
                      : "Unknown date"
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Button asChild variant="ghost">
                <Link to="/blog" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog List
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="prose prose-lg max-w-none">
              {displayPost.content ? (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(displayPost.content) }} />
              ) : (
                <div className="whitespace-pre-wrap">{displayPost.content}</div>
              )}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
