import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminData } from "@/hooks/useAdminData";
import { Users, Circle, Activity } from "lucide-react";

interface OnlineAdmin {
  user_id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  online_at: string;
  status: 'online' | 'away' | 'busy';
}

interface RecentActivity {
  id: string;
  admin_name: string;
  action: string;
  target: string;
  timestamp: Date;
}

const AdminPresence = () => {
  const [onlineAdmins, setOnlineAdmins] = useState<OnlineAdmin[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const { user, profile } = useAuth();
  const { useAdminActions } = useAdminData();
  
  const { data: adminActions = [] } = useAdminActions();

  // Track admin presence
  useEffect(() => {
    if (!user || !profile?.role || profile.role !== 'admin') return;

    const channel = supabase.channel('admin-presence');

    // Track current user presence
    const userStatus = {
      user_id: user.id,
      full_name: profile.full_name,
      email: profile.email,
      avatar_url: profile.avatar_url,
      online_at: new Date().toISOString(),
      status: 'online' as const,
    };

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const admins: OnlineAdmin[] = [];
        
        Object.keys(presenceState).forEach(userId => {
          const presenceArray = presenceState[userId];
          if (presenceArray && presenceArray.length > 0) {
            const presence = presenceArray[0] as any;
            if (presence.user_id) {
              admins.push(presence as OnlineAdmin);
            }
          }
        });
        
        setOnlineAdmins(admins);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('Admin joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('Admin left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(userStatus);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  // Generate recent activity from admin actions
  useEffect(() => {
    const activities: RecentActivity[] = adminActions
      .slice(0, 10)
      .map(action => ({
        id: action.id,
        admin_name: action.admin?.full_name || action.admin?.email || 'Unknown Admin',
        action: formatActionType(action.action_type),
        target: formatTargetType(action.target_type, action.details),
        timestamp: new Date(action.created_at),
      }));
    
    setRecentActivity(activities);
  }, [adminActions]);

  const formatActionType = (actionType: string) => {
    switch (actionType) {
      case 'update':
        return 'updated';
      case 'delete':
        return 'deleted';
      case 'create':
        return 'created';
      case 'approve':
        return 'approved';
      case 'reject':
        return 'rejected';
      default:
        return actionType;
    }
  };

  const formatTargetType = (targetType: string, details: any) => {
    const typeMap: { [key: string]: string } = {
      'profile': 'user profile',
      'ebook': 'eBook',
      'blog': 'blog post',
      'category': 'category',
    };
    
    const formattedType = typeMap[targetType] || targetType;
    
    if (details?.title) {
      return `${formattedType} "${details.title}"`;
    }
    if (details?.full_name) {
      return `${formattedType} for "${details.full_name}"`;
    }
    if (details?.name) {
      return `${formattedType} "${details.name}"`;
    }
    
    return formattedType;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Online Admins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Online Admins ({onlineAdmins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {onlineAdmins.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No admins online
                </div>
              ) : (
                onlineAdmins.map((admin) => (
                  <div key={admin.user_id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={admin.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(admin.full_name, admin.email)}
                        </AvatarFallback>
                      </Avatar>
                      <Circle 
                        className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(admin.status)} rounded-full border-2 border-background`}
                        fill="currentColor"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {admin.full_name || admin.email}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Online since {new Date(admin.online_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {admin.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Admin Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Admin Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="border-l-2 border-muted pl-3 pb-3">
                    <div className="text-sm">
                      <span className="font-medium">{activity.admin_name}</span>
                      {' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                      {' '}
                      <span className="font-medium">{activity.target}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPresence;