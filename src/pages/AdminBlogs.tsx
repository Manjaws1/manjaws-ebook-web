
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  CheckCircle,
  Clock,
  Archive,
} from "lucide-react";
import { useAdminData, type Blog } from "@/hooks/useAdminData";
import { useAuth } from "@/contexts/AuthContext";

const AdminBlogs: React.FC = () => {
  const { useBlogs, useUpdateBlog, useDeleteBlog, useCreateBlog } = useAdminData();
  const { user } = useAuth();
  const { data: blogs = [], isLoading } = useBlogs();
  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();
  const createBlogMutation = useCreateBlog();

  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    status: "draft",
    author_id: "",
    featured_image: null,
  });
  const [uploading, setUploading] = useState(false);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditBlog = () => {
    if (!editingBlog) return;
    updateBlogMutation.mutate({
      id: editingBlog.id,
      updates: {
        title: editingBlog.title,
        content: editingBlog.content,
        excerpt: editingBlog.excerpt,
        category: editingBlog.category,
        status: editingBlog.status,
        featured_image: editingBlog.featured_image,
      },
    });
    setIsEditDialogOpen(false);
    setEditingBlog(null);
  };

  const handleCreateBlog = () => {
    if (!user) return;
    createBlogMutation.mutate({
      ...newBlog,
      author_id: user.id,
      featured_image: newBlog.featured_image,
    });
    setIsCreateDialogOpen(false);
    setNewBlog({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      status: "draft",
      author_id: "",
      featured_image: null,
    });
  };

  const handleDeleteBlog = (blogId: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      deleteBlogMutation.mutate(blogId);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      if (isEdit && editingBlog) {
        setEditingBlog({ ...editingBlog, featured_image: data.publicUrl });
      } else {
        setNewBlog({ ...newBlog, featured_image: data.publicUrl });
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const openEditDialog = (blog: Blog) => {
    setEditingBlog({ ...blog });
    setIsEditDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "draft":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "archived":
        return <Archive className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-3 lg:p-4 xl:p-6">
          <div className="text-center">Loading blogs...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-3 lg:p-4 xl:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Blog
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Blogs Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>{blog.author?.full_name || blog.author?.email}</TableCell>
                  <TableCell>{blog.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(blog.status)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.status === 'published' 
                          ? 'bg-green-100 text-green-800'
                          : blog.status === 'draft'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {blog.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(blog.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(blog)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Blog Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Blog</DialogTitle>
              <DialogDescription>
                Update blog information and content.
              </DialogDescription>
            </DialogHeader>
            {editingBlog && (
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">Category</Label>
                  <Input
                    id="edit-category"
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">Status</Label>
                  <select
                    id="edit-status"
                    value={editingBlog.status}
                    onChange={(e) => setEditingBlog({ ...editingBlog, status: e.target.value })}
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-excerpt" className="text-right">Excerpt</Label>
                  <Textarea
                    id="edit-excerpt"
                    value={editingBlog.excerpt || ""}
                    onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-featured-image" className="text-right">Featured Image</Label>
                  <div className="col-span-3">
                    <Input
                      id="edit-featured-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      disabled={uploading}
                    />
                    {editingBlog.featured_image && (
                      <img
                        src={editingBlog.featured_image}
                        alt="Featured"
                        className="mt-2 w-32 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-content" className="text-right">Content</Label>
                  <Textarea
                    id="edit-content"
                    value={editingBlog.content}
                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    className="col-span-3"
                    rows={8}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleEditBlog} disabled={updateBlogMutation.isPending}>
                {updateBlogMutation.isPending ? "Updating..." : "Update Blog"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Blog Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Blog</DialogTitle>
              <DialogDescription>
                Create a new blog post.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-title" className="text-right">Title</Label>
                <Input
                  id="create-title"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-category" className="text-right">Category</Label>
                <Input
                  id="create-category"
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-status" className="text-right">Status</Label>
                <select
                  id="create-status"
                  value={newBlog.status}
                  onChange={(e) => setNewBlog({ ...newBlog, status: e.target.value })}
                  className="col-span-3 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-excerpt" className="text-right">Excerpt</Label>
                <Textarea
                  id="create-excerpt"
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-featured-image" className="text-right">Featured Image</Label>
                <div className="col-span-3">
                  <Input
                    id="create-featured-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    disabled={uploading}
                  />
                  {newBlog.featured_image && (
                    <img
                      src={newBlog.featured_image}
                      alt="Featured"
                      className="mt-2 w-32 h-20 object-cover rounded"
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-content" className="text-right">Content</Label>
                <Textarea
                  id="create-content"
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  className="col-span-3"
                  rows={8}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateBlog} disabled={createBlogMutation.isPending}>
                {createBlogMutation.isPending ? "Creating..." : "Create Blog"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogs;
