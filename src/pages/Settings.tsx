import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings, Lock, Mail, Shield, Bell } from "lucide-react";

interface NotificationPreferences {
  email_updates: boolean;
  new_ebooks: boolean;
  admin_announcements: boolean;
  [key: string]: boolean;
}

const SettingsPage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const location = useLocation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const queryClient = useQueryClient();
  
  // Check if we're in admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("notification_preferences, two_factor_enabled")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { notification_preferences?: NotificationPreferences; two_factor_enabled?: boolean }) => {
      if (!user?.id) throw new Error("No user found");
      
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      refreshProfile();
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Email update initiated",
        description: "Please check your new email for confirmation.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update email.",
        variant: "destructive",
      });
    },
  });

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate({ password: newPassword });
  };

  const handleEmailChange = () => {
    if (newEmail === user?.email) {
      toast({
        title: "Error",
        description: "New email is the same as current email.",
        variant: "destructive",
      });
      return;
    }

    updateEmailMutation.mutate({ email: newEmail });
  };

  const handleNotificationChange = (key: keyof NotificationPreferences, value: boolean) => {
    const currentPrefs = (userProfile?.notification_preferences as NotificationPreferences) || {
      email_updates: true,
      new_ebooks: true,
      admin_announcements: true,
    };

    const newPrefs = { ...currentPrefs, [key]: value };
    updateProfileMutation.mutate({ notification_preferences: newPrefs as any });
  };

  const handleTwoFactorToggle = (enabled: boolean) => {
    updateProfileMutation.mutate({ two_factor_enabled: enabled });
  };

  const notificationPrefs = (userProfile?.notification_preferences as NotificationPreferences) || {
    email_updates: true,
    new_ebooks: true,
    admin_announcements: true,
  };

  const settingsContent = (
    <div className={isAdminRoute ? "p-6 space-y-6" : "container mx-auto py-6 space-y-6"}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              <Button
                onClick={handlePasswordChange}
                disabled={!newPassword || !confirmPassword || changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Change Email
              </CardTitle>
              <CardDescription>
                Update your email address. You'll need to verify the new email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-email">Current Email</Label>
                <Input
                  id="current-email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">New Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                />
              </div>
              <Button
                onClick={handleEmailChange}
                disabled={!newEmail || newEmail === user?.email || updateEmailMutation.isPending}
              >
                {updateEmailMutation.isPending ? "Updating..." : "Update Email"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="2fa-toggle">Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code in addition to your password.
                  </p>
                </div>
                <Switch
                  id="2fa-toggle"
                  checked={userProfile?.two_factor_enabled || false}
                  onCheckedChange={handleTwoFactorToggle}
                  disabled={updateProfileMutation.isPending}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you'd like to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-updates">Email Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive general updates and announcements via email.
                  </p>
                </div>
                <Switch
                  id="email-updates"
                  checked={notificationPrefs.email_updates}
                  onCheckedChange={(checked) => handleNotificationChange("email_updates", checked)}
                  disabled={updateProfileMutation.isPending}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-ebooks">New eBook Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new eBooks are added to the library.
                  </p>
                </div>
                <Switch
                  id="new-ebooks"
                  checked={notificationPrefs.new_ebooks}
                  onCheckedChange={(checked) => handleNotificationChange("new_ebooks", checked)}
                  disabled={updateProfileMutation.isPending}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="admin-announcements">Admin Announcements</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important announcements from administrators.
                  </p>
                </div>
                <Switch
                  id="admin-announcements"
                  checked={notificationPrefs.admin_announcements}
                  onCheckedChange={(checked) => handleNotificationChange("admin_announcements", checked)}
                  disabled={updateProfileMutation.isPending}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isAdminRoute) {
    return (
      <AdminLayout>
        {settingsContent}
      </AdminLayout>
    );
  }

  return settingsContent;
};

export default SettingsPage;