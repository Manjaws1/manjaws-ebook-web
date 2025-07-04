import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminData } from "@/hooks/useAdminData";
import { useEbooks } from "@/hooks/useEbooks";
import { Users, BookOpen, Download, Clock, TrendingUp, TrendingDown } from "lucide-react";

const AdminAnalytics = () => {
  const { useProfiles, useBlogs } = useAdminData();
  const { useGetEbooks } = useEbooks();
  
  const { data: profiles = [] } = useProfiles();
  const { data: blogs = [] } = useBlogs();
  const { data: ebooks = [] } = useGetEbooks();

  // Calculate statistics
  const totalUsers = profiles.length;
  const totalBlogs = blogs.length;
  const totalEbooks = ebooks.length;
  const totalDownloads = ebooks.reduce((sum, book) => sum + (book.downloads || 0), 0);
  const pendingEbooks = ebooks.filter(book => book.status === 'pending').length;
  const publishedBlogs = blogs.filter(blog => blog.status === 'published').length;

  // Calculate weekly trends (mock data for now - would need historical data)
  const weeklyStats = {
    users: { current: totalUsers, change: 12, trend: 'up' as const },
    ebooks: { current: totalEbooks, change: 8, trend: 'up' as const },
    downloads: { current: totalDownloads, change: 156, trend: 'up' as const },
    blogs: { current: publishedBlogs, change: 3, trend: 'up' as const },
  };

  const StatCard = ({ title, value, icon: Icon, change, trend, color }: {
    title: string;
    value: number;
    icon: React.ElementType;
    change: number;
    trend: 'up' | 'down';
    color: string;
  }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          {trend === 'up' ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            +{change} from last week
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your platform's performance and key metrics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={weeklyStats.users.current}
          icon={Users}
          change={weeklyStats.users.change}
          trend={weeklyStats.users.trend}
          color="text-blue-500"
        />
        <StatCard
          title="Total eBooks"
          value={weeklyStats.ebooks.current}
          icon={BookOpen}
          change={weeklyStats.ebooks.change}
          trend={weeklyStats.ebooks.trend}
          color="text-green-500"
        />
        <StatCard
          title="Total Downloads"
          value={weeklyStats.downloads.current}
          icon={Download}
          change={weeklyStats.downloads.change}
          trend={weeklyStats.downloads.trend}
          color="text-purple-500"
        />
        <StatCard
          title="Published Blogs"
          value={weeklyStats.blogs.current}
          icon={BookOpen}
          change={weeklyStats.blogs.change}
          trend={weeklyStats.blogs.trend}
          color="text-orange-500"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{pendingEbooks}</div>
            <p className="text-sm text-muted-foreground">eBooks awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Regular Users</span>
              <Badge variant="secondary">
                {profiles.filter(p => p.role === 'user').length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Admins</span>
              <Badge variant="destructive">
                {profiles.filter(p => p.role === 'admin').length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Approved eBooks</span>
              <Badge variant="default">
                {ebooks.filter(e => e.status === 'approved').length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Published Blogs</span>
              <Badge variant="default">
                {publishedBlogs}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Draft Blogs</span>
              <Badge variant="outline">
                {blogs.filter(b => b.status === 'draft').length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;