
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Shield, User, BookOpen, PenTool } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

const AdminActions: React.FC = () => {
  const { useAdminActions } = useAdminData();
  const { data: actions = [], isLoading } = useAdminActions();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredActions = actions.filter(
    (action) =>
      action.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.target_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.admin?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case "profile":
        return <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "blog":
        return <PenTool className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "ebook":
        return <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionBadgeColor = (actionType: string) => {
    switch (actionType) {
      case "create":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "update":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "delete":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-3 lg:p-4 xl:p-6">
          <div className="text-center">Loading admin actions...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-3 lg:p-4 xl:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Action Log</h1>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Actions Table */}
        <div className="bg-card rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Target ID</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="font-medium">
                        {action.admin?.full_name || action.admin?.email || "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(action.action_type)}`}>
                      {action.action_type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getTargetIcon(action.target_type)}
                      <span className="ml-2 capitalize">{action.target_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {action.target_id.slice(0, 8)}...
                    </code>
                  </TableCell>
                  <TableCell>
                    {action.details ? (
                      <details className="cursor-pointer">
                        <summary className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          View Details
                        </summary>
                        <pre className="text-xs bg-muted p-2 mt-1 rounded overflow-auto max-w-xs">
                          {JSON.stringify(action.details, null, 2)}
                        </pre>
                      </details>
                    ) : (
                      <span className="text-muted-foreground">No details</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(action.created_at).toLocaleDateString()}
                      <div className="text-xs text-muted-foreground">
                        {new Date(action.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredActions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No admin actions found.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminActions;
