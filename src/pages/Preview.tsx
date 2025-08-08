import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string | null;
  category: string;
  file_url: string | null;
  cover_image: string | null;
  downloads: number;
  chapters: number;
}

const useEbook = (id: string) => {
  return useQuery({
    queryKey: ["ebook", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Ebook;
    },
    enabled: !!id,
  });
};

const Preview: React.FC = () => {
  const { id = "" } = useParams();
  const { data: ebook, isLoading, error } = useEbook(id);

  React.useEffect(() => {
    if (ebook?.title) {
      document.title = `${ebook.title} • Preview`;
    } else {
      document.title = "Book Preview";
    }
  }, [ebook?.title]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 md:py-14 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {/* Breadcrumb / Back */}
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link to="/browse">← Back to Browse</Link>
            </Button>
          </div>

          {/* States */}
          {isLoading && (
            <div className="text-center py-20 text-muted-foreground">Loading preview…</div>
          )}
          {error && (
            <div className="text-center py-20 text-destructive">Failed to load this book.</div>
          )}

          {ebook && (
            <article className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Cover */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] bg-muted">
                    <img
                      src={ebook.cover_image || "/placeholder.svg"}
                      alt={`Cover of ${ebook.title}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const t = e.currentTarget as HTMLImageElement;
                        t.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Details */}
              <div className="md:col-span-2">
                <header className="mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">{ebook.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>by <span className="font-medium text-foreground">{ebook.author}</span></span>
                    <Badge variant="secondary" className="capitalize">{ebook.category}</Badge>
                    {ebook.chapters > 0 && (
                      <span>{ebook.chapters} chapters</span>
                    )}
                    <span>{ebook.downloads} downloads</span>
                  </div>
                </header>

                {/* Description */}
                <section aria-label="Description" className="bg-background rounded-lg border p-5 md:p-6">
                  {ebook.description ? (
                    <div className="text-base leading-7 md:leading-8 text-foreground">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="leading-7">{children}</li>,
                        }}
                      >
                        {ebook.description}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No description provided.</p>
                  )}
                </section>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild>
                    <a href={`/preview/${ebook.id}`} onClick={(e) => e.preventDefault()}>
                      Preview
                    </a>
                  </Button>
                  <Button asChild variant="outline" disabled={!ebook.file_url}>
                    <a href={ebook.file_url ?? "#"} target="_blank" rel="noreferrer">
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Preview;
