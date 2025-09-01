import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Flag, Eye, X, Trash } from "lucide-react";
import { useState } from "react";

interface FlaggedEbook {
  id: string;
  ebook_id: string;
  reason: string;
  description: string;
  status: string;
  created_at: string;
  admin_notes: string;
  ebook: {
    title: string;
    author: string;
  };
  reporter: {
    full_name: string;
    email: string;
  };
}

const AdminFlags: React.FC = () => {
  const [selectedFlag, setSelectedFlag] = useState<FlaggedEbook | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const queryClient = useQueryClient();

  const { data: flags, isLoading } = useQuery({
    queryKey: ["admin-flags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flags")
        .select(`
          *,
          ebook:ebooks(title, author),
          reporter:profiles(full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });

  const updateFlagMutation = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes?: string }) => {
      const { error } = await supabase
        .from("flags")
        .update({ 
          status, 
          admin_notes,
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-flags"] });
      toast({
        title: "Flag updated",
        description: "The flag status has been updated successfully.",
      });
      setSelectedFlag(null);
      setAdminNotes("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update flag status.",
        variant: "destructive",
      });
    },
  });

  const deleteEbookMutation = useMutation({
    mutationFn: async (ebookId: string) => {
      const { error } = await supabase
        .from("ebooks")
        .delete()
        .eq("id", ebookId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-flags"] });
      toast({
        title: "eBook deleted",
        description: "The flagged eBook has been deleted successfully.",
      });
      setSelectedFlag(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete eBook.",
        variant: "destructive",
      });
    },
  });

  const handleReview = (flag: FlaggedEbook) => {
    setSelectedFlag(flag);
    setAdminNotes(flag.admin_notes || "");
  };

  const handleIgnore = (flagId: string) => {
    updateFlagMutation.mutate({ id: flagId, status: "ignored" });
  };

  const handleDeleteEbook = (flag: FlaggedEbook) => {
    if (confirm("Are you sure you want to delete this eBook? This action cannot be undone.")) {
      deleteEbookMutation.mutate(flag.ebook_id);
      updateFlagMutation.mutate({ id: flag.id, status: "resolved" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "reviewed":
        return <Badge variant="secondary">Reviewed</Badge>;
      case "ignored":
        return <Badge variant="destructive">Ignored</Badge>;
      case "resolved":
        return <Badge>Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-3 lg:p-4 xl:p-6 space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Flagged eBooks</h1>
        <p className="text-muted-foreground">
          Review and manage reported eBooks from users.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Reported Content
          </CardTitle>
          <CardDescription>
            {flags?.length || 0} total flags ({flags?.filter(f => f.status === "pending").length || 0} pending)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {flags && flags.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>eBook</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flags.map((flag) => (
                  <TableRow key={flag.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{flag.ebook.title}</div>
                        <div className="text-sm text-muted-foreground">
                          by {flag.ebook.author}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{flag.reason}</div>
                        {flag.description && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {flag.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{flag.reporter.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {flag.reporter.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(flag.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(flag.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReview(flag)}
                          disabled={updateFlagMutation.isPending}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {flag.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleIgnore(flag.id)}
                              disabled={updateFlagMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteEbook(flag)}
                              disabled={deleteEbookMutation.isPending}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Flag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No flags found</h3>
              <p className="text-muted-foreground">
                No eBooks have been reported yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedFlag} onOpenChange={() => setSelectedFlag(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Flag</DialogTitle>
          </DialogHeader>
          {selectedFlag && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">eBook Details</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedFlag.ebook.title} by {selectedFlag.ebook.author}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Reason for Report</h4>
                <p className="text-sm text-muted-foreground">{selectedFlag.reason}</p>
              </div>
              {selectedFlag.description && (
                <div>
                  <h4 className="font-medium">Additional Details</h4>
                  <p className="text-sm text-muted-foreground">{selectedFlag.description}</p>
                </div>
              )}
              <div>
                <h4 className="font-medium">Admin Notes</h4>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about your review..."
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => updateFlagMutation.mutate({ 
                    id: selectedFlag.id, 
                    status: "reviewed",
                    admin_notes: adminNotes
                  })}
                  disabled={updateFlagMutation.isPending}
                >
                  Mark as Reviewed
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateFlagMutation.mutate({ 
                    id: selectedFlag.id, 
                    status: "ignored",
                    admin_notes: adminNotes
                  })}
                  disabled={updateFlagMutation.isPending}
                >
                  Ignore Flag
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteEbook(selectedFlag)}
                  disabled={deleteEbookMutation.isPending}
                >
                  Delete eBook
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminFlags;