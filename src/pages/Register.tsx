
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

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
    if (user) {
      navigate('/browse');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!allPasswordValid) {
      toast({
        title: "Weak password",
        description: "Please meet all password requirements before continuing.",
        variant: "destructive",
      });
      return;
    }
    
    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "You must agree to the terms of service",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signUp(email, password, name);
    
    if (!error) {
      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary-700"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Create a password"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Confirm your password"
                />
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
            </div>

            <div className="flex items-center">
              <Checkbox
                id="agree-terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(!!checked)}
              />
              <label
                htmlFor="agree-terms"
                className="ml-2 block text-sm text-gray-900"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="font-medium text-primary hover:text-primary-700"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-primary hover:text-primary-700"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-700"
                disabled={isLoading || !allPasswordValid || !agreeTerms}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
