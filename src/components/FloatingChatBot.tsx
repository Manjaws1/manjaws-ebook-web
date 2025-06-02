
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, MessageCircle, X, Minimize2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const FloatingChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Manjaws E-Book assistant. I can help you with information about our platform, book recommendations, uploading guidelines, and more. How can I assist you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("recommend") || lowerMessage.includes("suggestion") || lowerMessage.includes("book")) {
      return "I'd be happy to help with book recommendations! At Manjaws E-Book, we have a diverse collection including fiction, non-fiction, technical books, and academic texts. You can browse our collection on the Browse eBooks page. What genre interests you most?";
    } else if (lowerMessage.includes("upload") || lowerMessage.includes("publish")) {
      return "To upload your e-book to Manjaws E-Book, you'll need to create an account and go to the 'Upload eBook' section. Please ensure your content is original and doesn't violate copyright laws. We support PDF, EPUB, and MOBI formats. All uploads are protected by our copyright protection system.";
    } else if (lowerMessage.includes("copyright") || lowerMessage.includes("protection") || lowerMessage.includes("drm")) {
      return "Manjaws E-Book takes copyright protection very seriously. We use advanced DRM (Digital Rights Management) technology to protect authors' intellectual property. All content is monitored and protected against unauthorized copying or distribution.";
    } else if (lowerMessage.includes("account") || lowerMessage.includes("login") || lowerMessage.includes("register")) {
      return "You can create a free account on Manjaws E-Book by clicking the Login button and then selecting 'create a new account'. Having an account allows you to upload e-books, build your personal library, access our blog, and more!";
    } else if (lowerMessage.includes("library") || lowerMessage.includes("my books")) {
      return "Your personal library on Manjaws E-Book stores all your uploaded and saved e-books. You can access it through the 'My Library' section after logging in. It's your personal collection where you can organize and access your favorite reads.";
    } else if (lowerMessage.includes("blog")) {
      return "Our blog features the latest insights about digital reading, e-book publishing tips, technology trends, and industry news. You can access it through the Blog section after creating an account. It's a great resource for both readers and authors!";
    } else if (lowerMessage.includes("admin") || lowerMessage.includes("manage")) {
      return "Administrative features are available for authorized users only. Admins can manage users, moderate e-book content, and oversee platform operations. If you're an author or publisher interested in administrative access, please contact our support team.";
    } else if (lowerMessage.includes("format") || lowerMessage.includes("file type")) {
      return "Manjaws E-Book supports multiple e-book formats including PDF, EPUB, and MOBI. For the best reading experience across all devices, we recommend EPUB format as it's responsive and adapts well to different screen sizes.";
    } else if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return "I'm here to help with any questions about Manjaws E-Book! You can ask about our platform features, uploading guidelines, account management, or book recommendations. For technical issues, you can also contact our support team.";
    } else {
      return "Thank you for your question! I'm designed to help with information about Manjaws E-Book platform, including uploading e-books, browsing our collection, account management, and our copyright protection features. Could you please be more specific about what you'd like to know?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: generateBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary-700 shadow-lg z-50 p-0"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Manjaws AI Assistant
            </SheetTitle>
          </SheetHeader>
          
          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === "user" 
                    ? "bg-primary text-white" 
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {message.sender === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-900"
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === "user" ? "text-gray-200" : "text-gray-500"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our platform..."
                className="flex-grow"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="icon"
                className="bg-primary hover:bg-primary-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FloatingChatBot;
