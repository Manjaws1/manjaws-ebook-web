
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminNotifications from "@/components/admin/AdminNotifications";
import AdminBulkActions from "@/components/admin/AdminBulkActions";
import AdminPresence from "@/components/admin/AdminPresence";
import { BarChart, Bell, Users, Zap, Activity } from "lucide-react";

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
          <TabsList className="grid w-full grid-cols-5">
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
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
