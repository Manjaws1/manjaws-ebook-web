
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Image } from "lucide-react";
import { useEbooks } from "@/hooks/useEbooks";
import CategorySelect from "./CategorySelect";

const UploadForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const { useUploadEbook } = useEbooks();
  const uploadMutation = useUploadEbook();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || categories.length === 0 || !file) {
      return;
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload eBook
        </CardTitle>
        <CardDescription>
          Share your eBook with the community. All uploads are reviewed before publication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <CategorySelect
            selectedCategories={categories}
            onCategoriesChange={setCategories}
            required
          />

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter book description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file">eBook File *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.epub,.mobi"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
                <FileText className="h-4 w-4 text-muted-foreground" />
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
                />
                <Image className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Optional: JPG, PNG, WebP
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload eBook"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadForm;
