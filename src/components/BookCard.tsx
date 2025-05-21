
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  chapters: number;
  isPreviewAvailable?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  coverImage,
  chapters,
  isPreviewAvailable = true
}) => {
  return (
    <div className="card h-full flex flex-col">
      <div className="relative pb-[140%] overflow-hidden">
        <img
          src={coverImage}
          alt={`Cover for ${title}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold line-clamp-2 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{author}</p>
        <p className="text-xs text-gray-500 mb-4">{chapters} chapters</p>
        <div className="mt-auto flex flex-col sm:flex-row gap-2">
          {isPreviewAvailable && (
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to={`/preview/${id}`} className="flex items-center justify-center gap-1">
                <Eye className="h-4 w-4" />
                <span className="hidden xs:inline">Preview</span>
              </Link>
            </Button>
          )}
          <Button size="sm" className="w-full bg-primary hover:bg-primary-700" asChild>
            <Link to={`/book/${id}`} className="flex items-center justify-center gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden xs:inline">Download</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
