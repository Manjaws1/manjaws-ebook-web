
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronDown, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface CategorySelectProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  required?: boolean;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  selectedCategories,
  onCategoriesChange,
  required = false,
}) => {
  const [open, setOpen] = React.useState(false);
  
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      console.log("Fetching categories directly...");
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      
      console.log("Categories fetched successfully:", data);
      return data as Category[];
    },
    retry: 2,
    retryDelay: 1000,
  });

  console.log("CategorySelect - categories:", categories, "loading:", categoriesLoading, "error:", categoriesError);

  const handleCategoryToggle = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      onCategoriesChange(selectedCategories.filter(cat => cat !== categoryName));
    } else {
      onCategoriesChange([...selectedCategories, categoryName]);
    }
  };

  const removeCategory = (categoryName: string) => {
    onCategoriesChange(selectedCategories.filter(cat => cat !== categoryName));
  };

  // Show loading skeleton while categories are being fetched
  if (categoriesLoading) {
    return (
      <div className="space-y-2">
        <Label htmlFor="categories">
          Categories {required && "*"}
        </Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  // Show error state if categories failed to load
  if (categoriesError) {
    return (
      <div className="space-y-2">
        <Label htmlFor="categories">
          Categories {required && "*"}
        </Label>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load categories. Please refresh the page and try again.
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled
        >
          Select categories...
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </div>
    );
  }

  // Ensure categories is a valid array before rendering Command component
  const validCategories = Array.isArray(categories) && categories.length > 0 ? categories : [];
  const hasValidData = !categoriesLoading && !categoriesError && validCategories.length > 0;

  return (
    <div className="space-y-2">
      <Label htmlFor="categories">
        Categories {required && "*"}
      </Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategories.length === 0
              ? "Select categories..."
              : `${selectedCategories.length} category${selectedCategories.length > 1 ? 'ies' : ''} selected`}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          {hasValidData ? (
            <Command key={`categories-${validCategories.length}`}>
              <CommandInput placeholder="Search categories..." />
              <CommandList>
                <CommandEmpty>No categories found.</CommandEmpty>
                <CommandGroup>
                  {validCategories.map((category) => (
                    <CommandItem
                      key={category.id}
                      onSelect={() => handleCategoryToggle(category.name)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCategories.includes(category.name) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {category.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          ) : categoriesLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading categories...
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No categories available. Please contact an administrator to add categories.
            </div>
          )}
        </PopoverContent>
      </Popover>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              {category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeCategory(category)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
