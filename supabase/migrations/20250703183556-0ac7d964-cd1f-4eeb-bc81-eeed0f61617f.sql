
-- Create a security definer function to check if a user is admin
-- This prevents infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create a function to check if user is admin without recursion
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user exists in admin_users table
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (
      SELECT email FROM auth.users WHERE id = user_id
    ) AND is_active = true
  );
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER STABLE;

-- Drop existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create new policies using the security definer function
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.is_user_admin(auth.uid()));

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE USING (public.is_user_admin(auth.uid()));
