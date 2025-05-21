
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Manjaws E-Book</h3>
            <p className="text-sm text-gray-300">
              Your go-to platform for discovering, sharing, and reading e-books.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-300 hover:text-white text-sm">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-gray-300 hover:text-white text-sm">
                  Upload Book
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-gray-300 hover:text-white text-sm">
                  My Library
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-sm text-gray-300 mb-2">
              Stay updated with our latest e-book releases and news.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 text-sm rounded-l-md w-full focus:outline-none text-gray-900"
              />
              <button
                type="submit"
                className="bg-secondary hover:bg-secondary-600 px-4 py-2 rounded-r-md text-secondary-foreground font-medium text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Manjaws E-Book. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
