-- Enable real-time replication on key tables
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.admin_users REPLICA IDENTITY FULL;
ALTER TABLE public.ebooks REPLICA IDENTITY FULL;
ALTER TABLE public.blogs REPLICA IDENTITY FULL;
ALTER TABLE public.admin_actions REPLICA IDENTITY FULL;
ALTER TABLE public.categories REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ebooks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blogs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_actions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;