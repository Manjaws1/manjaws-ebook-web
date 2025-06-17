
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { User, Mail, Calendar, Shield, UserCircle } from "lucide-react";

const Profile = () => {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Profile</h1>
            <p className="text-lg text-muted-foreground">
              View your account information
            </p>
          </div>

          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary to-primary-600 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user.email} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xl font-semibold">
                      {profile?.full_name ? getInitials(profile.full_name) : user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {profile?.full_name || "User"}
                    </h2>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={isAdmin ? "destructive" : "secondary"} className="text-sm">
                        {isAdmin ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <UserCircle className="h-3 w-3 mr-1" />
                            User
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-primary mb-2 block">
                      Full Name
                    </label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-medium">
                        {profile?.full_name || "Not specified"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary mb-2 block">
                      Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-medium">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary mb-2 block">
                      Role
                    </label>
                    <div className="flex items-center space-x-2">
                      {isAdmin ? (
                        <Shield className="h-4 w-4 text-red-600" />
                      ) : (
                        <UserCircle className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="text-lg font-medium capitalize">
                        {profile?.role || "user"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-primary mb-2 block">
                      Member Since
                    </label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-medium">
                        {formatDate(profile?.created_at || user.created_at)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary mb-2 block">
                      Account Status
                    </label>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Active
                    </Badge>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary mb-2 block">
                      User ID
                    </label>
                    <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                      {user.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {isAdmin ? "Admin" : "Member"}
                    </div>
                    <div className="text-sm text-gray-600">Account Type</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {user.email_confirmed_at ? "Verified" : "Pending"}
                    </div>
                    <div className="text-sm text-gray-600">Email Status</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {formatDate(user.last_sign_in_at || user.created_at)}
                    </div>
                    <div className="text-sm text-gray-600">Last Sign In</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
