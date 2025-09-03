
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EbookCard from "@/components/EbookCard";
import SearchComponent from "@/components/SearchComponent";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);

  // Get URL parameters for initial search
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['browse-ebooks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('status', 'approved')
        .order('downloads', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Filter books based on search and categories
  React.useEffect(() => {
    if (!data) return;
    
    let filtered = data;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(book => 
        book.category === selectedCategory
      );
    }
    
    setFilteredBooks(filtered);
  }, [data, searchQuery, selectedCategory]);

  const handleSearch = (query: string, category?: string) => {
    setSearchQuery(query);
    setSelectedCategory(category || "");
    
    // Update URL parameters
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('search', query);
    } else {
      url.searchParams.delete('search');
    }
    if (category) {
      url.searchParams.set('category', category);
    } else {
      url.searchParams.delete('category');
    }
    window.history.replaceState({}, '', url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Books
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover your next favorite read from our collection of {data?.length || 0} books
          </p>
        </div>

        {/* Enhanced Search Component */}
        <SearchComponent
          onSearch={handleSearch}
          currentQuery={searchQuery}
          currentCategory={selectedCategory}
        />

        {/* Results */}
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {isLoading ? "Loading..." : `Found ${filteredBooks.length} book(s)`}
            {selectedCategory && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-4"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
              No books found matching your criteria
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              Try adjusting your search terms or browse different categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <EbookCard key={book.id} ebook={book} />
            ))}
          </div>
        )}
      </main>
      
      <AccessibilityMenu />
      <Footer />
    </div>
  );
};

export default Browse;
