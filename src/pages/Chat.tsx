
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant for Manjaws E-Book. I can help you with book recommendations, reading tips, and answer questions about our platform. How can I assist you today?",
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
    
    if (lowerMessage.includes("recommend") || lowerMessage.includes("suggestion")) {
      return "I'd be happy to recommend some books! What genre are you interested in? We have a wide selection of fiction, non-fiction, technical books, and more in our library.";
    } else if (lowerMessage.includes("upload") || lowerMessage.includes("publish")) {
      return "To upload your e-book, you'll need to create an account and go to the 'Upload eBook' section. Make sure your content is original and doesn't violate any copyright laws. We support PDF, EPUB, and MOBI formats.";
    } else if (lowerMessage.includes("copyright") || lowerMessage.includes("protection")) {
      return "We take copyright protection seriously at Manjaws E-Book. All uploaded content is scanned for copyright violations, and we use advanced DRM systems to protect authors' intellectual property. Please only upload content you own or have permission to distribute.";
    } else if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return "I'm here to help! You can ask me about book recommendations, how to use our platform, uploading guidelines, or any other questions about Manjaws E-Book. What specific help do you need?";
    } else if (lowerMessage.includes("format") || lowerMessage.includes("file")) {
      return "We support multiple e-book formats including PDF, EPUB, and MOBI. For the best reading experience, we recommend EPUB format as it's responsive and works well across all devices.";
    } else {
      return "That's an interesting question! While I can help with basic information about our platform, for more complex queries, you might want to browse our blog or contact our support team. Is there anything specific about e-books or our platform I can help you with?";
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
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageCircle className="h-8 w-8" />
              <h1 className="text-3xl md:text-4xl font-bold">AI Chat Assistant</h1>
            </div>
            <p className="text-lg text-gray-100">
              Get instant help with book recommendations, platform guidance, and more!
            </p>
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <div className="flex-grow flex flex-col bg-gray-50">
        <div className="container mx-auto px-4 py-6 flex-grow flex flex-col max-w-4xl">
          
          {/* Messages Container */}
          <div className="flex-grow bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
            <div className="flex-grow overflow-y-auto p-6 space-y-4" style={{ maxHeight: "60vh" }}>
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
                  <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
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
            <div className="border-t bg-white p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-grow"
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-primary hover:bg-primary-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("Can you recommend some good books?")}
              disabled={isTyping}
            >
              Book Recommendations
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("How do I upload an e-book?")}
              disabled={isTyping}
            >
              Upload Help
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("Tell me about copyright protection")}
              disabled={isTyping}
            >
              Copyright Info
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Chat;
