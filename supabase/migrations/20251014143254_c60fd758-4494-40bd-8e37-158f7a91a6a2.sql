-- Step 1: Create app_role enum for role management
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Step 2: Create user_roles table (CRITICAL: separate roles from profiles)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Step 3: Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Step 5: Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role
FROM public.profiles
WHERE role IN ('admin', 'moderator', 'user')
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 6: Update is_user_admin function to use new role system
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(user_id, 'admin')
$$;

-- Step 7: CRITICAL - Block anonymous access to profiles table (prevents email harvesting)
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Step 8: CRITICAL - Block anonymous access to admin_users table
CREATE POLICY "Block anonymous access to admin_users"
ON public.admin_users
FOR SELECT
TO anon
USING (false);

-- Step 9: Add RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 10: Fix increment_download_count to validate user owns the action
CREATE OR REPLACE FUNCTION public.increment_download_count(ebook_uuid UUID, user_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- SECURITY: Verify the caller is the user performing the download
    IF auth.uid() != user_uuid THEN
        RAISE EXCEPTION 'Cannot download on behalf of another user';
    END IF;
    
    INSERT INTO public.user_downloads (user_id, ebook_id)
    VALUES (user_uuid, ebook_uuid)
    ON CONFLICT (user_id, ebook_id) DO NOTHING;
    
    UPDATE public.ebooks 
    SET downloads = downloads + 1 
    WHERE id = ebook_uuid;
END;
$$;

-- Step 11: Remove role column from profiles (will be done in future migration after code updates)
-- ALTER TABLE public.profiles DROP COLUMN role;
-- (Commented out - will be done after all code is updated)