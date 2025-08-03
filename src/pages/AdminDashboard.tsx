
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
import AdminFlags from "@/pages/AdminFlags";
import SettingsPage from "@/pages/Settings";
import { BarChart, Bell, Users, Zap, Activity, Tags, FileText, Upload, Flag, Settings } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive platform management and analytics.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="bulk-actions" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Bulk Actions
            </TabsTrigger>
            <TabsTrigger value="presence" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Admin Presence
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Live Activity
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="blogs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Manage Blogs
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload eBook
            </TabsTrigger>
            <TabsTrigger value="flags" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Flags
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="flex justify-center">
              <AdminNotifications />
            </div>
          </TabsContent>

          <TabsContent value="bulk-actions" className="space-y-6">
            <AdminBulkActions />
          </TabsContent>

          <TabsContent value="presence" className="space-y-6">
            <AdminPresence />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Live Activity Feed</h3>
              <p className="text-muted-foreground">
                Real-time activity monitoring coming soon...
              </p>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            <AdminBlogs />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <AdminEbookUpload />
          </TabsContent>

          <TabsContent value="flags" className="space-y-6">
            <AdminFlags />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsPage />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
