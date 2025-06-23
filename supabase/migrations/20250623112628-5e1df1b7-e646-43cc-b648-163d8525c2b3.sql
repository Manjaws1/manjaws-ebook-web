
-- Insert the email into admin_users table to grant admin privileges
INSERT INTO public.admin_users (email, full_name, is_active)
VALUES ('gbenlekamolideen@gmail.com', 'Engr Manjaws', true)
ON CONFLICT (email) DO UPDATE SET
  is_active = true,
  updated_at = timezone('utc'::text, now());

-- Also update the existing profile to have admin role if it exists
UPDATE public.profiles 
SET role = 'admin', updated_at = timezone('utc'::text, now())
WHERE email = 'gbenlekamolideen@gmail.com';
