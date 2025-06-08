
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Trash2,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
} from "lucide-react";
import { useAdminData, type Ebook } from "@/hooks/useAdminData";

const AdminEbooks: React.FC = () => {
  const { useEbooks, useUpdateEbook, useDeleteEbook } = useAdminData();
  const { data: ebooks = [], isLoading } = useEbooks();
  const updateEbookMutation = useUpdateEbook();
  const deleteEbookMutation = useDeleteEbook();

  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);

  const filteredEbooks = ebooks.filter(
    (ebook) =>
      ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditEbook = () => {
    if (!editingEbook) return;
    updateEbookMutation.mutate({
      id: editingEbook.id,
      updates: {
        title: editingEbook.title,
        author: editingEbook.author,
        description: editingEbook.description,
        category: editingEbook.category,
        chapters: editingEbook.chapters,
        status: editingEbook.status,
      },
    });
    setIsEditDialogOpen(false);
    setEditingEbook(null);
  };

  const handleDeleteEbook = (ebookId: string) => {
    if (confirm("Are you sure you want to delete this eBook?")) {
      deleteEbookMutation.mutate(ebookId);
    }
  };

  const openEditDialog = (ebook: Ebook) => {
    setEditingEbook({ ...ebook });
    setIsEditDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "flagged":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">Loading ebooks...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">eBook Management</h1>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search eBooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* eBooks Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploader</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEbooks.map((ebook) => (
                <TableRow key={ebook.id}>
                  <TableCell className="font-medium">{ebook.title}</TableCell>
                  <TableCell>{ebook.author}</TableCell>
                  <TableCell>{ebook.category}</TableCell>
                  <TableCell>{ebook.uploader?.full_name || ebook.uploader?.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(ebook.status)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ebook.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : ebook.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {ebook.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{ebook.downloads}</TableCell>
                  <TableCell>{new Date(ebook.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(ebook)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEbook(ebook.id)}
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

        {/* Edit eBook Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit eBook</DialogTitle>
              <DialogDescription>
                Update eBook information and approval status.
              </DialogDescription>
            </DialogHeader>
            {editingEbook && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingEbook.title}
                    onChange={(e) => setEditingEbook({ ...editingEbook, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-author" className="text-right">Author</Label>
                  <Input
                    id="edit-author"
                    value={editingEbook.author}
                    onChange={(e) => setEditingEbook({ ...editingEbook, author: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">Category</Label>
                  <Input
                    id="edit-category"
                    value={editingEbook.category}
                    onChange={(e) => setEditingEbook({ ...editingEbook, category: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-chapters" className="text-right">Chapters</Label>
                  <Input
                    id="edit-chapters"
                    type="number"
                    value={editingEbook.chapters}
                    onChange={(e) => setEditingEbook({ ...editingEbook, chapters: parseInt(e.target.value) || 0 })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">Status</Label>
                  <select
                    id="edit-status"
                    value={editingEbook.status}
                    onChange={(e) => setEditingEbook({ ...editingEbook, status: e.target.value })}
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingEbook.description || ""}
                    onChange={(e) => setEditingEbook({ ...editingEbook, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleEditEbook} disabled={updateEbookMutation.isPending}>
                {updateEbookMutation.isPending ? "Updating..." : "Update eBook"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminEbooks;
