
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminNotifications from "@/components/admin/AdminNotifications";
import AdminBulkActions from "@/components/admin/AdminBulkActions";
import AdminPresence from "@/components/admin/AdminPresence";
import CategoryManagement from "@/components/admin/CategoryManagement";
import AdminBlogs from "@/pages/AdminBlogs";
import AdminEbookUpload from "@/components/admin/AdminEbookUpload";
import { BarChart, Bell, Users, Zap, Activity, Tags, FileText, Upload } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Comprehensive platform management and analytics.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid w-max min-w-full grid-cols-4 lg:grid-cols-8 gap-1">
              <TabsTrigger value="analytics" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm px-2 lg:px-3">
                <BarChart className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm px-2 lg:px-3">
                <Bell className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="bulk-actions" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm px-2 lg:px-3">
                <Zap className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Bulk Actions</span>
              </TabsTrigger>
              <TabsTrigger value="presence" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm px-2 lg:px-3">
                <Users className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Presence</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm px-2 lg:px-3">
                <Activity className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm px-2 lg:px-3">
                <Tags className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Categories</span>
              </TabsTrigger>
              <TabsTrigger value="blogs" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm px-2 lg:px-3">
                <FileText className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Blogs</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm px-2 lg:px-3">
                <Upload className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Upload</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics" className="space-y-4 lg:space-y-6">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 lg:space-y-6">
            <div className="flex justify-center">
              <AdminNotifications />
            </div>
          </TabsContent>

          <TabsContent value="bulk-actions" className="space-y-4 lg:space-y-6">
            <AdminBulkActions />
          </TabsContent>

          <TabsContent value="presence" className="space-y-4 lg:space-y-6">
            <AdminPresence />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 lg:space-y-6">
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Live Activity Feed</h3>
              <p className="text-muted-foreground">
                Real-time activity monitoring coming soon...
              </p>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4 lg:space-y-6">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="blogs" className="space-y-4 lg:space-y-6">
            <AdminBlogs />
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 lg:space-y-6">
            <AdminEbookUpload />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
