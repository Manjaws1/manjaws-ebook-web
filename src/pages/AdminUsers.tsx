
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
import {
  Edit,
  Trash2,
  Search,
  UserCircle,
  Shield,
  User,
} from "lucide-react";
import { useAdminData, type Profile } from "@/hooks/useAdminData";

const SUPER_ADMIN_EMAIL = "gbenlekamolideen@gmail.com";

const AdminUsers: React.FC = () => {
  const { useProfiles, useUpdateProfile, useDeleteProfile } = useAdminData();
  const { data: profiles = [], isLoading } = useProfiles();
  const updateProfileMutation = useUpdateProfile();
  const deleteProfileMutation = useDeleteProfile();

  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditProfile = () => {
    if (!editingProfile) return;
    const updates: Partial<Profile> = {
      full_name: editingProfile.full_name,
    };
    if (editingProfile.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      updates.role = editingProfile.role;
    }
    updateProfileMutation.mutate({
      id: editingProfile.id,
      updates,
    });
    setIsEditDialogOpen(false);
    setEditingProfile(null);
  };

  const handleDeleteProfile = (profileId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteProfileMutation.mutate(profileId);
    }
  };

  const openEditDialog = (profile: Profile) => {
    setEditingProfile({ ...profile });
    setIsEditDialogOpen(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case "moderator":
        return <UserCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">Loading users...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-3 lg:p-4 xl:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <UserCircle className="h-8 w-8 text-muted-foreground mr-3" />
                      <span className="font-medium">{profile.full_name || "No name"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getRoleIcon(profile.role)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        profile.role === 'admin' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                          : profile.role === 'moderator'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {profile.role}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(profile)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>
            {editingProfile && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingProfile.full_name || ""}
                    onChange={(e) => setEditingProfile({ ...editingProfile, full_name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">Email</Label>
                  <Input
                    id="edit-email"
                    value={editingProfile.email}
                    disabled
                    className="col-span-3 bg-muted"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">Role</Label>
                  <select
                    id="edit-role"
                    value={editingProfile.role}
                    onChange={(e) => setEditingProfile({ ...editingProfile, role: e.target.value })}
                    className="col-span-3 px-3 py-2 border border-input rounded-md bg-background"
                    disabled={editingProfile.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()}
                    title={editingProfile.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ? "You cannot change the role of the Super Admin" : undefined}
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleEditProfile} disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? "Updating..." : "Update User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
