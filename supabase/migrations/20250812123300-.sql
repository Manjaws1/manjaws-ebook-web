-- Super Admin enforcement

-- 1) Table to store super admins
CREATE TABLE IF NOT EXISTS public.super_admins (
  email text PRIMARY KEY,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;

-- RLS: only admins can view/manage this table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'super_admins' AND policyname = 'Admins can view super_admins'
  ) THEN
    CREATE POLICY "Admins can view super_admins"
    ON public.super_admins
    FOR SELECT
    USING (public.is_user_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'super_admins' AND policyname = 'Admins can manage super_admins'
  ) THEN
    CREATE POLICY "Admins can manage super_admins"
    ON public.super_admins
    FOR ALL
    USING (public.is_user_admin(auth.uid()))
    WITH CHECK (public.is_user_admin(auth.uid()));
  END IF;
END $$;

-- Seed the designated super admin email
INSERT INTO public.super_admins (email)
VALUES ('gbenlekamolideen@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 2) Helper functions
CREATE OR REPLACE FUNCTION public.is_email_super_admin(p_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.super_admins
    WHERE lower(email) = lower(p_email) AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin_by_user(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  SELECT email INTO v_email FROM auth.users WHERE id = p_user_id;
  IF v_email IS NULL THEN
    RETURN FALSE;
  END IF;
  RETURN public.is_email_super_admin(v_email);
END;
$$;

-- 3) Strengthen role-change trigger to protect super admin
CREATE OR REPLACE FUNCTION public.prevent_non_admin_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
    -- Block changes to Super Admin by anyone except the Super Admin themself
    IF public.is_email_super_admin(NEW.email) AND auth.uid() <> NEW.id THEN
      RAISE EXCEPTION 'You cannot change the role of the Super Admin';
    END IF;
    -- Only admins can change roles otherwise
    IF NOT public.is_user_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_non_admin_role_change ON public.profiles;
CREATE TRIGGER trg_prevent_non_admin_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_non_admin_role_change();

-- 4) Prevent non-super-admins from removing or altering super admin from admin_users
CREATE OR REPLACE FUNCTION public.prevent_super_admin_admin_users_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP IN ('UPDATE','DELETE') THEN
    IF public.is_email_super_admin(OLD.email) AND NOT public.is_super_admin_by_user(auth.uid()) THEN
      RAISE EXCEPTION 'You cannot change the role of the Super Admin';
    END IF;
  END IF;
  IF TG_OP = 'UPDATE' THEN
    RETURN NEW;
  ELSE
    RETURN OLD;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_super_admin_admin_users_update ON public.admin_users;
CREATE TRIGGER trg_protect_super_admin_admin_users_update
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.prevent_super_admin_admin_users_change();

DROP TRIGGER IF EXISTS trg_protect_super_admin_admin_users_delete ON public.admin_users;
CREATE TRIGGER trg_protect_super_admin_admin_users_delete
BEFORE DELETE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.prevent_super_admin_admin_users_change();