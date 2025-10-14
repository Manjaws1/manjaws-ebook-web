
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Image } from "lucide-react";
import { useEbooks } from "@/hooks/useEbooks";
import CategorySelect from "./CategorySelect";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Input validation schema
const ebookSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  author: z.string().trim().min(1, "Author is required").max(100, "Author must be less than 100 characters"),
  description: z.string().trim().max(2000, "Description must be less than 2000 characters").optional(),
});

const UploadForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const { useUploadEbook } = useEbooks();
  const uploadMutation = useUploadEbook();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || categories.length === 0 || !file) {
      return;
    }

    // Validate inputs
    try {
      ebookSchema.parse({
        title,
        author,
        description,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    uploadMutation.mutate({
      title,
      author,
      description,
      categories,
      file,
      coverImage: coverImage || undefined,
    }, {
      onSuccess: () => {
        setTitle("");
        setAuthor("");
        setDescription("");
        setCategories([]);
        setFile(null);
        setCoverImage(null);
      },
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-xl lg:text-2xl">
          <Upload className="h-5 w-5 lg:h-6 lg:w-6" />
          Upload eBook
        </CardTitle>
        <CardDescription className="text-sm lg:text-base">
          Share your eBook with the community. All uploads are reviewed before publication.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">"
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>
          </div>
          <div className="col-span-full">"
            <CategorySelect
              selectedCategories={categories}
              onCategoriesChange={setCategories}
              required
            />
          </div>

          <div className="col-span-full space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter book description"
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-2">
              <Label htmlFor="file">eBook File *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.epub,.mobi"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                  className="cursor-pointer"
                />
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, EPUB, MOBI
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover">Cover Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                <Image className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground">
                Optional: JPG, PNG, WebP
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-base lg:text-lg"
            disabled={uploadMutation.isPending}
            size="lg"
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload eBook"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadForm;
