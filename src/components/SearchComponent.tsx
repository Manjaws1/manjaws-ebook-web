import React, { useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SearchComponentProps {
  onSearch: (query: string, category?: string) => void;
  currentQuery?: string;
  currentCategory?: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  currentQuery = "",
  currentCategory = "all"
}) => {
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory || "all");

  const { data: categories } = useQuery({
    queryKey: ['search-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  const handleSearch = () => {
    onSearch(searchQuery.trim(), selectedCategory === "all" ? undefined : selectedCategory);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    onSearch("", undefined);
  };

  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "all";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search books by title, author, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-4 py-3 text-lg border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
          />
        </div>

        {/* Category Filter */}
        <div className="lg:w-64">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full py-3 border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          className="lg:w-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>

        {/* Clear Button */}
        {hasActiveFilters && (
          <Button 
            variant="outline"
            onClick={clearSearch}
            className="lg:w-auto w-full py-3 px-4"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
          <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">Active filters:</span>
          {searchQuery.trim() && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchQuery}"
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => {
                  setSearchQuery("");
                  onSearch("", selectedCategory === "all" ? undefined : selectedCategory);
                }}
              />
            </Badge>
          )}
          {selectedCategory && selectedCategory !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {selectedCategory}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => {
                  setSelectedCategory("all");
                  onSearch(searchQuery.trim(), undefined);
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;