import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAdminData } from "@/hooks/useAdminData";
import { useEbooks } from "@/hooks/useEbooks";
import { Bell, BellOff, Users, BookOpen, Flag, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'new_user' | 'new_ebook' | 'content_flagged' | 'ebook_approved';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const { toast } = useToast();
  const { useProfiles } = useAdminData();
  const { useGetEbooks } = useEbooks();

  const { data: profiles = [] } = useProfiles();
  const { data: ebooks = [] } = useGetEbooks();

  // Real-time notification system
  useEffect(() => {
    if (!isEnabled) return;

    // Listen for new users
    const profilesChannel = supabase
      .channel('notifications-profiles')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          const newUser = payload.new as any;
          const notification: Notification = {
            id: `user-${newUser.id}-${Date.now()}`,
            type: 'new_user',
            title: 'New User Registration',
            message: `${newUser.full_name || newUser.email} just registered`,
            timestamp: new Date(),
            read: false,
            data: newUser,
          };
          
          setNotifications(prev => [notification, ...prev]);
          
          toast({
            title: "New User Registered",
            description: notification.message,
          });
        }
      )
      .subscribe();

    // Listen for new ebooks
    const ebooksChannel = supabase
      .channel('notifications-ebooks')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ebooks',
        },
        (payload) => {
          const newEbook = payload.new as any;
          const notification: Notification = {
            id: `ebook-${newEbook.id}-${Date.now()}`,
            type: 'new_ebook',
            title: 'New eBook Upload',
            message: `"${newEbook.title}" by ${newEbook.author} needs review`,
            timestamp: new Date(),
            read: false,
            data: newEbook,
          };
          
          setNotifications(prev => [notification, ...prev]);
          
          toast({
            title: "New eBook Uploaded",
            description: notification.message,
          });
        }
      )
      .subscribe();

    // Listen for ebook status changes
    const ebookUpdatesChannel = supabase
      .channel('notifications-ebook-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ebooks',
        },
        (payload) => {
          const updatedEbook = payload.new as any;
          const oldEbook = payload.old as any;
          
          if (oldEbook.status !== updatedEbook.status && updatedEbook.status === 'approved') {
            const notification: Notification = {
              id: `ebook-approved-${updatedEbook.id}-${Date.now()}`,
              type: 'ebook_approved',
              title: 'eBook Approved',
              message: `"${updatedEbook.title}" has been approved and is now live`,
              timestamp: new Date(),
              read: false,
              data: updatedEbook,
            };
            
            setNotifications(prev => [notification, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(ebooksChannel);
      supabase.removeChannel(ebookUpdatesChannel);
    };
  }, [isEnabled, toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_user':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'new_ebook':
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'content_flagged':
        return <Flag className="h-4 w-4 text-red-500" />;
      case 'ebook_approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              {isEnabled ? (
                <Bell className="h-5 w-5" />
              ) : (
                <BellOff className="h-5 w-5" />
              )}
              Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEnabled(!isEnabled)}
          >
            {isEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            Clear All
          </Button>
        </div>
        
        <ScrollArea className="h-80">
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    notification.read 
                      ? 'bg-muted/20 opacity-75' 
                      : 'bg-background hover:bg-muted/50'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AdminNotifications;