import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, Book, Heart, Briefcase, GraduationCap, Utensils, Palette, Globe, Zap, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Icon mapping for categories
const CATEGORY_ICONS = {
  "Fiction": Book,
  "Romance": Heart,
  "Business": Briefcase,
  "Education": GraduationCap,
  "Cooking": Utensils,
  "Art & Design": Palette,
  "Art": Palette,
  "Technology": Zap,
  "Health": Heart,
  "Science": Globe,
  "History": Book,
  "Biography": Users,
  "Self-Help": Users,
  "Travel": Globe,
  "Mystery": Book,
  "Fantasy": Book,
  "default": Book
};

// Color mapping for categories
const CATEGORY_COLORS = {
  "Fiction": "from-blue-500 to-purple-600",
  "Romance": "from-pink-500 to-red-500", 
  "Business": "from-green-500 to-emerald-600",
  "Education": "from-indigo-500 to-blue-600",
  "Cooking": "from-orange-500 to-yellow-500",
  "Art & Design": "from-purple-500 to-pink-500",
  "Art": "from-purple-500 to-pink-500",
  "Technology": "from-cyan-500 to-blue-500",
  "Health": "from-green-400 to-emerald-500",
  "Science": "from-blue-400 to-indigo-500",
  "History": "from-amber-500 to-orange-500",
  "Biography": "from-gray-500 to-slate-600",
  "Self-Help": "from-teal-500 to-cyan-500",
  "Travel": "from-emerald-500 to-teal-500",
  "Mystery": "from-violet-500 to-purple-600",
  "Fantasy": "from-indigo-600 to-purple-700",
  "default": "from-gray-500 to-slate-600"
};

const FeaturedCategories: React.FC = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['featured-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          description,
          ebook_categories(count)
        `)
        .limit(6);

      if (error) throw error;

      // Calculate book counts and format data
      return data?.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description || `Discover amazing ${category.name.toLowerCase()} books`,
        icon: CATEGORY_ICONS[category.name as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.default,
        color: CATEGORY_COLORS[category.name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default,
        count: category.ebook_categories?.length || 0
      })) || [];
    }
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-4 max-w-md mx-auto" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse max-w-2xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse mb-4" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Explore by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover e-books across diverse categories tailored to your interests and expertise
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories?.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {category.description}
                  </p>
                  <p className="text-xs font-medium text-gray-500 mb-4">
                    {category.count} book{category.count !== 1 ? 's' : ''}
                  </p>
                  
                  <Button 
                    asChild 
                    variant="ghost" 
                    size="sm" 
                    className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-white"
                  >
                    <a href={`/browse?category=${encodeURIComponent(category.name)}`}>
                      Explore <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="hover-scale">
            <a href="/browse">
              View All Categories
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;