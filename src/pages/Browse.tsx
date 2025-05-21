
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import BookCard from "@/components/BookCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dummy data for books
const ALL_BOOKS = [
  {
    id: "book1",
    title: "The Art of Programming",
    author: "Jane Doe",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    chapters: 12,
    category: "Programming",
    isPreviewAvailable: true,
  },
  {
    id: "book2",
    title: "Data Structures and Algorithms",
    author: "John Smith",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    chapters: 15,
    category: "Programming",
    isPreviewAvailable: true,
  },
  {
    id: "book3",
    title: "Web Development for Beginners",
    author: "Sarah Johnson",
    coverImage: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    chapters: 10,
    category: "Web Development",
    isPreviewAvailable: true,
  },
  {
    id: "book4",
    title: "Machine Learning Fundamentals",
    author: "Michael Brown",
    coverImage: "https://images.unsplash.com/photo-1599583863916-e06c29084354?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    chapters: 8,
    category: "AI & Machine Learning",
    isPreviewAvailable: true,
  },
  {
    id: "book5",
    title: "Cloud Computing Architecture",
    author: "David Wilson",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    chapters: 10,
    category: "Cloud Computing",
    isPreviewAvailable: true,
  },
  {
    id: "book6",
    title: "Mobile App Development",
    author: "Linda Martinez",
    coverImage: "https://images.unsplash.com/photo-1492107376256-4026437926cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    chapters: 12,
    category: "Mobile Development",
    isPreviewAvailable: true,
  },
  {
    id: "book7",
    title: "Cybersecurity Essentials",
    author: "Robert Taylor",
    coverImage: "https://images.unsplash.com/photo-1470592406127-7d8d6d675ce7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    chapters: 9,
    category: "Security",
    isPreviewAvailable: true,
  },
  {
    id: "book8",
    title: "DevOps Practices",
    author: "Emily Clark",
    coverImage: "https://images.unsplash.com/photo-1546514355-7fdc90ccbd03?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    chapters: 7,
    category: "DevOps",
    isPreviewAvailable: true,
  }
];

// Categories for filtering
const CATEGORIES = [
  "All Categories",
  "Programming",
  "Web Development",
  "AI & Machine Learning",
  "Cloud Computing",
  "Mobile Development",
  "Security",
  "DevOps"
];

const Browse: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Filter books based on search term and category
  const filteredBooks = ALL_BOOKS.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "All Categories" || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gray-50 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Browse E-Books</h1>
          
          {/* Search and filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search by title or author..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={selectedCategory === category ? "bg-primary" : ""}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Books grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  coverImage={book.coverImage}
                  chapters={book.chapters}
                  isPreviewAvailable={book.isPreviewAvailable}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700">No books found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Browse;
