
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Flag,
  BarChart,
  Settings,
  LogOut,
  Search,
  Upload,
  Download,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

// Dashboard stats for demo
const dashboardStats = {
  totalUsers: 1254,
  totalEbooks: 528,
  totalDownloads: 8472,
  flaggedContent: 7,
  pendingApprovals: 15,
};

// Recent activity for demo
const recentActivity = [
  {
    id: 1,
    type: "user_registered",
    content: "New user registered: Sarah Johnson",
    time: "10 minutes ago",
  },
  {
    id: 2,
    type: "ebook_uploaded",
    content: "New eBook uploaded: Machine Learning for Beginners",
    time: "25 minutes ago",
  },
  {
    id: 3,
    type: "ebook_downloaded",
    content: "eBook downloaded: Web Development with React",
    time: "45 minutes ago",
  },
  {
    id: 4,
    type: "content_flagged",
    content: "Content flagged: Unauthorized Material in 'Programming 101'",
    time: "1 hour ago",
  },
  {
    id: 5,
    type: "ebook_approved",
    content: "eBook approved: Cloud Computing Fundamentals",
    time: "2 hours ago",
  },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-primary text-white fixed inset-y-0 left-0 z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-primary-800">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">Manjaws</span>
            <span className="text-secondary ml-1">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-grow p-4">
          <ul className="space-y-1">
            <li>
              <Link
                to="/admin"
                className="flex items-center px-4 py-3 rounded-md bg-primary-800 text-white"
              >
                <BarChart className="mr-3 h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center px-4 py-3 rounded-md hover:bg-primary-700 text-gray-200 hover:text-white"
              >
                <Users className="mr-3 h-5 w-5" />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/ebooks"
                className="flex items-center px-4 py-3 rounded-md hover:bg-primary-700 text-gray-200 hover:text-white"
              >
                <BookOpen className="mr-3 h-5 w-5" />
                <span>eBooks</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/flags"
                className="flex items-center px-4 py-3 rounded-md hover:bg-primary-700 text-gray-200 hover:text-white"
              >
                <Flag className="mr-3 h-5 w-5" />
                <span>Flags</span>
                {dashboardStats.flaggedContent > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-red-500">
                    {dashboardStats.flaggedContent}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reports"
                className="flex items-center px-4 py-3 rounded-md hover:bg-primary-700 text-gray-200 hover:text-white"
              >
                <BarChart className="mr-3 h-5 w-5" />
                <span>Reports</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className="flex items-center px-4 py-3 rounded-md hover:bg-primary-700 text-gray-200 hover:text-white"
              >
                <Settings className="mr-3 h-5 w-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-primary-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-200 hover:text-white hover:bg-primary-700"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-primary text-white p-4 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold">Manjaws</span>
          <span className="text-secondary ml-1">Admin</span>
        </Link>
        
        <Button variant="ghost" className="text-white">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary text-white flex md:hidden z-10">
        <Link to="/admin" className="flex-1 flex flex-col items-center p-3 bg-primary-800">
          <BarChart className="h-5 w-5" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link to="/admin/users" className="flex-1 flex flex-col items-center p-3">
          <Users className="h-5 w-5" />
          <span className="text-xs mt-1">Users</span>
        </Link>
        <Link to="/admin/ebooks" className="flex-1 flex flex-col items-center p-3">
          <BookOpen className="h-5 w-5" />
          <span className="text-xs mt-1">eBooks</span>
        </Link>
        <Link to="/admin/more" className="flex-1 flex flex-col items-center p-3">
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">More</span>
        </Link>
      </div>
      
      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-16 md:pb-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          
          {/* Stats overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-semibold">{dashboardStats.totalUsers}</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total eBooks</p>
                  <h3 className="text-2xl font-semibold">{dashboardStats.totalEbooks}</h3>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Downloads</p>
                  <h3 className="text-2xl font-semibold">{dashboardStats.totalDownloads}</h3>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Download className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Flagged Content</p>
                  <h3 className="text-2xl font-semibold">{dashboardStats.flaggedContent}</h3>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <Flag className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Approval</p>
                  <h3 className="text-2xl font-semibold">{dashboardStats.pendingApprovals}</h3>
                </div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start border-b border-gray-100 pb-4">
                      <div className="mr-4">
                        {activity.type === "user_registered" && (
                          <div className="p-2 bg-blue-100 rounded-full">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        {activity.type === "ebook_uploaded" && (
                          <div className="p-2 bg-green-100 rounded-full">
                            <Upload className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                        {activity.type === "ebook_downloaded" && (
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Download className="h-5 w-5 text-purple-600" />
                          </div>
                        )}
                        {activity.type === "content_flagged" && (
                          <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          </div>
                        )}
                        {activity.type === "ebook_approved" && (
                          <div className="p-2 bg-secondary-100 rounded-full">
                            <CheckCircle className="h-5 w-5 text-secondary-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.content}</p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <Button variant="link" className="text-primary">
                    View All Activity
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-5 w-5" />
                    <span>Add New User</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="mr-2 h-5 w-5" />
                    <span>Approve Pending eBooks</span>
                    <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-amber-500 text-white">
                      {dashboardStats.pendingApprovals}
                    </span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Flag className="mr-2 h-5 w-5" />
                    <span>Review Flagged Content</span>
                    <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-red-500 text-white">
                      {dashboardStats.flaggedContent}
                    </span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart className="mr-2 h-5 w-5" />
                    <span>Generate Monthly Report</span>
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h2 className="text-lg font-semibold mb-4">System Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-100 rounded-full px-2.5 py-0.5">
                      <CheckCircle className="w-3 h-3 mr-1" /> Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage</span>
                    <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-100 rounded-full px-2.5 py-0.5">
                      <CheckCircle className="w-3 h-3 mr-1" /> 72% Free
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API</span>
                    <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-100 rounded-full px-2.5 py-0.5">
                      <CheckCircle className="w-3 h-3 mr-1" /> Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Search Engine</span>
                    <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-100 rounded-full px-2.5 py-0.5">
                      <CheckCircle className="w-3 h-3 mr-1" /> Operational
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
