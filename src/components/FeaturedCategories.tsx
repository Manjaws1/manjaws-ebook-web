import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Heart, Briefcase, GraduationCap, Palette, TrendingUp, Brain } from "lucide-react";

const FEATURED_CATEGORIES = [
  {
    id: "technology",
    name: "Technology",
    description: "Programming, AI, and digital innovation",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    count: "120+ books"
  },
  {
    id: "business",
    name: "Business",
    description: "Entrepreneurship and leadership guides",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-500",
    count: "85+ books"
  },
  {
    id: "education",
    name: "Education",
    description: "Learning resources and academic content",
    icon: GraduationCap,
    color: "from-purple-500 to-violet-500",
    count: "200+ books"
  },
  {
    id: "health",
    name: "Health & Wellness",
    description: "Fitness, nutrition, and mental health",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    count: "95+ books"
  },
  {
    id: "arts",
    name: "Arts & Design",
    description: "Creative arts and design principles",
    icon: Palette,
    color: "from-orange-500 to-yellow-500",
    count: "60+ books"
  },
  {
    id: "finance",
    name: "Finance",
    description: "Investment and personal finance",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    count: "70+ books"
  },
  {
    id: "psychology",
    name: "Psychology",
    description: "Human behavior and mental processes",
    icon: Brain,
    color: "from-indigo-500 to-blue-500",
    count: "45+ books"
  },
  {
    id: "general",
    name: "General",
    description: "Diverse topics and general knowledge",
    icon: BookOpen,
    color: "from-gray-500 to-slate-500",
    count: "150+ books"
  }
];

const FeaturedCategories: React.FC = () => {
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
          {FEATURED_CATEGORIES.map((category) => {
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
                    {category.count}
                  </p>
                  
                  <Button 
                    asChild 
                    variant="ghost" 
                    size="sm" 
                    className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-white"
                  >
                    <Link to={`/browse?category=${category.id}`}>
                      Explore →
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="hover-scale">
            <Link to="/browse">
              View All Categories
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;