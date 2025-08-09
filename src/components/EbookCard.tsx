
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { Ebook, useEbooks } from "@/hooks/useEbooks";
import { Link } from "react-router-dom";

interface EbookCardProps {
  ebook: Ebook;
  showStatus?: boolean;
  showActions?: boolean;
}

const EbookCard: React.FC<EbookCardProps> = ({ ebook, showStatus = false, showActions = true }) => {
  const { useDownloadEbook } = useEbooks();
  const downloadMutation = useDownloadEbook();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "rejected":
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleDownload = () => {
    if (ebook.file_url) {
      downloadMutation.mutate(ebook.id);
      window.open(ebook.file_url, "_blank");
    }
  };

  return (
    <Card className="h-full flex flex-col group hover:shadow-lg transition-shadow duration-300">
      {ebook.cover_image && (
        <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
          <img
            src={ebook.cover_image}
            alt={ebook.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
      
      <CardHeader className="flex-shrink-0 p-3 lg:p-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base lg:text-lg line-clamp-2 leading-tight">{ebook.title}</CardTitle>"
          {showStatus && (
            <Badge className={`${getStatusColor(ebook.status)} flex items-center gap-1`}>
              {getStatusIcon(ebook.status)}
              {ebook.status}
            </Badge>
          )}
        </div>
        <CardDescription>
          <div className="space-y-1">
            <p className="font-medium text-sm lg:text-base">by {ebook.author}</p>
            <p className="text-xs lg:text-sm">{ebook.category}</p>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-3 lg:p-4 pt-0">
        {ebook.description && (
          <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4 line-clamp-3 flex-1">
            {ebook.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4">
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {ebook.downloads} downloads
          </span>
          {ebook.chapters > 0 && (
            <span>{ebook.chapters} chapters</span>
          )}
        </div>

        {showActions && ebook.status === "approved" && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1 text-xs lg:text-sm"
              onClick={handleDownload}
              disabled={!ebook.file_url || downloadMutation.isPending}
            >
              <Download className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" asChild className="flex-1 text-xs lg:text-sm">
              <Link to={`/preview/${ebook.id}`}>
                <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                Preview
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EbookCard;
