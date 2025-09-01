-- Fix profiles table RLS policies to prevent data exposure
-- First, drop existing overlapping policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile and admins can view all" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create more secure and specific policies
-- Users can only view their own basic profile data
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Users can only update their own profile (excluding role changes)
CREATE POLICY "Users can update own profile data" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND (OLD.role = NEW.role OR is_user_admin(auth.uid())) -- Prevent role escalation
);

-- Admins can view all profiles but with explicit admin check
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_user_admin(auth.uid()));

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (is_user_admin(auth.uid()))
WITH CHECK (is_user_admin(auth.uid()));

-- Ensure INSERT policy is secure
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id AND role = 'user'); -- Default to user role only

-- Add policy to prevent unauthorized role changes
CREATE POLICY "Prevent role escalation" 
ON public.profiles 
FOR UPDATE 
USING (
  -- Only allow role changes by admins or super admins
  (OLD.role = NEW.role) OR 
  (is_user_admin(auth.uid()) AND NOT is_email_super_admin(NEW.email)) OR
  (is_super_admin_by_user(auth.uid()))
);