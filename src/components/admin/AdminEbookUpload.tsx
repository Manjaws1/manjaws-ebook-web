import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, Image, Crown, CheckCircle } from "lucide-react";
import { useEbooks } from "@/hooks/useEbooks";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CategorySelect from "../CategorySelect";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
}

const AdminEbookUpload = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [selectedUploader, setSelectedUploader] = useState<string>("");
  const [bypassModeration, setBypassModeration] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [chapters, setChapters] = useState<number>(0);

  const { toast } = useToast();

  // Fetch all users for uploader selection
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name");
      
      if (error) throw error;
      return data as Profile[];
    },
  });

  const handleAdminUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || categories.length === 0 || !file) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Use selected uploader or current admin user
      const uploaderId = selectedUploader || user.id;

      // Upload file
      const fileExt = file.name.split('.').pop();
      const fileName = `${uploaderId}/${Date.now()}.${fileExt}`;
      
      const { error: fileError } = await supabase.storage
        .from("ebooks")
        .upload(fileName, file);

      if (fileError) throw fileError;

      // Upload cover image if provided
      let coverImagePath = null;
      if (coverImage) {
        const coverExt = coverImage.name.split('.').pop();
        const coverFileName = `${uploaderId}/${Date.now()}_cover.${coverExt}`;
        
        const { error: coverError } = await supabase.storage
          .from("covers")
          .upload(coverFileName, coverImage);

        if (coverError) throw coverError;
        coverImagePath = `https://jhrecjjibycsyzgmfnvp.supabase.co/storage/v1/object/public/covers/${coverFileName}`;
      }

      // Create ebook record with admin privileges
      const { data: ebook, error: ebookError } = await supabase
        .from("ebooks")
        .insert({
          title,
          author,
          description,
          category: categories[0],
          uploaded_by: uploaderId,
          file_url: `https://jhrecjjibycsyzgmfnvp.supabase.co/storage/v1/object/public/ebooks/${fileName}`,
          cover_image: coverImagePath,
          file_size: file.size,
          status: bypassModeration ? 'approved' : 'pending',
          is_featured: isFeatured,
          chapters: chapters || 0,
        })
        .select()
        .single();

      if (ebookError) throw ebookError;

      // Get category IDs for the selected category names
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name")
        .in("name", categories);

      if (categoryError) throw categoryError;

      // Create ebook-category relationships
      if (categoryData && categoryData.length > 0) {
        const ebookCategories = categoryData.map(category => ({
          ebook_id: ebook.id,
          category_id: category.id,
        }));

        const { error: relationError } = await supabase
          .from("ebook_categories")
          .insert(ebookCategories);

        if (relationError) throw relationError;
      }

      toast({
        title: "Success",
        description: `eBook uploaded successfully${bypassModeration ? ' and approved' : ''}!`,
      });

      // Reset form
      setTitle("");
      setAuthor("");
      setDescription("");
      setCategories([]);
      setFile(null);
      setCoverImage(null);
      setSelectedUploader("");
      setBypassModeration(true);
      setIsFeatured(false);
      setChapters(0);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Admin eBook Upload
        </CardTitle>
        <CardDescription>
          Upload eBooks with admin privileges. You can bypass moderation and set featured status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAdminUpload} className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategorySelect
              selectedCategories={categories}
              onCategoriesChange={setCategories}
              required
            />
            
            <div className="space-y-2">
              <Label htmlFor="chapters">Number of Chapters</Label>
              <Input
                id="chapters"
                type="number"
                min="0"
                value={chapters}
                onChange={(e) => setChapters(parseInt(e.target.value) || 0)}
                placeholder="Enter chapter count"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="uploader">Uploader (Optional)</Label>
            <Select value={selectedUploader} onValueChange={setSelectedUploader}>
              <SelectTrigger>
                <SelectValue placeholder="Select uploader (defaults to current admin)" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name || user.email} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium text-sm">Admin Options</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bypassModeration"
                checked={bypassModeration}
                onCheckedChange={(checked) => setBypassModeration(checked as boolean)}
              />
              <Label htmlFor="bypassModeration" className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4" />
                Bypass moderation (approve immediately)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFeatured"
                checked={isFeatured}
                onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
              />
              <Label htmlFor="isFeatured" className="flex items-center gap-2 text-sm">
                <Crown className="h-4 w-4" />
                Mark as featured
              </Label>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Upload eBook
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminEbookUpload;