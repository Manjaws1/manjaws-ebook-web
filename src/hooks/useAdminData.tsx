
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author_id: string;
  category: string;
  featured_image: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string | null;
  category: string;
  cover_image: string | null;
  file_url: string | null;
  chapters: number;
  downloads: number;
  status: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  uploader?: Profile;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  details: any;
  created_at: string;
  admin?: Profile;
}

export const useAdminData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Users/Profiles queries
  const useProfiles = () => {
    const query = useQuery({
      queryKey: ["admin-profiles"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data as Profile[];
      },
    });

    // Real-time subscription for profiles
    React.useEffect(() => {
      const channel = supabase
        .channel('admin-profiles-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, []);

    return query;
  };

  // Blogs queries
  const useBlogs = () => {
    const query = useQuery({
      queryKey: ["admin-blogs"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("blogs")
          .select(`
            *,
            author:profiles(*)
          `)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data as Blog[];
      },
    });

    // Real-time subscription for blogs
    React.useEffect(() => {
      const channel = supabase
        .channel('admin-blogs-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'blogs',
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, []);

    return query;
  };

  // Ebooks queries
  const useEbooks = () => {
    const query = useQuery({
      queryKey: ["admin-ebooks"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("ebooks")
          .select(`
            *,
            uploader:profiles(*)
          `)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data as Ebook[];
      },
    });

    // Real-time subscription for ebooks
    React.useEffect(() => {
      const channel = supabase
        .channel('admin-ebooks-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'ebooks',
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ["admin-ebooks"] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, []);

    return query;
  };

  // Admin Actions queries
  const useAdminActions = () => {
    const query = useQuery({
      queryKey: ["admin-actions"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("admin_actions")
          .select(`
            *,
            admin:profiles(*)
          `)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data as AdminAction[];
      },
    });

    // Real-time subscription for admin actions
    React.useEffect(() => {
      const channel = supabase
        .channel('admin-actions-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'admin_actions',
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ["admin-actions"] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, []);

    return query;
  };

  // Mutations
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: async ({ id, updates }: { id: string; updates: Partial<Profile> }) => {
        const { data, error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        
        if (error) throw error;
        
        // Log admin action with only serializable data
        const logDetails = {
          full_name: updates.full_name,
          role: updates.role,
          avatar_url: updates.avatar_url,
        };
        
        await supabase.rpc("log_admin_action", {
          action_type_param: "update",
          target_type_param: "profile",
          target_id_param: id,
          details_param: logDetails,
        });
        
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
        queryClient.invalidateQueries({ queryKey: ["admin-actions"] });
        toast({ title: "Success", description: "Profile updated successfully" });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const useDeleteProfile = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        
        // Log admin action
        await supabase.rpc("log_admin_action", {
          action_type_param: "delete",
          target_type_param: "profile",
          target_id_param: id,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
        queryClient.invalidateQueries({ queryKey: ["admin-actions"] });
        toast({ title: "Success", description: "Profile deleted successfully" });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const useUpdateBlog = () => {
    return useMutation({
      mutationFn: async ({ id, updates }: { id: string; updates: Partial<Blog> }) => {
        const { data, error } = await supabase
          .from("blogs")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        
        if (error) throw error;
        
        // Log admin action with only serializable data (exclude author object)
        const logDetails = {
          title: updates.title,
          content: updates.content,
          excerpt: updates.excerpt,
          category: updates.category,
          status: updates.status,
          featured_image: updates.featured_image,
        };
        
        await supabase.rpc("log_admin_action", {
          action_type_param: "update",
          target_type_param: "blog",
          target_id_param: id,
          details_param: logDetails,
        });
        
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
        queryClient.invalidateQueries({ queryKey: ["admin-actions"] });
        toast({ title: "Success", description: "Blog updated successfully" });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const useCreateBlog = () => {
    return useMutation({
      mutationFn: async (blog: Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'author'>) => {
        const { data, error } = await supabase
          .from("blogs")
          .insert([blog])
          .select()
          .single();
        
        if (error) throw error;
        
        // Log admin action
        await supabase.rpc("log_admin_action", {
          action_type_param: "create",
          target_type_param: "blog",
          target_id_param: data.id,
          details_param: {
            title: blog.title,
            category: blog.category,
            status: blog.status,
          },
        });
        
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
        queryClient.invalidateQueries({ queryKey: ["admin-actions"] });
        toast({ title: "Success", description: "Blog created successfully" });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  const useDeleteBlog = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase
          .from("blogs")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        
        // Log admin action
        await supabase.rpc("log_admin_action", {
          action_type_param: "delete",
          target_type_param: "blog",
          target_id_param: id,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
        queryClient.invalidateQueries({ queryKey: ["admin-actions"] });
        toast({ title: "Success", description: "Blog deleted successfully" });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
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
        
        // Log admin action with only serializable data (exclude uploader object)
        const logDetails = {
          title: updates.title,
          author: updates.author,
          description: updates.description,
          category: updates.category,
          chapters: updates.chapters,
          status: updates.status,
        };
        
        await supabase.rpc("log_admin_action", {
          action_type_param: "update",
          target_type_param: "ebook",
          target_id_param: id,
          details_param: logDetails,
        });
        
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-ebooks"] });
        queryClient.invalidateQueries({ queryKey: ["admin-actions"] });
        toast({ title: "Success", description: "eBook updated successfully" });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
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
        
        // Log admin action
        await supabase.rpc("log_admin_action", {
          action_type_param: "delete",
          target_type_param: "ebook",
          target_id_param: id,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-ebooks"] });
        queryClient.invalidateQueries({ queryKey: ["admin-actions"] });
        toast({ title: "Success", description: "eBook deleted successfully" });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  return {
    useProfiles,
    useBlogs,
    useEbooks,
    useAdminActions,
    useUpdateProfile,
    useDeleteProfile,
    useCreateBlog,
    useUpdateBlog,
    useDeleteBlog,
    useUpdateEbook,
    useDeleteEbook,
  };
};
