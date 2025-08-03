-- Create flags table for reported ebooks
CREATE TABLE public.flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ebook_id UUID NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT
);

-- Enable RLS on flags table
ALTER TABLE public.flags ENABLE ROW LEVEL SECURITY;

-- Create policies for flags table
CREATE POLICY "Admins can view all flags" 
ON public.flags 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update flags" 
ON public.flags 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can create flags" 
ON public.flags 
FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own flags" 
ON public.flags 
FOR SELECT 
USING (auth.uid() = reporter_id);

-- Add notification preferences to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "email_updates": true,
  "new_ebooks": true,
  "admin_announcements": true
}'::jsonb;

-- Add 2FA enabled flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX idx_flags_ebook_id ON public.flags(ebook_id);
CREATE INDEX idx_flags_reporter_id ON public.flags(reporter_id);
CREATE INDEX idx_flags_status ON public.flags(status);

-- Add trigger for updated_at on flags table
CREATE TRIGGER update_flags_updated_at
  BEFORE UPDATE ON public.flags
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();