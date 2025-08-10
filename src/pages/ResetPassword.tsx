
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Password validation checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>\-_/\\\[\];'`~+=]/.test(password),
  } as const;
  const strengthScore = Number(passwordChecks.length) + Number(passwordChecks.uppercase) + Number(passwordChecks.lowercase) + Number(passwordChecks.number) + Number(passwordChecks.special);
  const strengthPercent = (strengthScore / 5) * 100;
  const strengthLabel = strengthScore <= 2 ? 'Weak' : strengthScore <= 4 ? 'Medium' : 'Strong';
  const allPasswordValid = Object.values(passwordChecks).every(Boolean) && password === confirmPassword;

  useEffect(() => {
    // Ensure the password recovery session is present
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // If no session token, user likely opened the page directly
        toast({ title: "Link expired", description: "Please request a new password reset link.", variant: "destructive" });
      }
    });
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allPasswordValid) {
      toast({ title: "Weak password", description: "Please meet all password requirements.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "You can now log in with your new password." });
      await supabase.auth.signOut();
      navigate("/login");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h1>
            <p className="text-sm text-gray-600">Enter and confirm your new password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
              <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" placeholder="Enter new password" />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1" placeholder="Confirm new password" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Password strength</span>
                <span className="font-medium">{strengthLabel}</span>
              </div>
              <Progress value={strengthPercent} />
            </div>

            <div className="rounded-md bg-gray-50 p-3 text-sm">
              <p className="font-medium mb-2">Password requirements</p>
              <ul className="space-y-1">
                <li className={passwordChecks.uppercase ? "text-green-600" : "text-gray-500"}>Has uppercase letter</li>
                <li className={passwordChecks.lowercase ? "text-green-600" : "text-gray-500"}>Has lowercase letter</li>
                <li className={passwordChecks.number ? "text-green-600" : "text-gray-500"}>Has number</li>
                <li className={passwordChecks.special ? "text-green-600" : "text-gray-500"}>Has special character</li>
                <li className={passwordChecks.length ? "text-green-600" : "text-gray-500"}>Minimum length 8</li>
                <li className={password && confirmPassword && password === confirmPassword ? "text-green-600" : "text-gray-500"}>Passwords match</li>
              </ul>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary-700" disabled={!allPasswordValid || isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
