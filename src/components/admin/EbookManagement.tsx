
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Eye, Trash2, Clock } from "lucide-react";
import { useEbooks } from "@/hooks/useEbooks";

const EbookManagement = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { useGetEbooks, useUpdateEbook, useDeleteEbook } = useEbooks();
  
  const { data: ebooks = [], isLoading } = useGetEbooks();
  const updateMutation = useUpdateEbook();
  const deleteMutation = useDeleteEbook();

  const filteredEbooks = ebooks.filter(ebook => 
    statusFilter === "all" || ebook.status === statusFilter
  );

  const handleStatusUpdate = (id: string, status: string) => {
    updateMutation.mutate({ id, updates: { status } });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this ebook?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading ebooks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">eBook Management</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredEbooks.map((ebook) => (
          <Card key={ebook.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {ebook.title}
                    <Badge className={getStatusColor(ebook.status)}>
                      {ebook.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    by {ebook.author} • {ebook.category} • {ebook.downloads} downloads
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {ebook.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleStatusUpdate(ebook.id, "approved")}
                        disabled={updateMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleStatusUpdate(ebook.id, "rejected")}
                        disabled={updateMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {ebook.file_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(ebook.file_url!, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(ebook.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            {ebook.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{ebook.description}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Uploaded by: {ebook.uploader?.full_name || ebook.uploader?.email} • 
                  Created: {new Date(ebook.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredEbooks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No ebooks found with the selected filter.
        </div>
      )}
    </div>
  );
};

export default EbookManagement;
