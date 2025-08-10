-- Fix security vulnerability: Restrict profiles SELECT policy to allow users to only view their own profile
-- and admins to view all profiles (for admin functionality)

-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a new, more secure policy that allows:
-- 1. Users to view only their own profile
-- 2. Admins to view all profiles (for admin dashboard functionality)
CREATE POLICY "Users can view own profile and admins can view all" 
ON public.profiles 
FOR SELECT 
USING (
  -- User can view their own profile
  auth.uid() = id 
  OR 
  -- Admins can view all profiles
  is_user_admin(auth.uid())
);