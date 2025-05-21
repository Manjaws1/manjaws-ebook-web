
import React from "react";
import BookCard from "./BookCard";

const FEATURED_BOOKS = [
  {
    id: "book1",
    title: "The Art of Programming",
    author: "Jane Doe",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    chapters: 12,
    isPreviewAvailable: true,
  },
  {
    id: "book2",
    title: "Data Structures and Algorithms",
    author: "John Smith",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    chapters: 15,
    isPreviewAvailable: true,
  },
  {
    id: "book3",
    title: "Web Development for Beginners",
    author: "Sarah Johnson",
    coverImage: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    chapters: 10,
    isPreviewAvailable: true,
  },
  {
    id: "book4",
    title: "Machine Learning Fundamentals",
    author: "Michael Brown",
    coverImage: "https://images.unsplash.com/photo-1599583863916-e06c29084354?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    chapters: 8,
    isPreviewAvailable: true,
  }
];

const FeaturedBooks: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Books</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURED_BOOKS.map((book) => (
            <div key={book.id} className="animate-fadeIn">
              <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                coverImage={book.coverImage}
                chapters={book.chapters}
                isPreviewAvailable={book.isPreviewAvailable}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
