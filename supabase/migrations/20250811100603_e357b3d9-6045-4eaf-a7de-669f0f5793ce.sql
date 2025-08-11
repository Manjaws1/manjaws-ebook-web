-- SECURITY HARDENING MIGRATION
-- 1) Harden SECURITY DEFINER functions with explicit search_path

CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = (SELECT email FROM auth.users WHERE id = user_id)
      AND is_active = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type_param text,
  target_type_param text,
  target_id_param uuid,
  details_param jsonb DEFAULT NULL::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_actions (admin_id, action_type, target_type, target_id, details)
  VALUES (auth.uid(), action_type_param, target_type_param, target_id_param, details_param);
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_download_count(ebook_uuid uuid, user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_downloads (user_id, ebook_id)
    VALUES (user_uuid, ebook_uuid)
    ON CONFLICT (user_id, ebook_id) DO NOTHING;
    
    UPDATE public.ebooks 
    SET downloads = downloads + 1 
    WHERE id = ebook_uuid;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.check_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE email = NEW.email AND is_active = true
    ) THEN
        UPDATE public.profiles 
        SET role = 'admin' 
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 2) Prevent non-admins from changing profiles.role
CREATE OR REPLACE FUNCTION public.prevent_non_admin_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_user_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_non_admin_role_change ON public.profiles;
CREATE TRIGGER trg_prevent_non_admin_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_non_admin_role_change();

-- 3) Update RLS policies to rely on is_user_admin(auth.uid())

-- categories
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- ebooks
DROP POLICY IF EXISTS "Admins can manage all ebooks" ON public.ebooks;
CREATE POLICY "Admins can manage all ebooks"
ON public.ebooks
FOR ALL
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- ebook_categories
DROP POLICY IF EXISTS "Admins can manage all ebook categories" ON public.ebook_categories;
CREATE POLICY "Admins can manage all ebook categories"
ON public.ebook_categories
FOR ALL
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- blogs
DROP POLICY IF EXISTS "Admins can manage all blogs" ON public.blogs;
CREATE POLICY "Admins can manage all blogs"
ON public.blogs
FOR ALL
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- flags
DROP POLICY IF EXISTS "Admins can view all flags" ON public.flags;
CREATE POLICY "Admins can view all flags"
ON public.flags
FOR SELECT
USING (public.is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update flags" ON public.flags;
CREATE POLICY "Admins can update flags"
ON public.flags
FOR UPDATE
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- admin_users
DROP POLICY IF EXISTS "Only admins can delete admin_users" ON public.admin_users;
CREATE POLICY "Only admins can delete admin_users"
ON public.admin_users
FOR DELETE
USING (public.is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can insert admin_users" ON public.admin_users;
CREATE POLICY "Only admins can insert admin_users"
ON public.admin_users
FOR INSERT
WITH CHECK (public.is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can update admin_users" ON public.admin_users;
CREATE POLICY "Only admins can update admin_users"
ON public.admin_users
FOR UPDATE
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can view admin_users" ON public.admin_users;
CREATE POLICY "Only admins can view admin_users"
ON public.admin_users
FOR SELECT
USING (public.is_user_admin(auth.uid()));

-- admin_actions
DROP POLICY IF EXISTS "Only admins can create admin actions" ON public.admin_actions;
CREATE POLICY "Only admins can create admin actions"
ON public.admin_actions
FOR INSERT
WITH CHECK (public.is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can view admin actions" ON public.admin_actions;
CREATE POLICY "Only admins can view admin actions"
ON public.admin_actions
FOR SELECT
USING (public.is_user_admin(auth.uid()));