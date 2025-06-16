
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EbookCard from "@/components/EbookCard";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEbooks } from "@/hooks/useEbooks";

const Library = () => {
  const { user, loading } = useAuth();
  const { useGetEbooks } = useEbooks();
  
  // Get user's uploaded books
  const { data: userEbooks = [], isLoading } = useGetEbooks();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const myUploads = userEbooks.filter(ebook => ebook.uploaded_by === user.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">My Library</h1>
          <p className="text-lg text-muted-foreground">
            View and manage your uploaded eBooks
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your library...</p>
          </div>
        ) : (
          <>
            {myUploads.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {myUploads.map((ebook) => (
                  <EbookCard 
                    key={ebook.id} 
                    ebook={ebook} 
                    showStatus={true}
                    showActions={ebook.status === "approved"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  You haven't uploaded any eBooks yet.
                </p>
                <a 
                  href="/upload" 
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Upload Your First eBook
                </a>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Library;
