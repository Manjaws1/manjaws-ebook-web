import { supabase } from "@/integrations/supabase/client";

export interface EbookData {
  id: string;
  title: string;
  author: string;
  category: string;
  description?: string;
  downloads: number;
}

export interface CategoryData {
  id: string;
  name: string;
  description?: string;
}

export class ChatbotService {
  private static instance: ChatbotService;
  private cachedEbooks: EbookData[] = [];
  private cachedCategories: CategoryData[] = [];
  private lastFetch = 0;
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  private async refreshCacheIfNeeded() {
    const now = Date.now();
    if (now - this.lastFetch > this.cacheExpiry) {
      try {
        // Fetch categories
        const { data: categories } = await supabase
          .from('categories')
          .select('id, name, description');
        
        if (categories) {
          this.cachedCategories = categories;
        }

        // Fetch approved ebooks
        const { data: ebooks } = await supabase
          .from('ebooks')
          .select('id, title, author, category, description, downloads')
          .eq('status', 'approved')
          .limit(100);
        
        if (ebooks) {
          this.cachedEbooks = ebooks;
        }

        this.lastFetch = now;
      } catch (error) {
        console.error('Error fetching chatbot data:', error);
      }
    }
  }

  async generateResponse(userMessage: string): Promise<string> {
    await this.refreshCacheIfNeeded();
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Handle category requests
    if (lowerMessage.includes("categor") && (lowerMessage.includes("list") || lowerMessage.includes("what") || lowerMessage.includes("available"))) {
      if (this.cachedCategories.length === 0) {
        return "I'm currently updating our category list. Please try again in a moment, or you can browse our categories on the main site.";
      }
      
      const categoryList = this.cachedCategories.map(cat => cat.name).join(", ");
      return `We currently have the following categories available: ${categoryList}. Would you like me to show you books from any specific category?`;
    }
    
    // Handle books by category
    if (lowerMessage.includes("book") && (lowerMessage.includes("categor") || this.cachedCategories.some(cat => 
      lowerMessage.includes(cat.name.toLowerCase())
    ))) {
      const matchedCategory = this.cachedCategories.find(cat => 
        lowerMessage.includes(cat.name.toLowerCase())
      );
      
      if (matchedCategory) {
        const booksInCategory = this.cachedEbooks.filter(book => 
          book.category.toLowerCase() === matchedCategory.name.toLowerCase()
        );
        
        if (booksInCategory.length === 0) {
          return `I didn't find any books in the ${matchedCategory.name} category at the moment. You can check other categories or browse our full collection.`;
        }
        
        const bookList = booksInCategory.slice(0, 5).map(book => 
          `"${book.title}" by ${book.author} (${book.downloads} downloads)`
        ).join("\n• ");
        
        return `Here are some popular books in ${matchedCategory.name}:\n• ${bookList}${booksInCategory.length > 5 ? `\n\nAnd ${booksInCategory.length - 5} more books in this category!` : ''}`;
      }
    }
    
    // Handle general book recommendations
    if (lowerMessage.includes("recommend") || lowerMessage.includes("suggestion") || lowerMessage.includes("popular book")) {
      if (this.cachedEbooks.length === 0) {
        return "I'm currently updating our book database. Please check our Browse page for the latest books, or try again in a moment.";
      }
      
      const popularBooks = this.cachedEbooks
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, 5);
      
      const bookList = popularBooks.map(book => 
        `"${book.title}" by ${book.author} (${book.category}) - ${book.downloads} downloads`
      ).join("\n• ");
      
      return `Here are our most popular books:\n• ${bookList}\n\nWould you like recommendations from a specific category?`;
    }
    
    // Handle author searches
    if (lowerMessage.includes("author") || lowerMessage.includes("written by")) {
      const authors = [...new Set(this.cachedEbooks.map(book => book.author))];
      const authorList = authors.slice(0, 10).join(", ");
      return `We have books from many authors including: ${authorList}${authors.length > 10 ? ' and many more' : ''}. Try asking for books by a specific author!`;
    }
    
    // Handle book count/statistics
    if (lowerMessage.includes("how many book") || lowerMessage.includes("total book")) {
      return `We currently have ${this.cachedEbooks.length} approved books across ${this.cachedCategories.length} categories. Our collection is constantly growing with new uploads!`;
    }
    
    // Handle specific book search
    if (lowerMessage.includes("find book") || lowerMessage.includes("search book")) {
      return "I can help you find books! You can ask me for:\n• Books by category (e.g., 'Show me fiction books')\n• Popular books\n• Books by a specific author\n• Our available categories\n\nWhat type of book are you looking for?";
    }
    
    // Fall back to original responses for other queries
    if (lowerMessage.includes("upload") || lowerMessage.includes("publish")) {
      return "To upload your e-book to Manjaws E-Book, you'll need to create an account and go to the 'Upload eBook' section. Please ensure your content is original and doesn't violate copyright laws. We support PDF, EPUB, and MOBI formats. All uploads are protected by our copyright protection system.";
    } else if (lowerMessage.includes("copyright") || lowerMessage.includes("protection") || lowerMessage.includes("drm")) {
      return "Manjaws E-Book takes copyright protection very seriously. We use advanced DRM (Digital Rights Management) technology to protect authors' intellectual property. All content is monitored and protected against unauthorized copying or distribution.";
    } else if (lowerMessage.includes("account") || lowerMessage.includes("login") || lowerMessage.includes("register")) {
      return "You can create a free account on Manjaws E-Book by clicking the Login button and then selecting 'create a new account'. Having an account allows you to upload e-books, build your personal library, access our blog, and more!";
    } else if (lowerMessage.includes("library") || lowerMessage.includes("my books")) {
      return "Your personal library on Manjaws E-Book stores all your uploaded and saved e-books. You can access it through the 'My Library' section after logging in. It's your personal collection where you can organize and access your favorite reads.";
    } else if (lowerMessage.includes("blog")) {
      return "Our blog features the latest insights about digital reading, e-book publishing tips, technology trends, and industry news. You can access it through the Blog section after creating an account. It's a great resource for both readers and authors!";
    } else if (lowerMessage.includes("format") || lowerMessage.includes("file type")) {
      return "Manjaws E-Book supports multiple e-book formats including PDF, EPUB, and MOBI. For the best reading experience across all devices, we recommend EPUB format as it's responsive and adapts well to different screen sizes.";
    } else if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return "I'm here to help with any questions about Manjaws E-Book! You can ask about:\n• Our book categories and available books\n• Book recommendations\n• Platform features and uploading guidelines\n• Account management\n\nWhat would you like to know?";
    } else {
      return `Thank you for your question! I can help you with:\n• Finding books by category (we have ${this.cachedCategories.length} categories)\n• Book recommendations from our ${this.cachedEbooks.length} books\n• Platform information and uploading guidelines\n\nTry asking me 'What categories do you have?' or 'Recommend some popular books!'`;
    }
  }
}

export const chatbotService = ChatbotService.getInstance();