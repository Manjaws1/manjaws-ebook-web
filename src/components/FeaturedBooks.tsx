
import React from "react";
import BookCard from "./BookCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FeaturedBooks: React.FC = () => {
  const { data: featuredBooks, isLoading } = useQuery({
    queryKey: ['featured-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .limit(4);

      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-48" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 animate-pulse">
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!featuredBooks || featuredBooks.length === 0) {
    return (
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Books</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600">No featured books available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Books</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <div key={book.id} className="animate-fadeIn">
              <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                coverImage={book.cover_image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"}
                chapters={book.chapters || 0}
                isPreviewAvailable={true}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
