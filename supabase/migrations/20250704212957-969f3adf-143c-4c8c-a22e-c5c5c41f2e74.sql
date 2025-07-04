-- Fix infinite recursion in profiles table RLS policies
-- Drop all existing conflicting policies on profiles table
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create clean, non-recursive policies using security definer function
-- Users can view all profiles (needed for app functionality)
CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT 
USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE 
USING (auth.uid() = id);

-- Admins can view all profiles (using security definer function)
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT 
USING (public.is_user_admin(auth.uid()));

-- Admins can update all profiles (using security definer function)
CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE 
USING (public.is_user_admin(auth.uid()));

-- Admins can delete profiles (using security definer function)
CREATE POLICY "Admins can delete profiles" ON public.profiles
FOR DELETE 
USING (public.is_user_admin(auth.uid()));