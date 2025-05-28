
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Library as LibraryIcon, Download } from "lucide-react";

// Sample downloaded books data to demonstrate the library
const downloadedBooks = [
  {
    id: "1",
    title: "The Great Adventure",
    author: "Jane Smith",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1374&auto=format&fit=crop",
    chapters: 12,
    downloadedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Mystery at Midnight",
    author: "John Doe",
    coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1376&auto=format&fit=crop",
    chapters: 8,
    downloadedAt: "2024-01-10",
  },
  {
    id: "3",
    title: "The Hidden Path",
    author: "Alex Rivera",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1374&auto=format&fit=crop",
    chapters: 15,
    downloadedAt: "2024-01-08",
  },
  {
    id: "4",
    title: "Digital Dreams",
    author: "Sarah Johnson",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop",
    chapters: 10,
    downloadedAt: "2024-01-05",
  },
  {
    id: "5",
    title: "Ocean Mysteries",
    author: "Mike Chen",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1374&auto=format&fit=crop",
    chapters: 14,
    downloadedAt: "2024-01-02",
  }
];

const Library: React.FC = () => {
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'author'>('recent');

  const sortedBooks = [...downloadedBooks].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="container">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <LibraryIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">My Library</h1>
            </div>
            <p className="text-gray-600 mb-6">
              Your downloaded eBooks collection
            </p>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {downloadedBooks.length} books downloaded
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Button
                  variant={sortBy === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('recent')}
                >
                  Recent
                </Button>
                <Button
                  variant={sortBy === 'title' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('title')}
                >
                  Title
                </Button>
                <Button
                  variant={sortBy === 'author' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('author')}
                >
                  Author
                </Button>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Downloaded Books</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {sortedBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      coverImage={book.coverImage}
                      chapters={book.chapters}
                      isPreviewAvailable={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <LibraryIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No books in your library yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start building your collection by downloading books from our catalog
                  </p>
                  <Button asChild>
                    <a href="/browse">Browse eBooks</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Library;
