import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string | null;
  category: string;
  uploaded_by: string;
  file_url: string | null;
  cover_image: string | null;
  file_size: number | null;
  chapters: number;
  status: string;
  downloads: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  uploader?: {
    id: string;
    full_name: string | null;
    email: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useEbooks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useGetEbooks = (status?: string) => {
    return useQuery({
      queryKey: ["ebooks", status],
      queryFn: async () => {
        let query = supabase
          .from("ebooks")
          .select(`
            *,
            uploader:profiles(id, full_name, email)
          `)
          .order("created_at", { ascending: false });

        if (status) {
          query = query.eq("status", status);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as Ebook[];
      },
    });
  };

  const useGetCategories = () => {
    return useQuery({
      queryKey: ["categories"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");
        
        if (error) throw error;
        return data as Category[];
      },
    });
  };

  const useCreateCategory = () => {
    return useMutation({
      mutationFn: async ({
        name,
        description,
      }: {
        name: string;
        description?: string;
      }) => {
        const { data, error } = await supabase
          .from("categories")
          .insert({
            name,
            description,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const useUpdateCategory = () => {
    return useMutation({
      mutationFn: async ({ 
        id, 
        updates 
      }: { 
        id: string; 
        updates: Partial<Category> 
      }) => {
        const { data, error } = await supabase
          .from("categories")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const useDeleteCategory = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", id);

        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const useUploadEbook = () => {
    return useMutation({
      mutationFn: async ({
        title,
        author,
        description,
        categories,
        file,
        coverImage,
      }: {
        title: string;
        author: string;
        description?: string;
        categories: string[];
        file: File;
        coverImage?: File;
      }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Upload file
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: fileError } = await supabase.storage
          .from("ebooks")
          .upload(fileName, file);

        if (fileError) throw fileError;

        // Upload cover image if provided
        let coverImagePath = null;
        if (coverImage) {
          const coverExt = coverImage.name.split('.').pop();
          const coverFileName = `${user.id}/${Date.now()}_cover.${coverExt}`;
          
          const { error: coverError } = await supabase.storage
            .from("covers")
            .upload(coverFileName, coverImage);

          if (coverError) throw coverError;
          coverImagePath = `https://jhrecjjibycsyzgmfnvp.supabase.co/storage/v1/object/public/covers/${coverFileName}`;
        }

        // Create ebook record with first category as main category
        const { data, error } = await supabase
          .from("ebooks")
          .insert({
            title,
            author,
            description,
            category: categories[0], // Use first category as main category
            uploaded_by: user.id,
            file_url: `https://jhrecjjibycsyzgmfnvp.supabase.co/storage/v1/object/public/ebooks/${fileName}`,
            cover_image: coverImagePath,
            file_size: file.size,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ebooks"] });
        toast({
          title: "Success",
          description: "eBook uploaded successfully! It will be reviewed by admins.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const useUpdateEbook = () => {
    return useMutation({
      mutationFn: async ({ id, updates }: { id: string; updates: Partial<Ebook> }) => {
        const { data, error } = await supabase
          .from("ebooks")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ebooks"] });
        toast({
          title: "Success",
          description: "eBook updated successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const useDeleteEbook = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase
          .from("ebooks")
          .delete()
          .eq("id", id);

        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ebooks"] });
        toast({
          title: "Success",
          description: "eBook deleted successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const useDownloadEbook = () => {
    return useMutation({
      mutationFn: async (ebookId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        await supabase.rpc("increment_download_count", {
          ebook_uuid: ebookId,
          user_uuid: user.id,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ebooks"] });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return {
    useGetEbooks,
    useGetCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
    useUploadEbook,
    useUpdateEbook,
    useDeleteEbook,
    useDownloadEbook,
  };
};
