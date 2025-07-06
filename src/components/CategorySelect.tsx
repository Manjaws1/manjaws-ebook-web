
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEbooks } from "@/hooks/useEbooks";

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
  const { useGetCategories } = useEbooks();
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useGetCategories();

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
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>
              {categoriesError ? "Error loading categories" : "No categories found."}
            </CommandEmpty>
            <CommandGroup>
              {categoriesLoading ? (
                <div className="p-2 text-sm text-muted-foreground">Loading categories...</div>
              ) : (
                categories?.map((category) => (
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
                )) || null
              )}
            </CommandGroup>
          </Command>
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
