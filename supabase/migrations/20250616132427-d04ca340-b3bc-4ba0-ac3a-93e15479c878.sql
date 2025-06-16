
-- Create the updated_at function first
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing table and recreate with proper structure
DROP TABLE IF EXISTS public.ebooks CASCADE;

-- Create ebooks table with correct column names
CREATE TABLE public.ebooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    file_url TEXT,
    cover_image TEXT,
    file_size BIGINT,
    chapters INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
    downloads INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_downloads table to track downloads
CREATE TABLE IF NOT EXISTS public.user_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    ebook_id UUID REFERENCES public.ebooks(id) ON DELETE CASCADE NOT NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, ebook_id)
);

-- Insert default categories
INSERT INTO public.categories (name, description) VALUES 
    ('Technology', 'Books about technology, programming, and software development'),
    ('Science', 'Scientific literature and research'),
    ('Fiction', 'Novels and fictional stories'),
    ('Non-Fiction', 'Educational and informational books'),
    ('Business', 'Business and entrepreneurship books'),
    ('Health', 'Health and wellness guides')
ON CONFLICT (name) DO NOTHING;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('ebooks', 'ebooks', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ebooks
DROP POLICY IF EXISTS "Anyone can view approved ebooks" ON public.ebooks;
CREATE POLICY "Anyone can view approved ebooks" ON public.ebooks
    FOR SELECT USING (status = 'approved' OR uploaded_by = auth.uid());

DROP POLICY IF EXISTS "Users can upload ebooks" ON public.ebooks;
CREATE POLICY "Users can upload ebooks" ON public.ebooks
    FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

DROP POLICY IF EXISTS "Users can update their own ebooks" ON public.ebooks;
CREATE POLICY "Users can update their own ebooks" ON public.ebooks
    FOR UPDATE USING (auth.uid() = uploaded_by);

DROP POLICY IF EXISTS "Admins can manage all ebooks" ON public.ebooks;
CREATE POLICY "Admins can manage all ebooks" ON public.ebooks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for categories
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for user_downloads
DROP POLICY IF EXISTS "Users can view their downloads" ON public.user_downloads;
CREATE POLICY "Users can view their downloads" ON public.user_downloads
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can track their downloads" ON public.user_downloads;
CREATE POLICY "Users can track their downloads" ON public.user_downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage policies
DROP POLICY IF EXISTS "Users can upload ebook files" ON storage.objects;
CREATE POLICY "Users can upload ebook files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'ebooks' AND auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "Users can upload cover images" ON storage.objects;
CREATE POLICY "Users can upload cover images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;
CREATE POLICY "Anyone can view files" ON storage.objects
    FOR SELECT USING (bucket_id IN ('ebooks', 'covers'));

-- Triggers for updated_at
DROP TRIGGER IF EXISTS handle_updated_at_ebooks ON public.ebooks;
CREATE TRIGGER handle_updated_at_ebooks
    BEFORE UPDATE ON public.ebooks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_categories ON public.categories;
CREATE TRIGGER handle_updated_at_categories
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to increment download count
CREATE OR REPLACE FUNCTION public.increment_download_count(ebook_uuid UUID, user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_downloads (user_id, ebook_id)
    VALUES (user_uuid, ebook_uuid)
    ON CONFLICT (user_id, ebook_id) DO NOTHING;
    
    UPDATE public.ebooks 
    SET downloads = downloads + 1 
    WHERE id = ebook_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
