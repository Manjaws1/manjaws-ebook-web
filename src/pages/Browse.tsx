
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EbookCard from "@/components/EbookCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useEbooks } from "@/hooks/useEbooks";

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { useGetEbooks, useGetCategories } = useEbooks();
  const { data: ebooks = [], isLoading } = useGetEbooks("approved");
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategories();

  const filteredEbooks = ebooks.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ebook.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || ebook.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse eBooks</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover and download free eBooks from our community
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category filter buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Badge>
            {categories?.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading eBooks...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredEbooks.length} eBook{filteredEbooks.length !== 1 ? 's' : ''} found
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredEbooks.map((ebook) => (
                <EbookCard key={ebook.id} ebook={ebook} />
              ))}
            </div>

            {filteredEbooks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No eBooks found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Browse;
