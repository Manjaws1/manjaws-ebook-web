
import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import {
  Users,
  BookOpen,
  Flag,
  BarChart,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

// Mock ebook data
const initialEbooks = [
  {
    id: 1,
    title: "Machine Learning for Beginners",
    author: "Dr. Sarah Thompson",
    category: "Technology",
    uploadDate: "2024-01-15",
    status: "Approved",
    downloads: 342,
    chapters: 12,
    description: "A comprehensive guide to machine learning concepts.",
  },
  {
    id: 2,
    title: "Web Development with React",
    author: "John Miller",
    category: "Programming",
    uploadDate: "2024-02-20",
    status: "Pending",
    downloads: 156,
    chapters: 8,
    description: "Learn modern web development with React.",
  },
  {
    id: 3,
    title: "Cloud Computing Fundamentals",
    author: "Michael Chen",
    category: "Technology",
    uploadDate: "2024-03-10",
    status: "Approved",
    downloads: 289,
    chapters: 15,
    description: "Understanding cloud computing basics.",
  },
  {
    id: 4,
    title: "Unauthorized Content Example",
    author: "Unknown Author",
    category: "Programming",
    uploadDate: "2024-03-15",
    status: "Flagged",
    downloads: 12,
    chapters: 5,
    description: "This content has been flagged for review.",
  },
];

const AdminEbooks: React.FC = () => {
  const [ebooks, setEbooks] = useState(initialEbooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEbook, setEditingEbook] = useState<any>(null);
  const [newEbook, setNewEbook] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    chapters: 0,
    status: "Pending",
  });

  const filteredEbooks = ebooks.filter(
    (ebook) =>
      ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEbook = () => {
    const ebook = {
      id: Math.max(...ebooks.map(e => e.id)) + 1,
      ...newEbook,
      uploadDate: new Date().toISOString().split('T')[0],
      downloads: 0,
    };
    setEbooks([...ebooks, ebook]);
    setNewEbook({ title: "", author: "", category: "", description: "", chapters: 0, status: "Pending" });
    setIsCreateDialogOpen(false);
  };

  const handleEditEbook = () => {
    setEbooks(ebooks.map(ebook => 
      ebook.id === editingEbook.id ? editingEbook : ebook
    ));
    setIsEditDialogOpen(false);
    setEditingEbook(null);
  };

  const handleDeleteEbook = (ebookId: number) => {
    if (confirm("Are you sure you want to delete this eBook?")) {
      setEbooks(ebooks.filter(ebook => ebook.id !== ebookId));
    }
  };

  const openEditDialog = (ebook: any) => {
    setEditingEbook({ ...ebook });
    setIsEditDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "Flagged":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-primary text-white fixed inset-y-0 left-0 z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-primary-800">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">Manjaws</span>
            <span className="text-secondary ml-1">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-grow p-4">
          <ul className="space-y-1">
            <li>
              <Link
                to="/admin"
                className="flex items-center px-4 py-3 rounded-md hover:bg-primary-700 text-gray-200 hover:text-white"
              >
                <BarChart className="mr-3 h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center px-4 py-3 rounded-md hover:bg-primary-700 text-gray-200 hover:text-white"
              >
                <Users className="mr-3 h-5 w-5" />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/ebooks"
                className="flex items-center px-4 py-3 rounded-md bg-primary-800 text-white"
              >
                <BookOpen className="mr-3 h-5 w-5" />
                <span>eBooks</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/flags"
                className="flex items-center px-4 py-3 rounded-md hover:bg-primary-700 text-gray-200 hover:text-white"
              >
                <Flag className="mr-3 h-5 w-5" />
                <span>Flags</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reports"
                className="flex items-center px-4 py-3 rounded-md hover:bg-primary-700 text-gray-200 hover:text-white"
              >
                <BarChart className="mr-3 h-5 w-5" />
                <span>Reports</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className="flex items-center px-4 py-3 rounded-md hover:bg-primary-700 text-gray-200 hover:text-white"
              >
                <Settings className="mr-3 h-5 w-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-primary-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-200 hover:text-white hover:bg-primary-700"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">eBook Management</h1>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New eBook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New eBook</DialogTitle>
                  <DialogDescription>
                    Add a new eBook to the library.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input
                      id="title"
                      value={newEbook.title}
                      onChange={(e) => setNewEbook({ ...newEbook, title: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="author" className="text-right">Author</Label>
                    <Input
                      id="author"
                      value={newEbook.author}
                      onChange={(e) => setNewEbook({ ...newEbook, author: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                    <Input
                      id="category"
                      value={newEbook.category}
                      onChange={(e) => setNewEbook({ ...newEbook, category: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="chapters" className="text-right">Chapters</Label>
                    <Input
                      id="chapters"
                      type="number"
                      value={newEbook.chapters}
                      onChange={(e) => setNewEbook({ ...newEbook, chapters: parseInt(e.target.value) || 0 })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea
                      id="description"
                      value={newEbook.description}
                      onChange={(e) => setNewEbook({ ...newEbook, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateEbook}>Create eBook</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Chapters</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEbooks.map((ebook) => (
                  <TableRow key={ebook.id}>
                    <TableCell className="font-medium">{ebook.title}</TableCell>
                    <TableCell>{ebook.author}</TableCell>
                    <TableCell>{ebook.category}</TableCell>
                    <TableCell>{ebook.uploadDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(ebook.status)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ebook.status === 'Approved' 
                            ? 'bg-green-100 text-green-800'
                            : ebook.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {ebook.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{ebook.downloads}</TableCell>
                    <TableCell>{ebook.chapters}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                  Update eBook information.
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
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Flagged">Flagged</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-description" className="text-right">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editingEbook.description}
                      onChange={(e) => setEditingEbook({ ...editingEbook, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={handleEditEbook}>Update eBook</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default AdminEbooks;
