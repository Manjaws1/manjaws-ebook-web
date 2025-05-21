
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Upload, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  author: z.string().min(2, { message: "Author name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  chapters: z.coerce.number().int().min(1, { message: "Book must have at least 1 chapter." }),
  coverImage: z.instanceof(FileList).refine(files => files.length === 1, {
    message: "Cover image is required.",
  }),
  document: z.instanceof(FileList).refine(files => files.length === 1, {
    message: "Document file is required.",
  }).refine(
    files => {
      const file = files[0];
      return file && (file.type === "application/pdf" || file.type === "application/epub+zip");
    },
    {
      message: "Only PDF or EPUB files are accepted.",
    }
  )
});

type FormValues = z.infer<typeof formSchema>;

const UploadPage = () => {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      chapters: 1,
    },
  });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // This would typically be an API call to upload files and save book data
      console.log("Form data:", data);
      
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success!",
        description: "Your eBook has been successfully uploaded.",
      });
      
      form.reset();
      setCoverPreview(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem uploading your eBook.",
      });
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="container max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Upload Your eBook</h1>
            <p className="text-gray-600">Share your knowledge with the Manjaws community</p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Book Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the title of your book" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the author's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="chapters"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Chapters *</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <FormLabel>Cover Image *</FormLabel>
                          <FormControl>
                            <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              {coverPreview ? (
                                <div className="relative w-full h-40 mb-4">
                                  <img
                                    src={coverPreview}
                                    alt="Cover preview"
                                    className="h-full max-h-40 mx-auto object-contain"
                                  />
                                  <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="sm" 
                                    className="absolute top-0 right-0"
                                    onClick={() => {
                                      setCoverPreview(null);
                                      form.setValue("coverImage", undefined as any);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="p-4">
                                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                  <p className="mt-2 text-sm text-gray-600">Click or drag to upload cover image</p>
                                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                </div>
                              )}
                              <Input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="cover-upload"
                                {...field}
                                onChange={(e) => {
                                  onChange(e.target.files);
                                  handleCoverChange(e);
                                }}
                              />
                              <label 
                                htmlFor="cover-upload" 
                                className="w-full cursor-pointer"
                              >
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  className="w-full mt-2"
                                >
                                  Select Image
                                </Button>
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="document"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <FormLabel>eBook File *</FormLabel>
                          <FormControl>
                            <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              <div className="p-4">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">Upload your eBook file</p>
                                <p className="text-xs text-gray-500">PDF or EPUB format only</p>
                              </div>
                              <Input
                                type="file"
                                accept=".pdf,.epub"
                                className="hidden"
                                id="document-upload"
                                {...field}
                                onChange={(e) => {
                                  onChange(e.target.files);
                                }}
                              />
                              <label 
                                htmlFor="document-upload" 
                                className="w-full cursor-pointer"
                              >
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  className="w-full mt-2"
                                >
                                  Select File
                                </Button>
                              </label>
                              {form.watch("document") && form.watch("document")[0] && (
                                <p className="mt-2 text-sm text-green-600">
                                  Selected: {form.watch("document")[0].name}
                                </p>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a brief description of your eBook" 
                          className="resize-none" 
                          rows={4} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto bg-primary hover:bg-primary-700" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Uploading..." : "Upload eBook"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadPage;
