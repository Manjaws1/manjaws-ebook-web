import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAdminData } from "@/hooks/useAdminData";
import { useEbooks } from "@/hooks/useEbooks";
import { CheckCircle, XCircle, Trash2, Users, BookOpen, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminBulkActions = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedEbooks, setSelectedEbooks] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { toast } = useToast();
  const { useProfiles, useUpdateProfile, useDeleteProfile } = useAdminData();
  const { useGetEbooks, useGetCategories, useUpdateEbook, useDeleteEbook, useDeleteCategory } = useEbooks();

  const { data: profiles = [] } = useProfiles();
  const { data: ebooks = [] } = useGetEbooks();
  const { data: categories = [] } = useGetCategories();

  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();
  const updateEbook = useUpdateEbook();
  const deleteEbook = useDeleteEbook();
  const deleteCategory = useDeleteCategory();

  // Filter data
  const pendingEbooks = ebooks.filter(book => book.status === 'pending');
  const regularUsers = profiles.filter(profile => profile.role === 'user');

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(regularUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectAllEbooks = (checked: boolean) => {
    if (checked) {
      setSelectedEbooks(pendingEbooks.map(book => book.id));
    } else {
      setSelectedEbooks([]);
    }
  };

  const handleSelectAllCategories = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map(cat => cat.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleBulkApproveEbooks = async () => {
    if (selectedEbooks.length === 0) return;
    
    setIsProcessing(true);
    try {
      for (const bookId of selectedEbooks) {
        await updateEbook.mutateAsync({
          id: bookId,
          updates: { status: 'approved' }
        });
      }
      
      toast({
        title: "Success",
        description: `${selectedEbooks.length} eBooks approved successfully`,
      });
      
      setSelectedEbooks([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve some eBooks",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkRejectEbooks = async () => {
    if (selectedEbooks.length === 0) return;
    
    setIsProcessing(true);
    try {
      for (const bookId of selectedEbooks) {
        await updateEbook.mutateAsync({
          id: bookId,
          updates: { status: 'rejected' }
        });
      }
      
      toast({
        title: "Success",
        description: `${selectedEbooks.length} eBooks rejected successfully`,
      });
      
      setSelectedEbooks([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject some eBooks",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDeleteEbooks = async () => {
    if (selectedEbooks.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedEbooks.length} eBooks? This action cannot be undone.`)) {
      return;
    }
    
    setIsProcessing(true);
    try {
      for (const bookId of selectedEbooks) {
        await deleteEbook.mutateAsync(bookId);
      }
      
      toast({
        title: "Success",
        description: `${selectedEbooks.length} eBooks deleted successfully`,
      });
      
      setSelectedEbooks([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some eBooks",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDeleteUsers = async () => {
    if (selectedUsers.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
      return;
    }
    
    setIsProcessing(true);
    try {
      for (const userId of selectedUsers) {
        await deleteProfile.mutateAsync(userId);
      }
      
      toast({
        title: "Success",
        description: `${selectedUsers.length} users deleted successfully`,
      });
      
      setSelectedUsers([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some users",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDeleteCategories = async () => {
    if (selectedCategories.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedCategories.length} categories? This action cannot be undone.`)) {
      return;
    }
    
    setIsProcessing(true);
    try {
      for (const categoryId of selectedCategories) {
        await deleteCategory.mutateAsync(categoryId);
      }
      
      toast({
        title: "Success",
        description: `${selectedCategories.length} categories deleted successfully`,
      });
      
      setSelectedCategories([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some categories",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bulk Actions</h2>
        <p className="text-muted-foreground">
          Perform actions on multiple items at once.
        </p>
      </div>

      {/* Bulk eBook Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Pending eBooks ({pendingEbooks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all-ebooks"
                checked={selectedEbooks.length === pendingEbooks.length && pendingEbooks.length > 0}
                onCheckedChange={handleSelectAllEbooks}
              />
              <label htmlFor="select-all-ebooks" className="text-sm font-medium">
                Select All ({pendingEbooks.length})
              </label>
            </div>
            
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {pendingEbooks.map((book) => (
                <div key={book.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ebook-${book.id}`}
                    checked={selectedEbooks.includes(book.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEbooks(prev => [...prev, book.id]);
                      } else {
                        setSelectedEbooks(prev => prev.filter(id => id !== book.id));
                      }
                    }}
                  />
                  <label htmlFor={`ebook-${book.id}`} className="text-sm flex-1">
                    {book.title} by {book.author}
                  </label>
                  <Badge variant="outline">{book.status}</Badge>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleBulkApproveEbooks}
                disabled={selectedEbooks.length === 0 || isProcessing}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Selected ({selectedEbooks.length})
              </Button>
              <Button
                variant="outline"
                onClick={handleBulkRejectEbooks}
                disabled={selectedEbooks.length === 0 || isProcessing}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Selected
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDeleteEbooks}
                disabled={selectedEbooks.length === 0 || isProcessing}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk User Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({regularUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all-users"
                checked={selectedUsers.length === regularUsers.length && regularUsers.length > 0}
                onCheckedChange={handleSelectAllUsers}
              />
              <label htmlFor="select-all-users" className="text-sm font-medium">
                Select All ({regularUsers.length})
              </label>
            </div>
            
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {regularUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUsers(prev => [...prev, user.id]);
                      } else {
                        setSelectedUsers(prev => prev.filter(id => id !== user.id));
                      }
                    }}
                  />
                  <label htmlFor={`user-${user.id}`} className="text-sm flex-1">
                    {user.full_name || user.email}
                  </label>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="destructive"
                onClick={handleBulkDeleteUsers}
                disabled={selectedUsers.length === 0 || isProcessing}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedUsers.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Category Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all-categories"
                checked={selectedCategories.length === categories.length && categories.length > 0}
                onCheckedChange={handleSelectAllCategories}
              />
              <label htmlFor="select-all-categories" className="text-sm font-medium">
                Select All ({categories.length})
              </label>
            </div>
            
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories(prev => [...prev, category.id]);
                      } else {
                        setSelectedCategories(prev => prev.filter(id => id !== category.id));
                      }
                    }}
                  />
                  <label htmlFor={`category-${category.id}`} className="text-sm flex-1">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="destructive"
                onClick={handleBulkDeleteCategories}
                disabled={selectedCategories.length === 0 || isProcessing}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedCategories.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBulkActions;